import type { Express, Request, Response } from "express";
import { randomUUID } from "crypto";
import { db, persist, type BlogPost } from "../db";
import { checkAdmin, today, readTime } from "../helpers";

export function registerBlogRoutes(app: Express): void {
  app.get("/api/blog", (_req, res) => {
    res.json(db.blog.filter(p => p.status === "published"));
  });

  app.get("/api/admin/blog", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    res.json(db.blog);
  });

  app.get("/api/blog/:slug", (req, res) => {
    const post = db.blog.find(p => p.slug === req.params.slug && p.status === "published");
    if (!post) return res.sendStatus(404);
    post.view_count += 1;
    db.blog_views.set(req.params.slug, (db.blog_views.get(req.params.slug) ?? 0) + 1);
    res.json(post);
  });

  app.post("/api/admin/blog", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const post: BlogPost = {
      id: randomUUID(), created_at: today(), view_count: 0,
      read_time: readTime(req.body.content ?? ""), ...req.body,
    };
    db.blog.unshift(post);
    persist();
    res.status(201).json(post);
  });

  app.put("/api/admin/blog/:id", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const idx = db.blog.findIndex(x => x.id === req.params.id);
    if (idx === -1) return res.sendStatus(404);
    persist();
    db.blog[idx] = { ...db.blog[idx], ...req.body, read_time: readTime(req.body.content ?? db.blog[idx].content) };
    res.json(db.blog[idx]);
  });

  app.delete("/api/admin/blog/:id", (req: Request, res: Response) => {
    if (!checkAdmin(req)) return res.sendStatus(401);
    const before = db.blog.length;
    db.blog = db.blog.filter(x => x.id !== req.params.id);
    persist();
    db.blog.length < before ? res.sendStatus(204) : res.sendStatus(404);
  });
}
