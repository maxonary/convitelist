import express from "express";
import passport from "./config/passport";
import { configureSession } from "./config/session";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import invitationRoutes from './routes/invitationRoutes';
import userRoutes from './routes/userRoutes';


dotenv.config();

const app = express();
const port = process.env.PORT || 3001
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

configureSession(app);

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Minecraft Registration API!' });
});

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/invitation', invitationRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
