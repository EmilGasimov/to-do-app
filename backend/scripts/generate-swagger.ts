import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { swaggerSpec } from "../src/swagger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(__dirname, "../src/swagger.json");

fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2));
console.log("swagger.json generated at", outPath);