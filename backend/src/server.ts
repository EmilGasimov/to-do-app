import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import todoRoutes from "./routes/todos.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

app.get("/", (_req, res) => res.json({ message: "Todo API is running" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/todos", todoRoutes);

export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = Number(process.env.PORT) || 5000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}