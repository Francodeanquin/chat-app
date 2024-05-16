import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js"
import { connecToMongoDb } from "./db/connectToMongoDb.js";
import cookieParser from "cookie-parser"
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()) //to parse the incoming request with JSON payloads(from req.body)
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  connecToMongoDb();
  console.log(`Server running in port ${PORT}`, `http://localhost:${PORT}`);
});
