import express from "express";
import Run from "../models/Run.js";

const router = express.Router();

// ➕ POST /api/runs → enregistre une run
router.post("/", async (req, res) => {
  try {
    console.log("POST /api/runs hit with:", req.body);
    const newRun = new Run(req.body);
    const savedRun = await newRun.save();
    res.status(201).json(savedRun);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save run." });
  }
});

// 📥 GET /api/runs → récupère toutes les runs
router.get("/", async (req, res) => {
  try {
    const runs = await Run.find().sort({ timestamp: -1 });
    res.json(runs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch runs." });
  }
});

export default router;
