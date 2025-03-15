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

// User table with Auth0 integration
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  auth0Id: text("auth0_id").unique(), // Auth0 user ID for external authentication
  email: text("email").notNull().unique(),
  name: text("name"),
  username: text("username").unique(),
  picture: text("picture"), // URL to user's profile picture
  roles: text("roles").array().notNull().default([]),
  plan: text("plan").notNull().default("free"),
  status: text("status").notNull().default("pending"),
  metadata: json("metadata"), // Flexible metadata for user preferences and settings
  lastLogin: timestamp("last_login", { mode: 'date' }),
  createdAt: timestamp("created_at", { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: 'date' }).defaultNow().notNull(),
});

// Create Zod schemas
const UserRoleSchema = z.enum(userRoles);
const UserPlanSchema = z.enum(userPlans);
const UserStatusSchema = z.enum(userStatuses);

// Schema for inserting new users
export const insertUserSchema = createInsertSchema(users, {
  roles: z.array(UserRoleSchema),
  plan: UserPlanSchema,
  status: UserStatusSchema,
  metadata: z.record(z.any()).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating user properties
export const updateUserSchema = createInsertSchema(users, {
  roles: z.array(UserRoleSchema).optional(),
  plan: UserPlanSchema.optional(),
  status: UserStatusSchema.optional(),
  metadata: z.record(z.any()).optional(),
}).omit({
  id: true,
  auth0Id: true,
  createdAt: true,
}).partial();

// Export types for use in the application
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserPlan = z.infer<typeof UserPlanSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;
