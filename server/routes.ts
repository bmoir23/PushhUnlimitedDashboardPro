import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import fetch from "node-fetch";

// Set up crypto functions for password hashing
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

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

// Initialize passport and session
function setupAuth(app: Express) {
  // Set up session
  app.use(session({
    secret: process.env.SESSION_SECRET || "temporary-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Set up local strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      
      const passwordValid = await comparePasswords(password, user.password);
      if (!passwordValid) {
        return done(null, false, { message: "Incorrect password" });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      // Verify Turnstile token if provided
      const turnstileToken = req.body.turnstileToken;
      if (turnstileToken) {
        const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
        const isValid = await verifyTurnstileToken(turnstileToken, ip);
        
        if (!isValid) {
          return res.status(400).json({ error: "Security check failed. Please try again." });
        }
      }

      // Validate input
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid user data" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(req.body.password);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to login after registration" });
        }
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Server error during registration" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verify Turnstile token if provided
      const turnstileToken = req.body.turnstileToken;
      if (turnstileToken) {
        const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
        const isValid = await verifyTurnstileToken(turnstileToken, ip);
        
        if (!isValid) {
          return res.status(400).json({ error: "Security check failed. Please try again." });
        }
      }

      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ error: info?.message || "Authentication failed" });
        }
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          // Return user without password
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        });
      })(req, res, next);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Server error during login" });
    }
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    // Return user without password
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes
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
      
      // For testing purposes
      if (token === "test_token") {
        console.log("Using test_token - bypassing verification");
        return res.json({ success: true });
      }
      
      const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
      const isValid = await verifyTurnstileToken(token, ip);
      
      return res.json({ success: isValid });
    } catch (error) {
      console.error("Turnstile verification error:", error);
      return res.status(500).json({ success: false, error: "Server error during verification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
