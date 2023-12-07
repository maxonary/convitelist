import express from "express";
import passport from "../config/passport";
import { configureSession } from "../config/session";
import { authMiddleware } from "../middleware/authMiddleware";
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
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(helmet());
app.use(cookieParser());
app.use(limiter);
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