import type { Request } from "express";
import { db } from "./db";
import type { Project } from "./db";

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function readTime(content: string): number {
  return Math.max(1, Math.floor(content.split(/\s+/).length / 200));
}

export function checkAdmin(req: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  return req.headers["x-admin-password"] === password;
}

export function projectsWithMedia(): Project[] {
  return db.projects.map(p => ({
    ...p,
    media: db.media.get(p.id) ?? [],
  }));
}
