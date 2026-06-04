import type { Express, Request, Response } from "express";
import { checkAdmin, readTime } from "../helpers";
import * as storage from "../storage";

export function registerBlogRoutes(app: Express): void {
  app.get("/api/blog", async (_req, res) => {
    const all = await storage.getBlogPosts();
    res.json(all.filter(p => p.status === "published"));
  });

  app.get("/api/admin/blog", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    res.json(await storage.getBlogPosts());
  });

  app.get("/api/blog/:slug", async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) return res.sendStatus(404);
    await storage.incrementBlogViews(post.id);
    res.json({ ...post, view_count: (post.view_count ?? 0) + 1 });
  });

  app.post("/api/admin/blog", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const post = await storage.createBlogPost({
      ...req.body,
      read_time: readTime(req.body.content ?? ""),
    });
    res.status(201).json(post);
  });

  app.put("/api/admin/blog/:id", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const updated = await storage.updateBlogPost(req.params.id, {
      ...req.body,
      read_time: readTime(req.body.content ?? ""),
    });
    updated ? res.json(updated) : res.sendStatus(404);
  });

  app.delete("/api/admin/blog/:id", async (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const ok = await storage.deleteBlogPost(req.params.id);
    res.sendStatus(ok ? 204 : 404);
  });
}
