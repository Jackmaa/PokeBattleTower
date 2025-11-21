import express from "express";
import TowerSave from "../models/Tower.js";

const router = express.Router();

// GET /api/tower/saves/:userId - Get all saves for a user
router.get("/saves/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const saves = await TowerSave.find({ userId }).sort({ slotId: 1 });
    res.json(saves);
  } catch (err) {
    console.error("Error fetching saves:", err);
    res.status(500).json({ message: "Failed to fetch saves." });
  }
});

// GET /api/tower/saves/:userId/:slotId - Get specific save slot
router.get("/saves/:userId/:slotId", async (req, res) => {
  try {
    const { userId, slotId } = req.params;
    const save = await TowerSave.findOne({ userId, slotId: parseInt(slotId) });

    if (!save) {
      return res.status(404).json({ message: "Save not found." });
    }

    res.json(save);
  } catch (err) {
    console.error("Error fetching save:", err);
    res.status(500).json({ message: "Failed to fetch save." });
  }
});

// POST /api/tower/saves - Create or update a save
router.post("/saves", async (req, res) => {
  try {
    const { userId, slotId, ...saveData } = req.body;

    if (!userId || slotId === undefined) {
      return res.status(400).json({ message: "userId and slotId are required." });
    }

    const save = await TowerSave.findOneAndUpdate(
      { userId, slotId },
      {
        ...saveData,
        userId,
        slotId,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(201).json(save);
  } catch (err) {
    console.error("Error saving game:", err);
    res.status(500).json({ message: "Failed to save game." });
  }
});

// DELETE /api/tower/saves/:userId/:slotId - Delete a save
router.delete("/saves/:userId/:slotId", async (req, res) => {
  try {
    const { userId, slotId } = req.params;
    const result = await TowerSave.findOneAndDelete({
      userId,
      slotId: parseInt(slotId)
    });

    if (!result) {
      return res.status(404).json({ message: "Save not found." });
    }

    res.json({ message: "Save deleted successfully." });
  } catch (err) {
    console.error("Error deleting save:", err);
    res.status(500).json({ message: "Failed to delete save." });
  }
});

// GET /api/tower/autosave/:userId - Get autosave
router.get("/autosave/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const autosave = await TowerSave.findOne({ userId, slotId: -1 });

    if (!autosave) {
      return res.status(404).json({ message: "No autosave found." });
    }

    res.json(autosave);
  } catch (err) {
    console.error("Error fetching autosave:", err);
    res.status(500).json({ message: "Failed to fetch autosave." });
  }
});

// POST /api/tower/autosave - Create/update autosave
router.post("/autosave", async (req, res) => {
  try {
    const { userId, ...saveData } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required." });
    }

    const autosave = await TowerSave.findOneAndUpdate(
      { userId, slotId: -1 },
      {
        ...saveData,
        userId,
        slotId: -1,
        name: "Auto-Save",
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.status(201).json(autosave);
  } catch (err) {
    console.error("Error creating autosave:", err);
    res.status(500).json({ message: "Failed to create autosave." });
  }
});

export default router;
