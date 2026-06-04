import type { Express, Request, Response } from "express";
import { checkAdmin } from "../helpers";
import * as storage from "../storage";

export function registerFileRoutes(app: Express): void {
  app.get("/api/files", async (_req, res) => {
    res.json(await storage.getFiles());
  });

  app.post("/api/files/:id/download", async (req, res) => {
    await storage.incrementFileDownloads(req.params.id);
    const files = await storage.getFiles();
    const file = files.find(f => f.id === req.params.id);
    file ? res.json(file) : res.sendStatus(404);
  });

  app.post("/api/admin/files", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const file = await storage.createFile(req.body);
    res.status(201).json(file);
  });

  app.put("/api/admin/files/:id", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const updated = await storage.updateFile(req.params.id, req.body);
    updated ? res.json(updated) : res.sendStatus(404);
  });

  app.delete("/api/admin/files/:id", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const ok = await storage.deleteFile(req.params.id);
    res.sendStatus(ok ? 204 : 404);
  });
}
