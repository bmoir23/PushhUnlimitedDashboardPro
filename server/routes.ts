import type { Express, Request, Response, NextFunction, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  authenticate, 
  authenticatedRoute, 
  adminRoute, 
  superadminRoute, 
  paidRoute
} from "./auth";
import { 
  UpdateUser, 
  insertProjectSchema, 
  insertIntegrationSchema,
  User
} from "@shared/schema";
import { z } from "zod";
import fetch from "node-fetch";

// Verify Cloudflare Turnstile token
async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  try {
    // For test tokens or development environment
    if (token === "test_token" || token.startsWith("1x")) {
      console.log("Using test Turnstile token - validation passes automatically");
      return true;
    }

    // Get the Cloudflare Turnstile secret key from environment variables
    const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";
    
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    formData.append('remoteip', ip);

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
      body: formData,
      method: 'POST',
    });

    const outcome = await result.json() as { success: boolean, 'error-codes': string[] };
    
    if (!outcome.success) {
      console.error("Turnstile validation failed:", outcome['error-codes']);
    }
    
    return outcome.success;
  } catch (error) {
    console.error("Error validating Turnstile token:", error);
    return false;
  }
}

// Helper middleware for async error handling
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export async function registerRoutes(app: Express): Promise<Server> {
  // Public routes
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Validate Cloudflare Turnstile token
  app.post("/api/verify-turnstile", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ success: false, error: "Token is required" });
      }

      const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
      const isValid = await verifyTurnstileToken(token, ip);
      
      return res.json({ success: isValid });
    } catch (error) {
      console.error("Turnstile verification error:", error);
      return res.status(500).json({ success: false, error: "Server error during verification" });
    }
  });

  // User routes
  app.get("/api/user", authenticatedRoute, (req: Request, res: Response) => {
    res.json(req.user);
  });

  app.patch("/api/user", authenticatedRoute, asyncHandler(async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const updates = req.body as UpdateUser;
      const updatedUser = await storage.updateUser(req.user.id, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }));

  // Project routes
  app.get("/api/projects", authenticatedRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const projects = await storage.getProjectsByUserId(req.user.id);
    res.json(projects);
  }));

  app.get("/api/projects/:id", authenticatedRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const projectId = parseInt(req.params.id);
    const project = await storage.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // Check if project belongs to user
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    res.json(project);
  }));

  app.post("/api/projects", paidRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }));

  app.patch("/api/projects/:id", authenticatedRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const projectId = parseInt(req.params.id);
    const project = await storage.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // Check if project belongs to user
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const updatedProject = await storage.updateProject(projectId, req.body);
    res.json(updatedProject);
  }));

  app.delete("/api/projects/:id", authenticatedRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const projectId = parseInt(req.params.id);
    const project = await storage.getProject(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // Check if project belongs to user
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    await storage.deleteProject(projectId);
    res.sendStatus(204);
  }));

  // Integration routes
  app.get("/api/integrations", authenticatedRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const integrations = await storage.getIntegrationsByUserId(req.user.id);
    res.json(integrations);
  }));

  app.get("/api/integrations/:id", authenticatedRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const integrationId = parseInt(req.params.id);
    const integration = await storage.getIntegration(integrationId);
    
    if (!integration) {
      return res.status(404).json({ error: "Integration not found" });
    }
    
    // Check if integration belongs to user
    if (integration.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    res.json(integration);
  }));

  app.post("/api/integrations", paidRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const integrationData = insertIntegrationSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      const integration = await storage.createIntegration(integrationData);
      res.status(201).json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid integration data", details: error.errors });
      }
      console.error("Error creating integration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }));

  app.patch("/api/integrations/:id", authenticatedRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const integrationId = parseInt(req.params.id);
    const integration = await storage.getIntegration(integrationId);
    
    if (!integration) {
      return res.status(404).json({ error: "Integration not found" });
    }
    
    // Check if integration belongs to user
    if (integration.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    const updatedIntegration = await storage.updateIntegration(integrationId, req.body);
    res.json(updatedIntegration);
  }));

  app.delete("/api/integrations/:id", authenticatedRoute, asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const integrationId = parseInt(req.params.id);
    const integration = await storage.getIntegration(integrationId);
    
    if (!integration) {
      return res.status(404).json({ error: "Integration not found" });
    }
    
    // Check if integration belongs to user
    if (integration.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    await storage.deleteIntegration(integrationId);
    res.sendStatus(204);
  }));

  // Admin routes
  app.get("/api/admin/users", adminRoute, asyncHandler(async (req: Request, res: Response) => {
    // We need to get all users, so we'll create a helper approach
    // that doesn't rely on accessing private properties
    try {
      // Get all users by querying each user by ID, starting from 1
      // This is a workaround since we don't have direct access to the users Map
      const users: User[] = [];
      let id = 1;
      let user = await storage.getUser(id);
      
      // Keep fetching users until we find a gap
      while (user) {
        users.push(user);
        id++;
        user = await storage.getUser(id);
      }
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }));

  app.get("/api/admin/users/:id", adminRoute, asyncHandler(async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }));

  app.patch("/api/admin/users/:id", adminRoute, asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body as UpdateUser;

      const updatedUser = await storage.updateUser(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }));

  // Superadmin routes
  app.delete("/api/admin/users/:id", superadminRoute, asyncHandler(async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      await storage.deleteUser(userId);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }));

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Global error handler:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ error: message });
  });

  const httpServer = createServer(app);
  return httpServer;
}
