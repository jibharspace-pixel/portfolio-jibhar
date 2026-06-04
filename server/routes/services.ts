import type { Express, Request, Response } from "express";
import { db, persist } from "../db";
import { checkAdmin } from "../helpers";

export function registerServiceRoutes(app: Express): void {
  app.get("/api/services", (_req, res) => res.json(db.services));

  app.put("/api/admin/services", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    persist();
    db.services = req.body.services ?? req.body;
    res.json(db.services);
  });
}
