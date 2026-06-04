import type { Express, Request, Response } from "express";
import { db } from "../db";
import { checkAdmin } from "../helpers";

export function registerAnalyticsRoutes(app: Express): void {
  app.post("/api/track", (req, res) => {
    if (req.body?.event_type === "pageview") {
      const p = req.body.path ?? "/";
      db.page_views.set(p, (db.page_views.get(p) ?? 0) + 1);
    }
    res.sendStatus(200);
  });

  app.get("/api/admin/stats", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const blogViews =
      Array.from(db.blog_views.values()).reduce((a, b) => a + b, 0) +
      db.blog.reduce((a, p) => a + p.view_count, 0);
    const mediaCount = Array.from(db.media.values()).reduce((a, v) => a + v.length, 0);
    res.json({
      total_page_views: Array.from(db.page_views.values()).reduce((a, b) => a + b, 0),
      total_blog_views: blogViews,
      total_downloads: db.files.reduce((a, f) => a + f.download_count, 0),
      blog_count: db.blog.length,
      published_blog_count: db.blog.filter(p => p.status === "published").length,
      file_count: db.files.length,
      media_count: mediaCount,
      page_views: Object.fromEntries(db.page_views),
    });
  });
}
