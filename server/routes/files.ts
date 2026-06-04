import type { Express, Request, Response } from "express";
import { randomUUID } from "crypto";
import { db, persist, type FreeFile } from "../db";
import { checkAdmin, today } from "../helpers";

export function registerFileRoutes(app: Express): void {
  app.get("/api/files", (_req, res) => res.json(db.files));

  app.post("/api/files/:id/download", (req, res) => {
    const file = db.files.find(f => f.id === req.params.id);
    if (!file) return res.sendStatus(404);
    file.download_count += 1;
    res.json(file);
  });

  app.post("/api/admin/files", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const file: FreeFile = { id: randomUUID(), download_count: 0, created_at: today(), ...req.body };
    db.files.push(file);
    res.status(201).json(file);
  });

  app.put("/api/admin/files/:id", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const idx = db.files.findIndex(f => f.id === req.params.id);
    if (idx === -1) return res.sendStatus(404);
    persist();
    db.files[idx] = { ...db.files[idx], ...req.body, id: db.files[idx].id, download_count: db.files[idx].download_count, created_at: db.files[idx].created_at };
    res.json(db.files[idx]);
  });

  app.delete("/api/admin/files/:id", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const before = db.files.length;
    persist();
    db.files = db.files.filter(f => f.id !== req.params.id);
    db.files.length < before ? res.sendStatus(204) : res.sendStatus(404);
  });
}
