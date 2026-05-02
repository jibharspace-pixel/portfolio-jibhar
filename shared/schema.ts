import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Media item
export const mediaItemSchema = z.object({
  id: z.string(),
  url: z.string(),
  media_type: z.enum(["image", "video"]),
  project_id: z.string(),
  filename: z.string(),
});
export type MediaItem = z.infer<typeof mediaItemSchema>;

// Project
export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  problem: z.string(),
  solution: z.string(),
  result: z.string(),
  technologies: z.array(z.string()),
  category: z.enum(["data", "web", "automation", "ai"]),
  demoUrl: z.string().optional(),
  downloadUrl: z.string().optional(),
  media: z.array(mediaItemSchema).optional(),
});
export type Project = z.infer<typeof projectSchema>;

// Blog Post
export const blogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  cover_url: z.string().optional(),
  status: z.enum(["draft", "published"]),
  created_at: z.string(),
  view_count: z.number().optional(),
  read_time: z.number().optional(),
});
export type BlogPost = z.infer<typeof blogPostSchema>;

export const createBlogPostSchema = blogPostSchema.omit({ id: true, created_at: true, view_count: true });
export type CreateBlogPost = z.infer<typeof createBlogPostSchema>;

// Free File
export const freeFileSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  file_url: z.string(),
  file_type: z.string(),
  download_count: z.number(),
  category: z.string(),
  tags: z.array(z.string()),
  created_at: z.string(),
});
export type FreeFile = z.infer<typeof freeFileSchema>;

export const createFreeFileSchema = freeFileSchema.omit({ id: true, download_count: true, created_at: true });
export type CreateFreeFile = z.infer<typeof createFreeFileSchema>;

// Admin Stats
export const adminStatsSchema = z.object({
  total_page_views: z.number(),
  total_blog_views: z.number(),
  total_downloads: z.number(),
  blog_count: z.number(),
  published_blog_count: z.number(),
  file_count: z.number(),
  media_count: z.number(),
  page_views: z.record(z.number()),
});
export type AdminStats = z.infer<typeof adminStatsSchema>;

// Service / Skill / Contact
export const serviceSchema = z.object({ id: z.string(), title: z.string(), description: z.string(), icon: z.string(), features: z.array(z.string()) });
export type Service = z.infer<typeof serviceSchema>;

export const skillCategorySchema = z.object({ id: z.string(), title: z.string(), icon: z.string(), skills: z.array(z.string()) });
export type SkillCategory = z.infer<typeof skillCategorySchema>;

export const contactInfoSchema = z.object({ email: z.string().email(), linkedin: z.string().url().optional(), whatsapp: z.string().optional(), github: z.string().url().optional() });
export type ContactInfo = z.infer<typeof contactInfoSchema>;
