import express from "express";
import passport from "../config/passport";
import { configureSession } from "../config/session";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateOrigin } from "../middleware/originValidationMiddleware";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { limiter } from "../middleware/rateLimitMiddleware";
import adminRoutes from '../routes/adminRoutes';
import authRoutes from '../routes/authRoutes';
import invitationRoutes from '../routes/invitationRoutes';
import userRoutes from '../routes/userRoutes';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

// Configure CORS with allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
const clientUrl = process.env.CLIENT_URL;
if (clientUrl && !allowedOrigins.includes(clientUrl)) {
  allowedOrigins.push(clientUrl);
}

app.use(cors({ 
  credentials: true, 
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Normalize origin for comparison (remove trailing slash, paths, etc.)
    const normalizedOrigin = origin.replace(/\/+$/, '').split('/').slice(0, 3).join('/');
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.trim();
      
      // Exact match
      if (normalizedOrigin === normalizedAllowed) return true;
      
      // Support wildcard patterns for Vercel
      if (normalizedAllowed.includes("*.vercel.app")) {
        const vercelPattern = /^https?:\/\/[^/]+\.vercel\.app$/i;
        return vercelPattern.test(normalizedOrigin);
      }
      
      // Match other wildcard patterns
      if (normalizedAllowed.includes("*")) {
        const patternStr = normalizedAllowed
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special chars
          .replace(/\*/g, '.*'); // Convert * to .*
        const pattern = new RegExp(`^${patternStr}$`, 'i');
        return pattern.test(normalizedOrigin);
      }
      
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin} (normalized: ${normalizedOrigin})`);
      console.warn(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// Configure helmet with CORS-friendly settings for API
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false // Disable CSP for API endpoints
}));
app.use(cookieParser());
app.use(limiter);
// Add origin validation middleware for extra security
// Note: CORS already validates origins, this is a secondary check
app.use(validateOrigin);
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

configureSession(app);

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Minecraft Registration API!' });
});

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/invitation', authMiddleware, invitationRoutes);
app.use('/api/user', userRoutes);

export default app;