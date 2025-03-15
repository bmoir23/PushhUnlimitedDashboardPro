import { users, projects, integrations, type User, type InsertUser, type Project, type InsertProject, type Integration, type InsertIntegration } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { eq } from "drizzle-orm";
import { db, pool } from "./db";

const MemoryStore = createMemoryStore(session);

// Extend the storage interface with CRUD methods for users, projects, and integrations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByAuthId(authId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Project methods
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Integration methods
  getIntegration(id: number): Promise<Integration | undefined>;
  getIntegrationsByUserId(userId: number): Promise<Integration[]>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: number, updates: Partial<Integration>): Promise<Integration>;
  deleteIntegration(id: number): Promise<void>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private integrations: Map<number, Integration>;
  private userIdCounter: number;
  private projectIdCounter: number;
  private integrationIdCounter: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.integrations = new Map();
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.integrationIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByAuthId(authId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.authId === authId,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if user with same authId or email exists
    if (insertUser.authId) {
      const existingAuthUser = await this.getUserByAuthId(insertUser.authId);
      if (existingAuthUser) {
        throw new Error("User with this Auth ID already exists");
      }
    }

    if (insertUser.email) {
      const existingEmailUser = await this.getUserByEmail(insertUser.email);
      if (existingEmailUser) {
        throw new Error("User with this email already exists");
      }
    }

    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
      metadata: insertUser.metadata || {},
    };

    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    if (!this.users.has(id)) {
      throw new Error("User not found");
    }
    
    // Delete all user's projects and integrations
    const userProjects = await this.getProjectsByUserId(id);
    for (const project of userProjects) {
      await this.deleteProject(project.id);
    }
    
    const userIntegrations = await this.getIntegrationsByUserId(id);
    for (const integration of userIntegrations) {
      await this.deleteIntegration(integration.id);
    }
    
    this.users.delete(id);
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const project = await this.getProject(id);
    if (!project) {
      throw new Error("Project not found");
    }

    const updatedProject: Project = {
      ...project,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    if (!this.projects.has(id)) {
      throw new Error("Project not found");
    }
    this.projects.delete(id);
  }

  // Integration methods
  async getIntegration(id: number): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async getIntegrationsByUserId(userId: number): Promise<Integration[]> {
    return Array.from(this.integrations.values()).filter(
      (integration) => integration.userId === userId,
    );
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const id = this.integrationIdCounter++;
    const now = new Date();
    const integration: Integration = {
      ...insertIntegration,
      id,
      createdAt: now,
      updatedAt: now,
      lastSynced: null,
    };

    this.integrations.set(id, integration);
    return integration;
  }

  async updateIntegration(id: number, updates: Partial<Integration>): Promise<Integration> {
    const integration = await this.getIntegration(id);
    if (!integration) {
      throw new Error("Integration not found");
    }

    const updatedIntegration: Integration = {
      ...integration,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    this.integrations.set(id, updatedIntegration);
    return updatedIntegration;
  }

  async deleteIntegration(id: number): Promise<void> {
    if (!this.integrations.has(id)) {
      throw new Error("Integration not found");
    }
    this.integrations.delete(id);
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // For simplicity and compatibility with ES modules, use MemoryStore for now
    // We can replace with a PostgreSQL-backed session store in the future if needed
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Clear expired sessions every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!username) return undefined;
    
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByAuthId(authId: string): Promise<User | undefined> {
    if (!authId) return undefined;
    
    const result = await db.select().from(users).where(eq(users.authId, authId));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Check if user with same authId or email exists
    if (insertUser.authId) {
      const existingAuthUser = await this.getUserByAuthId(insertUser.authId);
      if (existingAuthUser) {
        throw new Error("User with this Auth ID already exists");
      }
    }

    if (insertUser.email) {
      const existingEmailUser = await this.getUserByEmail(insertUser.email);
      if (existingEmailUser) {
        throw new Error("User with this email already exists");
      }
    }
    
    const now = new Date();
    const result = await db.insert(users).values({
      ...insertUser,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
      metadata: insertUser.metadata || {},
    }).returning();
    
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const result = await db.update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error("User not found");
    }
    
    return result[0];
  }

  async deleteUser(id: number): Promise<void> {
    // Delete all user's projects and integrations first
    const userProjects = await this.getProjectsByUserId(id);
    for (const project of userProjects) {
      await this.deleteProject(project.id);
    }
    
    const userIntegrations = await this.getIntegrationsByUserId(id);
    for (const integration of userIntegrations) {
      await this.deleteIntegration(integration.id);
    }

    // Then delete the user
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    
    if (result.length === 0) {
      throw new Error("User not found");
    }
  }

  // Project methods
  async getProject(id: number): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const now = new Date();
    const result = await db.insert(projects).values({
      ...insertProject,
      createdAt: now,
      updatedAt: now,
    }).returning();
    
    return result[0];
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const result = await db.update(projects)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error("Project not found");
    }
    
    return result[0];
  }

  async deleteProject(id: number): Promise<void> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    
    if (result.length === 0) {
      throw new Error("Project not found");
    }
  }

  // Integration methods
  async getIntegration(id: number): Promise<Integration | undefined> {
    const result = await db.select().from(integrations).where(eq(integrations.id, id));
    return result[0];
  }

  async getIntegrationsByUserId(userId: number): Promise<Integration[]> {
    return await db.select().from(integrations).where(eq(integrations.userId, userId));
  }

  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const now = new Date();
    const result = await db.insert(integrations).values({
      ...insertIntegration,
      lastSynced: null,
      createdAt: now,
      updatedAt: now,
    }).returning();
    
    return result[0];
  }

  async updateIntegration(id: number, updates: Partial<Integration>): Promise<Integration> {
    const result = await db.update(integrations)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(integrations.id, id))
      .returning();

    if (result.length === 0) {
      throw new Error("Integration not found");
    }
    
    return result[0];
  }

  async deleteIntegration(id: number): Promise<void> {
    const result = await db.delete(integrations).where(eq(integrations.id, id)).returning();
    
    if (result.length === 0) {
      throw new Error("Integration not found");
    }
  }
}

// Replace MemStorage with DatabaseStorage
export const storage = new DatabaseStorage();
