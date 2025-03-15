
import type { Request, Response, NextFunction } from "express";

// Domain whitelist configuration
const ALLOWED_DOMAINS: string[] = [
  // Add your Cloudflare domains here
  process.env.PRIMARY_DOMAIN || "",
  "*.replit.app", // Allow Replit domains
];

// Middleware to check and validate domain requests
export function domainValidator(req: Request, res: Response, next: NextFunction) {
  const host = req.get("host") || "";
  
  // Skip validation in development environment
  if (process.env.NODE_ENV === "development") {
    return next();
  }
  
  // Check if the host is in our allowed domains list
  const isAllowed = ALLOWED_DOMAINS.some(domain => {
    if (domain.startsWith("*.")) {
      const suffix = domain.slice(1); // Remove the '*'
      return host.endsWith(suffix);
    }
    return host === domain;
  });
  
  if (!isAllowed) {
    console.warn(`Blocked request from unauthorized domain: ${host}`);
    return res.status(403).json({ 
      error: "Access denied", 
      message: "This domain is not authorized to access this application" 
    });
  }
  
  next();
}

// Helper to get the current domain for links and redirects
export function getAppDomain(req: Request): string {
  if (process.env.NODE_ENV === "development") {
    return `http://${req.get("host")}`;
  }
  
  // Use the primary domain in production if configured
  if (process.env.PRIMARY_DOMAIN) {
    return `https://${process.env.PRIMARY_DOMAIN}`;
  }
  
  // Fallback to the request host
  const protocol = req.get("x-forwarded-proto") || "https";
  const host = req.get("host") || "";
  return `${protocol}://${host}`;
}
