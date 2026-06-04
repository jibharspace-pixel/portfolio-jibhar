import type { Express, Request, Response } from "express";
import { checkAdmin } from "../helpers";
import * as storage from "../storage";

export function registerServiceRoutes(app: Express): void {
  app.get("/api/services", async (_req, res) => {
    res.json(await storage.getServices());
  });

  app.put("/api/admin/services", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const svcs = await storage.updateServices(req.body.services ?? req.body);
    res.json(svcs);
  });
}
