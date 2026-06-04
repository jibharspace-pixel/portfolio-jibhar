import type { Express, Request, Response } from "express";
import { randomUUID } from "crypto";
import { checkAdmin } from "../helpers";
import * as storage from "../storage";

export function registerProjectRoutes(app: Express): void {
  app.get("/api/projects", async (_req, res) => {
    res.json(await storage.getProjects());
  });

  app.get("/api/projects/:id", async (req, res) => {
    const all = await storage.getProjects();
    const p = all.find(x => x.id === req.params.id);
    p ? res.json(p) : res.sendStatus(404);
  });

  app.post("/api/admin/projects", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const p = await storage.createProject(req.body);
    res.status(201).json(p);
  });

  app.put("/api/admin/projects/:id", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const p = await storage.updateProject(req.params.id, req.body);
    p ? res.json(p) : res.sendStatus(404);
  });

  app.delete("/api/admin/projects/:id", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const ok = await storage.deleteProject(req.params.id);
    res.sendStatus(ok ? 204 : 404);
  });
}
