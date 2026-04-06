import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database-config.js";

import authRoutes from "./routes/auth-route.js";
import sessionRoutes from "./routes/session-route.js";
import aiRoutes from "./routes/ai-route.js";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes); 

const PORT = 9000; 

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}.....`);
});