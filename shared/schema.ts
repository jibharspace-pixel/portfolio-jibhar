import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── PostgreSQL Tables ────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  problem: text("problem").notNull().default(""),
  solution: text("solution").notNull().default(""),
  result: text("result").notNull().default(""),
  technologies: jsonb("technologies").notNull().default(sql`'[]'::jsonb`),
  category: text("category").notNull().default("dashboard"),
  demo_url: text("demo_url"),
  download_url: text("download_url"),
  media: jsonb("media").notNull().default(sql`'[]'::jsonb`),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const blog_posts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  category: text("category").notNull().default(""),
  tags: jsonb("tags").notNull().default(sql`'[]'::jsonb`),
  cover_url: text("cover_url"),
  status: text("status").notNull().default("draft"),
  view_count: integer("view_count").notNull().default(0),
  read_time: integer("read_time").notNull().default(5),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const free_files = pgTable("free_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  file_url: text("file_url").notNull().default("#"),
  file_type: text("file_type").notNull().default("pdf"),
  download_count: integer("download_count").notNull().default(0),
  category: text("category").notNull().default(""),
  tags: jsonb("tags").notNull().default(sql`'[]'::jsonb`),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  icon: text("icon").notNull().default("BarChart3"),
  features: jsonb("features").notNull().default(sql`'[]'::jsonb`),
  long_description: text("long_description"),
  videos: jsonb("videos"),
  photos: jsonb("photos"),
});

export const contact_info = pgTable("contact_info", {
  id: integer("id").primaryKey().default(1),
  email: text("email").notNull().default(""),
  linkedin: text("linkedin"),
  whatsapp: text("whatsapp"),
  github: text("github"),
  upwork: text("upwork"),
  chariow: text("chariow"),
});

export const site_content = pgTable("site_content", {
  id: integer("id").primaryKey().default(1),
  hero_description: text("hero_description").notNull().default(""),
  hero_highlights: jsonb("hero_highlights").notNull().default(sql`'[]'::jsonb`),
  about_quote: text("about_quote").notNull().default(""),
  footer_tagline: text("footer_tagline").notNull().default(""),
  stack_tags: jsonb("stack_tags").notNull().default(sql`'[]'::jsonb`),
  cv_url: text("cv_url"),
});

export const contact_messages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const cv_downloads = pgTable("cv_downloads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ip: text("ip"),
  user_agent: text("user_agent"),
  downloaded_at: timestamp("downloaded_at").notNull().defaultNow(),
});

// ─── Zod Schemas (unchanged) ──────────────────────────────────────────────────

export const insertUserSchema = createInsertSchema(users).pick({ username: true, password: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const mediaItemSchema = z.object({
  id: z.string(),
  url: z.string(),
  media_type: z.enum(["image", "video"]),
  project_id: z.string(),
  filename: z.string(),
});
export type MediaItem = z.infer<typeof mediaItemSchema>;

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  problem: z.string(),
  solution: z.string(),
  result: z.string(),
  technologies: z.array(z.string()),
  category: z.string(),
  demo_url: z.string().optional(),
  download_url: z.string().optional(),
  media: z.array(mediaItemSchema).optional(),
});
export type Project = z.infer<typeof projectSchema>;

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

export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  features: z.array(z.string()),
  long_description: z.string().optional(),
  videos: z.array(z.string()).max(2).optional(),
  photos: z.array(z.string()).max(6).optional(),
});
export type Service = z.infer<typeof serviceSchema>;

export const skillCategorySchema = z.object({ id: z.string(), title: z.string(), icon: z.string(), skills: z.array(z.string()) });
export type SkillCategory = z.infer<typeof skillCategorySchema>;

export const contactInfoSchema = z.object({
  email: z.string().email(),
  linkedin: z.string().url().optional(),
  whatsapp: z.string().optional(),
  github: z.string().url().optional(),
  upwork: z.string().url().optional(),
  chariow: z.string().url().optional(),
});
export type ContactInfo = z.infer<typeof contactInfoSchema>;
