import type { Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { db, type MediaItem } from "../db";
import { checkAdmin } from "../helpers";
import { upload, uploadsDir } from "../middleware/upload";

export function registerMediaRoutes(app: Express): void {
  app.post("/api/admin/projects/:id/upload", upload.single("file"), (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
    const mime = req.file.mimetype;
    const media_type = mime.startsWith("image/") ? "image" : mime.startsWith("video/") ? "video" : null;
    if (!media_type) return res.status(400).json({ error: "Type non supporté" });
    const item: MediaItem = {
      id: randomUUID(), url: `/uploads/${req.file.filename}`,
      media_type, project_id: req.params.id, filename: req.file.filename,
    };
    const list = db.media.get(req.params.id) ?? [];
    list.push(item);
    db.media.set(req.params.id, list);
    res.status(201).json(item);
  });

  app.get("/api/admin/projects/:id/media", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    res.json(db.media.get(req.params.id) ?? []);
  });

  app.delete("/api/admin/media/:media_id", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    for (const [pid, items] of Array.from(db.media.entries())) {
      const idx = items.findIndex((m: MediaItem) => m.id === req.params.media_id);
      if (idx !== -1) {
        const [item] = items.splice(idx, 1);
        db.media.set(pid, items);
        fs.unlink(path.join(uploadsDir, item.filename), () => {});
        return res.sendStatus(204);
      }
    }
    res.sendStatus(404);
  });
}
