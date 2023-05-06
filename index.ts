import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/admins', adminRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
