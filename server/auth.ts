import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { User } from "@shared/schema";
import { storage } from "./storage";

// Configure Auth0 JWT validation middleware
const validateJWT = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: "RS256",
});

// Custom interface to include user in Request type
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Middleware to attach user data to request
export async function attachUser(req: Request, res: Response, next: NextFunction) {
  try {
    const auth0Id = req.auth?.payload.sub;
    if (!auth0Id) {
      return res.status(401).json({ error: "No user ID in token" });
    }

    const user = await storage.getUserByAuth0Id(auth0Id);
    
    if (!user) {
      // Create new user if they don't exist
      const email = req.auth?.payload.email;
      const name = req.auth?.payload.name;
      const picture = req.auth?.payload.picture;
      
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }

      const newUser = await storage.createUser({
        auth0Id,
        email,
        name: name || "",
        picture: picture || "",
        roles: ["free"],
        plan: "free",
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
    res.status(500).json({ error: "Internal server error" });
  }
}

// Middleware to check user roles
export function requireRoles(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const hasRequiredRole = req.user.roles.some(role => roles.includes(role));
    if (!hasRequiredRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

// Export auth middleware chain
export const authenticate = [validateJWT, attachUser];