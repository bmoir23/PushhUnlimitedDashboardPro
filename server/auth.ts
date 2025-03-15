import { Request, Response, NextFunction } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { User, SupabaseUserProfile, UserRole } from "@shared/schema";
import { storage } from "./storage";

// Initialize Supabase client
// Fixed hard-coded URL and key since environment variables may be swapped
const supabaseUrl = 'https://eqwkqcbmgulilfzuzqzi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxd2txY2JtZ3VsaWxmenV6cXppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjA4OTMsImV4cCI6MjA1NzM5Njg5M30.TmOhDcZWDT1Db1p40eBBusG1K5EvHLaPpw70Kr039Qc';
const supabase = createClient(supabaseUrl, supabaseKey);

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
      supabaseToken?: string;
      supabaseClient?: SupabaseClient;
    }
  }
}

// Middleware to validate JWT from Supabase
export async function validateSupabaseJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(); // No token, but still continue to allow public routes
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    // Create a Supabase client with the user's token
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // Get user from token
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    
    if (error || !user) {
      return next();
    }

    // Add the token and client to the request
    req.supabaseToken = token;
    req.supabaseClient = supabaseClient;

    next();
  } catch (error) {
    console.error("Error validating JWT:", error);
    next();
  }
}

// Middleware to attach user data to request
export async function attachUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.supabaseClient) {
      return next(); // No authenticated user, but still continue for public routes
    }

    const { data: { user: supabaseUser } } = await req.supabaseClient.auth.getUser();
    
    if (!supabaseUser) {
      return next();
    }

    const user = await storage.getUserByAuthId(supabaseUser.id);
    
    if (!user) {
      // Create new user if they don't exist
      const { email, user_metadata } = supabaseUser;
      
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }

      // Get plan from metadata or default to free
      const planFromMetadata = user_metadata?.plan as string || "free";
      // Ensure we're using a valid plan type
      const validPlan = ["free", "basic", "premium", "enterprise"].includes(planFromMetadata) 
        ? planFromMetadata as "free" | "basic" | "premium" | "enterprise"
        : "free";
      
      const newUser = await storage.createUser({
        authId: supabaseUser.id,
        email,
        name: user_metadata?.name || null,
        picture: user_metadata?.picture || null,
        username: null,
        roles: (user_metadata?.roles as UserRole[]) || ["free"],
        plan: validPlan,
        status: "active",
        metadata: {},
      });

      req.user = newUser;
    } else {
      req.user = user;
      
      // Update last login time
      await storage.updateUser(user.id, {
        lastLogin: new Date(),
      });
    }

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    next(); // Continue to allow public routes
  }
}

// Middleware to check if user is authenticated
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// Middleware to check user roles
export function requireRoles(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRoles = req.user.roles as string[];
    const hasRequiredRole = userRoles.some(role => roles.includes(role));
    if (!hasRequiredRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

// Middleware to check user plan
export function requirePlan(plans: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userPlan = req.user.plan as string;
    if (!plans.includes(userPlan)) {
      return res.status(403).json({ 
        error: "Plan upgrade required",
        requiredPlans: plans,
        currentPlan: userPlan
      });
    }

    next();
  };
}

// Export auth middleware chain
export const authenticate = [validateSupabaseJWT, attachUser];

// Export authenticated route middleware chain
export const authenticatedRoute = [validateSupabaseJWT, attachUser, requireAuth];

// Export admin route middleware chain
export const adminRoute = [validateSupabaseJWT, attachUser, requireAuth, requireRoles(["admin", "superadmin"])];

// Export superadmin route middleware chain
export const superadminRoute = [validateSupabaseJWT, attachUser, requireAuth, requireRoles(["superadmin"])];

// Export paid route middleware chain
export const paidRoute = [validateSupabaseJWT, attachUser, requireAuth, requirePlan(["basic", "premium", "enterprise"])];

// Helper function to create middleware requiring a specific plan
export function createPlanRestrictedRoute(plan: string) {
  return [validateSupabaseJWT, attachUser, requireAuth, requirePlan([plan])];
}