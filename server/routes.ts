import type { Express, Request, Response, NextFunction, RequestHandler } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticate, requireRoles } from "./auth";
import { UpdateUser } from "@shared/schema";
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

// Middleware composition
function composeMiddleware(...handlers: RequestHandler[]) {
  return handlers;
}

// Auth0 protected routes
const authenticateRoutes = composeMiddleware(...authenticate);

// Admin routes
const adminRoutes = composeMiddleware(...authenticate, requireRoles(["admin", "superadmin"]));

// Superadmin routes
const superadminRoutes = composeMiddleware(...authenticate, requireRoles(["superadmin"]));

export async function registerRoutes(app: Express): Promise<Server> {
  // Public routes
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Validate Turnstile token for Auth0 integration
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

  // Protected routes
  app.get("/api/me", ...authenticateRoutes, (req: Request, res: Response) => {
    res.json(req.user);
  });

  // Admin routes
  app.get("/api/users/:id", ...adminRoutes, async (req: Request, res: Response) => {
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
  });

  app.patch("/api/users/:id", ...adminRoutes, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body as UpdateUser;

      const updatedUser = await storage.updateUser(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Superadmin routes
  app.delete("/api/users/:id", ...superadminRoutes, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      await storage.deleteUser(userId);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
