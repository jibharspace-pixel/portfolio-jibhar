import type { Express } from "express";
import { type Server } from "http";
import express from "express";
import rateLimit from "express-rate-limit";
import { uploadsDir } from "../middleware/upload";
import { registerProjectRoutes } from "./projects";
import { registerMediaRoutes } from "./media";
import { registerBlogRoutes } from "./blog";
import { registerFileRoutes } from "./files";
import { registerServiceRoutes } from "./services";
import { registerContactRoutes } from "./contact";
import { registerAnalyticsRoutes } from "./analytics";

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again later." },
});

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.use("/uploads", express.static(uploadsDir));

  app.get("/api/health", (_req, res) => res.send("OK"));

  app.post("/api/admin/verify", adminLoginLimiter, (req, res) => {
    const password = process.env.ADMIN_PASSWORD;
    if (!password || req.body?.password !== password) return res.sendStatus(401);
    res.sendStatus(200);
  });

  registerProjectRoutes(app);
  registerMediaRoutes(app);
  registerBlogRoutes(app);
  registerFileRoutes(app);
  registerServiceRoutes(app);
  registerContactRoutes(app);
  registerAnalyticsRoutes(app);

  return httpServer;
}
