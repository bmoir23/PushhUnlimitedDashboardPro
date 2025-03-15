import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByAuth0Id(auth0Id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Seed initial admin user if needed
    this.seedUsers();
  }

  private async seedUsers() {
    // Admin user with hashed password "admin123" (SHA-256 hashed for development only)
    await this.createUserIfNotExists({
      username: "admin",
      password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
      email: "admin@example.com",
      roles: ["admin", "superadmin"],
      plan: "enterprise"
    });
    
    await this.createUserIfNotExists({
      username: "user",
      password: "04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb",
      email: "user@example.com",
      roles: ["free"],
      plan: "free"
    });

    await this.createUserIfNotExists({
      username: "premium",
      password: "74278e6b786c1ebd0e1ad9e3adf007acb5e2b16e5a825bbac35883a155c8863e",
      email: "premium@example.com",
      roles: ["premium"],
      plan: "premium"
    });
  }

  private async createUserIfNotExists(user: InsertUser): Promise<void> {
    const existingUser = await this.getUserByUsername(user.username);
    if (!existingUser) {
      const id = this.currentId++;
      const newUser: User = { ...user, id };
      this.users.set(id, newUser);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
