import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Achievement definitions (should match frontend)
const ACHIEVEMENTS = [
  { id: 'first_win', condition: 'win_once' },
  { id: 'floor_5', condition: 'floor_5' },
  { id: 'floor_10', condition: 'floor_10' },
  { id: 'floor_15', condition: 'floor_15' },
  { id: 'floor_20', condition: 'floor_20' },
  { id: 'gold_1000', condition: 'gold_1000' },
  { id: 'gold_5000', condition: 'gold_5000' },
  { id: 'catch_10', condition: 'catch_10' },
  { id: 'catch_20', condition: 'catch_20' },
  { id: 'win_3', condition: 'win_3' },
  { id: 'win_10', condition: 'win_10' },
];

// Starter unlock conditions
const UNLOCKABLE_STARTERS = [
  { id: 'pikachu', condition: 'win_once' },
  { id: 'gengar', condition: 'floor_10' },
  { id: 'dragonite', condition: 'floor_15' },
  { id: 'tyranitar', condition: 'win_3' },
  { id: 'metagross', condition: 'floor_20' },
  { id: 'garchomp', condition: 'catch_20' },
];

// Helper to check unlock conditions
function checkCondition(condition, user, runData = {}) {
  switch (condition) {
    case 'win_once': return user.totalWins >= 1;
    case 'win_3': return user.totalWins >= 3;
    case 'win_10': return user.totalWins >= 10;
    case 'floor_5': return user.highestFloor >= 5;
    case 'floor_10': return user.highestFloor >= 10;
    case 'floor_15': return user.highestFloor >= 15;
    case 'floor_20': return user.highestFloor >= 20;
    case 'gold_1000': return (runData.goldEarned || 0) >= 1000;
    case 'gold_5000': return (runData.goldEarned || 0) >= 5000;
    case 'catch_10': return user.totalPokemonCaught >= 10;
    case 'catch_20': return user.totalPokemonCaught >= 20;
    default: return false;
  }
}

// GET /api/users/:userId - Get user profile
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await User.findOne({ oduserId: userId });

    // Create user if doesn't exist
    if (!user) {
      user = new User({ oduserId: userId });
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Failed to fetch user." });
  }
});

// PUT /api/users/:userId - Update user profile
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Don't allow updating certain fields directly
    delete updates.oduserId;
    delete updates._id;

    const user = await User.findOneAndUpdate(
      { oduserId: userId },
      { ...updates, lastPlayedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user." });
  }
});

// POST /api/users/:userId/run-complete - Update after completing a run
router.post("/:userId/run-complete", async (req, res) => {
  try {
    const { userId } = req.params;
    const runData = req.body;

    let user = await User.findOne({ oduserId: userId });

    if (!user) {
      user = new User({ oduserId: userId });
    }

    // Update stats
    user.totalRuns += 1;
    user.totalGoldEarned += runData.goldEarned || 0;
    user.totalPokemonCaught += runData.pokemonCaught || 0;

    if (runData.floor > user.highestFloor) {
      user.highestFloor = runData.floor;
    }

    if (runData.victory) {
      user.totalWins += 1;
    }

    // Add 10% to permanent gold
    user.permanentGold += Math.floor((runData.goldEarned || 0) * 0.1);

    // Update detailed stats
    user.stats.totalBattlesWon += runData.battlesWon || 0;
    user.stats.totalPlaytime += runData.playtime || 0;

    user.lastPlayedAt = new Date();

    // Check for new achievements
    const newAchievements = [];
    for (const achievement of ACHIEVEMENTS) {
      if (!user.unlockedAchievements.includes(achievement.id)) {
        if (checkCondition(achievement.condition, user, runData)) {
          user.unlockedAchievements.push(achievement.id);
          newAchievements.push(achievement.id);
        }
      }
    }

    // Check for new starter unlocks
    const newStarters = [];
    for (const starter of UNLOCKABLE_STARTERS) {
      if (!user.unlockedStarters.includes(starter.id)) {
        if (checkCondition(starter.condition, user, runData)) {
          user.unlockedStarters.push(starter.id);
          newStarters.push(starter.id);
        }
      }
    }

    await user.save();

    res.json({
      user,
      newAchievements,
      newStarters
    });
  } catch (err) {
    console.error("Error updating user after run:", err);
    res.status(500).json({ message: "Failed to update user." });
  }
});

// POST /api/users/:userId/spend-gold - Spend permanent gold
router.post("/:userId/spend-gold", async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    const user = await User.findOne({ oduserId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.permanentGold < amount) {
      return res.status(400).json({ message: "Insufficient gold." });
    }

    user.permanentGold -= amount;
    await user.save();

    res.json({ success: true, remainingGold: user.permanentGold });
  } catch (err) {
    console.error("Error spending gold:", err);
    res.status(500).json({ message: "Failed to spend gold." });
  }
});

// GET /api/users/:userId/achievements - Get achievements
router.get("/:userId/achievements", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ oduserId: userId });

    if (!user) {
      return res.json({ unlockedAchievements: [] });
    }

    res.json({ unlockedAchievements: user.unlockedAchievements });
  } catch (err) {
    console.error("Error fetching achievements:", err);
    res.status(500).json({ message: "Failed to fetch achievements." });
  }
});

// GET /api/users/:userId/starters - Get available starters
router.get("/:userId/starters", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ oduserId: userId });

    const defaultStarters = ['charizard', 'blastoise', 'venusaur'];

    if (!user) {
      return res.json({ unlockedStarters: defaultStarters });
    }

    res.json({ unlockedStarters: user.unlockedStarters });
  } catch (err) {
    console.error("Error fetching starters:", err);
    res.status(500).json({ message: "Failed to fetch starters." });
  }
});

export default router;
