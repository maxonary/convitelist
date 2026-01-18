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
  const path = req.path || req.url?.split('?')[0] || '';
  // Allow /api root endpoint without strict origin check (CORS handles it)
  if (path === "/api" || path === "/api/health" || path === "/health") {
    return next();
  }
  
  // For /api/* routes, CORS already validated, so just log and continue
  if (path.startsWith("/api/")) {
    return next();
  }

  // If no origin/referer, check if it's a non-browser request (like curl, Postman)
  // For browser requests, we require origin
  if (!origin) {
    // Allow if it's not a browser request (no user-agent or non-browser user-agent)
    const userAgent = req.headers["user-agent"] || "";
    const isBrowser = /Mozilla|Chrome|Safari|Firefox|Edge/i.test(userAgent);
    
    if (isBrowser) {
      console.warn(`Blocked browser request without origin from ${req.ip} to ${path}`);
      return res.status(403).json({ error: "Origin header required" });
    }
    // Allow non-browser requests (API tools, health checks, etc.)
    return next();
  }

  // Validate origin matches allowed origins
  // Normalize origin URL
  let originUrl = origin;
  if (!origin.startsWith("http://") && !origin.startsWith("https://")) {
    originUrl = `https://${origin}`;
  }
  
  // Remove trailing slashes and paths for comparison
  while (originUrl.endsWith('/')) {
    originUrl = originUrl.slice(0, -1);
  }
  originUrl = originUrl.split('/').slice(0, 3).join('/');
  
  const isValidOrigin = allowedOrigins.some(allowed => {
    const normalizedAllowed = allowed.trim();
    
    // Exact match
    if (originUrl === normalizedAllowed) return true;
    
    // Match Vercel domains (*.vercel.app)
    if (normalizedAllowed.includes("*.vercel.app")) {
      const vercelPattern = /^https?:\/\/[^/]+\.vercel\.app$/i;
      return vercelPattern.test(originUrl);
    }
    
    // Match custom domain patterns with wildcards
    if (normalizedAllowed.includes("*")) {
      if (originUrl.length > 2000) {
        console.warn(`Origin URL too long (${originUrl.length} chars), rejecting for security`);
        return false;
      }
      
      // Convert wildcard pattern to regex
      const patternStr = normalizedAllowed
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special chars
        .replace(/\*/g, '.*'); // Convert * to .*
      const pattern = new RegExp(`^${patternStr}$`, 'i');
      return pattern.test(originUrl);
    }
    
    return false;
  });

  if (!isValidOrigin) {
    console.warn(`Blocked request from unauthorized origin: ${origin} (normalized: ${originUrl}) to ${path} (IP: ${req.ip})`);
    console.warn(`Allowed origins: ${allowedOrigins.join(', ')}`);
    return res.status(403).json({ error: "Origin not allowed" });
  }

  next();
};

