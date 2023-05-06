import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

// Define your routes here

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
