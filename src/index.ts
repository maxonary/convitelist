import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/admins', adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
