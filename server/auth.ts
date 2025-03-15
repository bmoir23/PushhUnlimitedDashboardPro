import { Request, Response, NextFunction } from "express";
import { auth, JWTPayload } from "express-oauth2-jwt-bearer";
import { User, Auth0UserProfile } from "@shared/schema";
import { storage } from "./storage";

// Configure Auth0 JWT validation middleware
const validateJWT = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: "RS256",
});

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Extend the JWT payload with Auth0 profile
interface Auth0JwtPayload extends JWTPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  [key: string]: unknown;
}

// Middleware to attach user data to request
export async function attachUser(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = req.auth?.payload as Auth0JwtPayload;
    if (!payload?.sub) {
      return res.status(401).json({ error: "No user ID in token" });
    }

    const user = await storage.getUserByAuth0Id(payload.sub);
    
    if (!user) {
      // Create new user if they don't exist
      const { email, name, picture } = payload;
      
      if (!email) {
        return res.status(400).json({ error: "Email required" });
      }

      const newUser = await storage.createUser({
        auth0Id: payload.sub,
        email,
        name: name || null,
        picture: picture || null,
        username: null,
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

    const userRoles = req.user.roles as string[];
    const hasRequiredRole = userRoles.some(role => roles.includes(role));
    if (!hasRequiredRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

// Export auth middleware chain
export const authenticate = [validateJWT, attachUser];