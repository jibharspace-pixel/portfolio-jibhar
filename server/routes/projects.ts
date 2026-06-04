import type { Express, Request, Response } from "express";
import { randomUUID } from "crypto";
import { db, persist, type Project } from "../db";
import { checkAdmin, projectsWithMedia } from "../helpers";

export function registerProjectRoutes(app: Express): void {
  app.get("/api/projects", (_req, res) => res.json(projectsWithMedia()));

  app.get("/api/projects/:id", (req, res) => {
    const p = projectsWithMedia().find(x => x.id === req.params.id);
    p ? res.json(p) : res.sendStatus(404);
  });

  app.post("/api/admin/projects", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const p: Project = { id: randomUUID(), ...req.body, media: [] };
    if (!p.demo_url) delete p.demo_url;
    if (!p.download_url) delete p.download_url;
    db.projects.unshift(p);
    persist();
    res.status(201).json(p);
  });

  app.put("/api/admin/projects/:id", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const idx = db.projects.findIndex(x => x.id === req.params.id);
    if (idx === -1) return res.sendStatus(404);
    db.projects[idx] = { ...db.projects[idx], ...req.body };
    persist();
    res.json(db.projects[idx]);
  });

  app.delete("/api/admin/projects/:id", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const before = db.projects.length;
    db.projects = db.projects.filter(x => x.id !== req.params.id);
    persist();
    db.projects.length < before ? res.sendStatus(204) : res.sendStatus(404);
  });
}
