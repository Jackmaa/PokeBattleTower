import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import runRoutes from "./routes/runs.js";
import towerRoutes from "./routes/tower.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import userRoutes from "./routes/users.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for save data

// API Routes
app.use("/api/runs", runRoutes);
app.use("/api/tower", towerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
});

// API info endpoint
app.get("/api", (req, res) => {
  res.json({
    name: "PokeBattleTower API",
    version: "2.0.0",
    endpoints: {
      runs: "/api/runs",
      tower: "/api/tower",
      leaderboard: "/api/leaderboard",
      users: "/api/users",
      health: "/api/health"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("📦 Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
