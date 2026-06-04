import type { Express, Request, Response } from "express";
import { checkAdmin } from "../helpers";
import * as storage from "../storage";

// Simple in-memory page views (not critical to persist)
const pageViews = new Map<string, number>();

export function registerAnalyticsRoutes(app: Express): void {
  app.post("/api/track", (req, res) => {
    if (req.body?.event_type === "pageview") {
      const p = req.body.path ?? "/";
      pageViews.set(p, (pageViews.get(p) ?? 0) + 1);
    }
    res.sendStatus(200);
  });

  app.get("/api/admin/stats", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const [posts, files, cvCount] = await Promise.all([
      storage.getBlogPosts(),
      storage.getFiles(),
      storage.getCvDownloadCount(),
    ]);
    const blogViews = posts.reduce((a, p) => a + (p.view_count ?? 0), 0);
    const fileDownloads = files.reduce((a, f) => a + f.download_count, 0);
    res.json({
      total_page_views: Array.from(pageViews.values()).reduce((a, b) => a + b, 0),
      total_blog_views: blogViews,
      total_downloads: fileDownloads,
      blog_count: posts.length,
      published_blog_count: posts.filter(p => p.status === "published").length,
      file_count: files.length,
      media_count: 0,
      cv_downloads: cvCount,
      page_views: Object.fromEntries(pageViews),
    });
  });
}
