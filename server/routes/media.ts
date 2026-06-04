import type { Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import type { MediaItem } from "../../shared/schema";
import { checkAdmin } from "../helpers";
import { upload, uploadsDir } from "../middleware/upload";
import * as storage from "../storage";

export function registerMediaRoutes(app: Express): void {
  app.post("/api/admin/projects/:id/upload", upload.single("file"), async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
    const mime = req.file.mimetype;
    const media_type = mime.startsWith("image/") ? "image" : mime.startsWith("video/") ? "video" : null;
    if (!media_type) return res.status(400).json({ error: "Type non supporté" });
    const item: MediaItem = {
      id: randomUUID(), url: `/uploads/${req.file.filename}`,
      media_type, project_id: req.params.id, filename: req.file.filename,
    };
    await storage.addProjectMedia(req.params.id, item);
    res.status(201).json(item);
  });

  app.get("/api/admin/projects/:id/media", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    res.json(await storage.getProjectMedia(req.params.id));
  });

  app.delete("/api/admin/media/:media_id", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const removed = await storage.removeProjectMedia(req.params.media_id);
    if (removed) {
      fs.unlink(path.join(uploadsDir, removed.filename), () => {});
      return res.sendStatus(204);
    }
    res.sendStatus(404);
  });
}
