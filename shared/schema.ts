import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  roles: text("roles").array().notNull().default([]),
  plan: text("plan").notNull().default("free"),
});

// Create Zod schemas
const UserRoleSchema = z.enum(userRoles);
const UserPlanSchema = z.enum(userPlans);

export const insertUserSchema = createInsertSchema(users, {
  roles: z.array(UserRoleSchema),
  plan: UserPlanSchema,
}).pick({
  username: true,
  password: true,
  email: true,
  roles: true,
  plan: true,
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserPlan = z.infer<typeof UserPlanSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
