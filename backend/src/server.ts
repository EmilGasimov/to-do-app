import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import cookieParser from 'cookie-parser';
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import todoRoutes from "./routes/todos.js";
import authRoutes from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

app.get("/", (_req, res) => res.json({ message: "Todo API is running" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use('/auth', authRoutes);

// Swagger docs
const CDN = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14";

app.get("/api-docs.json", (_req, res) => {
  const specPath = path.resolve(__dirname, "swagger.json");
  const spec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
  res.json(spec);
});

app.get("/api-docs", (_req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Todo API Docs</title>
  <link rel="stylesheet" href="${CDN}/swagger-ui.min.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${CDN}/swagger-ui-bundle.min.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: "/api-docs.json",
        dom_id: "#swagger-ui",
      });
    };
  </script>
</body>
</html>
  `);
});

app.use("/api/todos", todoRoutes);

export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = Number(process.env.PORT) || 5001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}