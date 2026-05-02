import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Media item attached to a project
export const mediaItemSchema = z.object({
  id: z.string(),
  url: z.string(),
  media_type: z.enum(["image", "video"]),
  project_id: z.string(),
  filename: z.string(),
});
export type MediaItem = z.infer<typeof mediaItemSchema>;

// Project schema for portfolio
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

// Service schema
export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  features: z.array(z.string()),
});
export type Service = z.infer<typeof serviceSchema>;

// Skill category schema
export const skillCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  skills: z.array(z.string()),
});
export type SkillCategory = z.infer<typeof skillCategorySchema>;

// Contact info schema
export const contactInfoSchema = z.object({
  email: z.string().email(),
  linkedin: z.string().url().optional(),
  whatsapp: z.string().optional(),
  github: z.string().url().optional(),
});
export type ContactInfo = z.infer<typeof contactInfoSchema>;
