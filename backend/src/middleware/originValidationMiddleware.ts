import { Request, Response, NextFunction } from "express";

/**
 * Middleware to validate that requests come from allowed origins (Vercel)
 * This adds an extra layer of security beyond CORS
 */
export const validateOrigin = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
  const clientUrl = process.env.CLIENT_URL;
  
  // Add CLIENT_URL to allowed origins if not already included
  if (clientUrl && !allowedOrigins.includes(clientUrl)) {
    allowedOrigins.push(clientUrl);
  }

  // Allow requests without origin (like direct API calls, Postman, etc.) for health checks
  // But require origin for browser requests
  const origin = req.headers.origin || req.headers.referer;
  
  // Health check endpoint - allow without origin
  if (req.path === "/api" || req.path === "/api/health" || req.path === "/health") {
    return next();
  }

  // If no origin/referer, check if it's a non-browser request (like curl, Postman)
  // For browser requests, we require origin
  if (!origin) {
    // Allow if it's not a browser request (no user-agent or non-browser user-agent)
    const userAgent = req.headers["user-agent"] || "";
    const isBrowser = /Mozilla|Chrome|Safari|Firefox|Edge/i.test(userAgent);
    
    if (isBrowser) {
      console.warn(`Blocked browser request without origin from ${req.ip}`);
      return res.status(403).json({ error: "Origin header required" });
    }
    // Allow non-browser requests (API tools, health checks, etc.)
    return next();
  }

  // Validate origin matches allowed origins
  const originUrl = origin.startsWith("http") ? origin : `https://${origin}`;
  const isValidOrigin = allowedOrigins.some(allowed => {
    // Exact match
    if (originUrl === allowed) return true;
    
    // Match Vercel domains (*.vercel.app)
    if (allowed.includes("*.vercel.app")) {
      const vercelPattern = /^https?:\/\/[^/]+\.vercel\.app(\/.*)?$/;
      return vercelPattern.test(originUrl);
    }
    
    // Match custom domain patterns
    if (allowed.includes("*")) {
      const pattern = new RegExp("^" + allowed.replace(/\*/g, ".*") + "$");
      return pattern.test(originUrl);
    }
    
    return false;
  });

  if (!isValidOrigin) {
    console.warn(`Blocked request from unauthorized origin: ${origin} (IP: ${req.ip})`);
    return res.status(403).json({ error: "Origin not allowed" });
  }

  next();
};

