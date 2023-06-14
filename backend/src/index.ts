import express from "express";
import passport from "./config/passport";
import { configureSession } from "./config/session";
import dotenv from "dotenv";

import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

configureSession(app); // Initialize session middleware

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Minecraft Registration API!' });
});

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
