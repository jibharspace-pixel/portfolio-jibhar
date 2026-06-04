import type { Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { db, persist } from "../db";
import type { ContactMessage } from "../db";
import { checkAdmin } from "../helpers";
import { upload, uploadsDir } from "../middleware/upload";

export function registerContactRoutes(app: Express): void {
  app.get("/api/contact", (_req, res) => res.json(db.contact));

  app.put("/api/admin/contact", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    Object.assign(db.contact, req.body);
    persist();
    res.json(db.contact);
  });

  app.get("/api/site-content", (_req, res) => res.json(db.site_content));

  app.put("/api/admin/site-content", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    Object.assign(db.site_content, req.body);
    persist();
    res.json(db.site_content);
  });

  app.post("/api/admin/upload-cv", upload.single("file"), (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      fs.unlink(path.join(uploadsDir, req.file.filename), () => {});
      return res.status(400).json({ error: "Format non supporté (PDF, DOC, DOCX uniquement)" });
    }
    // Delete old CV file if exists
    if (db.site_content.cv_url) {
      const oldFile = db.site_content.cv_url.replace("/uploads/", "");
      fs.unlink(path.join(uploadsDir, oldFile), () => {});
    }
    db.site_content.cv_url = `/uploads/${req.file.filename}`;
    persist();
    res.json({ cv_url: db.site_content.cv_url });
  });

  app.delete("/api/admin/cv", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    if (db.site_content.cv_url) {
      const oldFile = db.site_content.cv_url.replace("/uploads/", "");
      fs.unlink(path.join(uploadsDir, oldFile), () => {});
      db.site_content.cv_url = undefined;
    }
    persist();
    res.sendStatus(204);
  });

  app.post("/api/contact/submit", (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body ?? {};
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Nom, email et message sont requis." });
    }
    const msg: ContactMessage = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() ?? "",
      message: message.trim(),
      created_at: new Date().toISOString(),
      read: false,
    };
    db.messages.push(msg);
    persist();
    res.json({ success: true });
  });

  app.get("/api/admin/messages", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    res.json([...db.messages].reverse());
  });

  app.put("/api/admin/messages/:id/read", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const msg = db.messages.find(m => m.id === req.params.id);
    if (!msg) return res.sendStatus(404);
    msg.read = true;
    persist();
    res.json(msg);
  });

  app.delete("/api/admin/messages/:id", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    db.messages = db.messages.filter(m => m.id !== req.params.id);
    persist();
    res.sendStatus(204);
  });

  app.get("/api/skills", (_req, res) => res.json([
    { id: "1", title: "Data & BI",     icon: "BarChart3", skills: ["Power BI", "Tableau", "SQL", "DAX", "Python (Pandas)"] },
    { id: "2", title: "Développement", icon: "Code2",     skills: ["React / TypeScript", "Node.js", "PostgreSQL"] },
    { id: "3", title: "Supply Chain",  icon: "Package",   skills: ["Gestion des stocks", "Optimisation des flux", "ERP", "Lean"] },
    { id: "4", title: "IA & ML",       icon: "Brain",     skills: ["Scikit-learn", "TensorFlow", "NLP", "Prévision temporelle"] },
  ]));
}
