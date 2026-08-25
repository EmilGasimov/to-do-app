import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import todoRoutes from "./routes/todos.js";

const app = express();
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14";

app.get("/api-docs", (_req, res) => {
  res.send(swaggerUi.generateHTML(swaggerSpec, {
    customCssUrl: `${CDN}/swagger-ui.min.css`,
    customJs: [
      `${CDN}/swagger-ui-bundle.min.js`,
      `${CDN}/swagger-ui-standalone-preset.min.js`,
    ],
  }));
});

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

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