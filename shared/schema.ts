import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define user roles and plans as enums
export const userRoles = [
  "free",
  "basic",
  "premium",
  "enterprise",
  "admin",
  "superadmin",
] as const;

export const userPlans = [
  "free",
  "basic",
  "premium",
  "enterprise",
] as const;

export const userStatuses = [
  "active",
  "inactive",
  "pending",
  "suspended",
] as const;

// User table with Supabase integration
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  authId: text("auth_id").unique(), // Supabase user UUID
  email: text("email").notNull().unique(),
  name: text("name"),
  username: text("username").unique(),
  picture: text("picture"), // URL to user's profile picture
  roles: text("roles").array().notNull().$type<UserRole[]>().default(["free"]),
  plan: text("plan").notNull().$type<UserPlan>().default("free"),
  status: text("status").notNull().$type<UserStatus>().default("active"),
  metadata: json("metadata").$type<Record<string, unknown>>().default({}), // Flexible metadata for user preferences and settings
  lastLogin: timestamp("last_login", { mode: 'date' }),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().notNull(),
});

// Projects table - for storing user projects
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, archived, completed
  metadata: json("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().notNull(),
});

// Integrations table - for storing user's external integrations
export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // e.g., "airtable", "zendesk", "intercom", "segment"
  name: text("name").notNull(),
  config: json("config").$type<Record<string, unknown>>().default({}),
  status: text("status").notNull().default("connected"), // connected, disconnected, pending
  lastSynced: timestamp("last_synced", { mode: 'date' }),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().notNull(),
});

// Create Zod schemas
const UserRoleSchema = z.enum(userRoles);
const UserPlanSchema = z.enum(userPlans);
const UserStatusSchema = z.enum(userStatuses);

// Schema for inserting new users
export const insertUserSchema = z.object({
  authId: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  username: z.string().nullable(),
  picture: z.string().nullable(),
  roles: z.array(UserRoleSchema).default(["free"]),
  plan: UserPlanSchema.default("free"),
  status: UserStatusSchema.default("active"),
  metadata: z.record(z.unknown()).default({}),
});

// Schema for updating user properties
export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  picture: z.string().nullable().optional(),
  roles: z.array(UserRoleSchema).optional(),
  plan: UserPlanSchema.optional(),
  status: UserStatusSchema.optional(),
  metadata: z.record(z.unknown()).optional(),
  lastLogin: z.date().nullable().optional(),
});

// Schema for inserting new projects
export const insertProjectSchema = z.object({
  userId: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  status: z.string().default("active"),
  metadata: z.record(z.unknown()).default({}),
});

// Schema for inserting new integrations
export const insertIntegrationSchema = z.object({
  userId: z.number(),
  type: z.string(),
  name: z.string(),
  config: z.record(z.unknown()).default({}),
  status: z.string().default("connected"),
});

// Supabase User Profile type
export interface SupabaseUserProfile {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    picture?: string;
    roles?: UserRole[];
    plan?: string;
    [key: string]: any;
  };
  app_metadata?: Record<string, unknown>;
  [key: string]: any;
}

// Export types for use in the application
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserPlan = z.infer<typeof UserPlanSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Integration = typeof integrations.$inferSelect;
