import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

// Import Routes
import movieRoutes from "./routes/moviesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
connectDB();

const app = express();

// CORS
app.use((req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173", "http://localhost:3000"];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Body parsing middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "../../Frontend/dist");
  app.use(express.static(frontendDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

const server = app.listen(process.env.PORT || 5001, "0.0.0.0", () => {
  console.log(`Server running on PORT ${process.env.PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});