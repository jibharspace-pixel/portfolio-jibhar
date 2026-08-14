import type { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { checkAdmin } from "../helpers";
import * as storage from "../storage";

// Endpoint public : on plafonne pour eviter qu'il serve a inonder la table.
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives, réessayez dans quelques minutes." },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function registerContactRoutes(app: Express): void {
  app.get("/api/contact", async (_req, res) => {
    res.json(await storage.getContact());
  });

  app.put("/api/admin/contact", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    res.json(await storage.updateContact(req.body));
  });

  app.get("/api/site-content", async (_req, res) => {
    res.json(await storage.getSiteContent());
  });

  app.put("/api/admin/site-content", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    res.json(await storage.updateSiteContent(req.body));
  });

  // CV URL (no file upload on free hosting — use external URL)
  app.put("/api/admin/cv-url", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const { cv_url } = req.body;
    res.json(await storage.updateSiteContent({ cv_url: cv_url ?? null }));
  });

  // Track CV download
  app.post("/api/cv/download", async (req: Request, res: Response) => {
    const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    await storage.trackCvDownload(ip, userAgent);
    res.json({ success: true });
  });

  app.get("/api/admin/cv-downloads", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const count = await storage.getCvDownloadCount();
    const history = await storage.getCvDownloadHistory();
    res.json({ count, history });
  });

  // Contact form
  app.post("/api/contact/submit", async (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body ?? {};
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Nom, email et message sont requis." });
    }
    const msg = await storage.createMessage({ name: name.trim(), email: email.trim(), subject: subject?.trim() ?? "", message: message.trim() });
    res.json({ success: true, id: msg.id });
  });

  app.get("/api/admin/messages", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    res.json(await storage.getMessages());
  });

  app.put("/api/admin/messages/:id/read", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    await storage.markMessageRead(req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/messages/:id", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    await storage.deleteMessage(req.params.id);
    res.sendStatus(204);
  });

  // ── Subscribers (capture email contre ressources gratuites) ──
  app.post("/api/subscribe", subscribeLimiter, async (req: Request, res: Response) => {
    const { email, source, consent_text } = req.body ?? {};
    if (!email?.trim() || !EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ error: "Adresse email invalide." });
    }
    const ip = req.headers["x-forwarded-for"]?.toString() ?? req.socket.remoteAddress;
    const sub = await storage.createSubscriber({
      email: email.trim(),
      source: (source ?? "site").toString().slice(0, 40),
      consent_text: (consent_text ?? "").toString().slice(0, 500),
      ip,
    });
    // "already" reste interne : ne pas reveler qui est deja inscrit.
    res.json({ success: true });
    void sub;
  });

  app.get("/api/admin/subscribers", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    res.json(await storage.getSubscribers());
  });

  app.delete("/api/admin/subscribers/:id", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    await storage.deleteSubscriber(req.params.id);
    res.sendStatus(204);
  });

  app.get("/api/skills", (_req, res) => res.json([
    { id: "1", title: "Data & BI",     icon: "BarChart3", skills: ["Power BI", "Tableau", "SQL", "DAX", "Python (Pandas)"] },
    { id: "2", title: "Développement", icon: "Code2",     skills: ["React / TypeScript", "Node.js", "PostgreSQL"] },
    { id: "3", title: "Supply Chain",  icon: "Package",   skills: ["Gestion des stocks", "Optimisation des flux", "ERP", "Lean"] },
    { id: "4", title: "IA & ML",       icon: "Brain",     skills: ["Scikit-learn", "TensorFlow", "NLP", "Prévision temporelle"] },
  ]));
}
