import express from "express";
import LeaderboardEntry from "../models/Leaderboard.js";

const router = express.Router();

// GET /api/leaderboard - Get global leaderboard
router.get("/", async (req, res) => {
  try {
    const {
      limit = 100,
      offset = 0,
      filter = 'all', // 'all', 'victories', 'this_week'
      difficulty
    } = req.query;

    let query = {};

    // Apply filters
    if (filter === 'victories') {
      query.victory = true;
    } else if (filter === 'this_week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      query.timestamp = { $gte: weekAgo };
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    const entries = await LeaderboardEntry
      .find(query)
      .sort({ score: -1, floorsReached: -1, timestamp: 1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await LeaderboardEntry.countDocuments(query);

    res.json({
      entries,
      total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard." });
  }
});

// GET /api/leaderboard/user/:userId - Get user's entries
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const entries = await LeaderboardEntry
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    // Get user's best rank
    const bestEntry = await LeaderboardEntry.findOne({ userId }).sort({ score: -1 });
    let rank = null;

    if (bestEntry) {
      rank = await LeaderboardEntry.countDocuments({ score: { $gt: bestEntry.score } }) + 1;
    }

    res.json({
      entries,
      bestRank: rank,
      bestScore: bestEntry?.score || 0
    });
  } catch (err) {
    console.error("Error fetching user entries:", err);
    res.status(500).json({ message: "Failed to fetch user entries." });
  }
});

// POST /api/leaderboard - Submit a run to leaderboard
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      username,
      floorsReached,
      victory,
      battlesWon,
      goldEarned,
      playtime,
      starter,
      finalTeam,
      difficulty
    } = req.body;

    // Validate required fields
    if (!userId || !username || floorsReached === undefined || !starter) {
      return res.status(400).json({
        message: "userId, username, floorsReached, and starter are required."
      });
    }

    const entry = new LeaderboardEntry({
      userId,
      username,
      floorsReached,
      victory: victory || false,
      battlesWon: battlesWon || 0,
      goldEarned: goldEarned || 0,
      playtime: playtime || 0,
      starter,
      finalTeam: finalTeam || [],
      difficulty: difficulty || 'normal'
    });

    const savedEntry = await entry.save();

    // Get rank
    const rank = await LeaderboardEntry.countDocuments({
      score: { $gt: savedEntry.score }
    }) + 1;

    res.status(201).json({
      entry: savedEntry,
      rank
    });
  } catch (err) {
    console.error("Error submitting to leaderboard:", err);
    res.status(500).json({ message: "Failed to submit to leaderboard." });
  }
});

// GET /api/leaderboard/stats - Get global stats
router.get("/stats", async (req, res) => {
  try {
    const stats = await LeaderboardEntry.aggregate([
      {
        $group: {
          _id: null,
          totalRuns: { $sum: 1 },
          totalVictories: { $sum: { $cond: ['$victory', 1, 0] } },
          avgFloorsReached: { $avg: '$floorsReached' },
          highestFloor: { $max: '$floorsReached' },
          totalGoldEarned: { $sum: '$goldEarned' },
          totalPlaytime: { $sum: '$playtime' }
        }
      }
    ]);

    // Get unique players
    const uniquePlayers = await LeaderboardEntry.distinct('userId');

    // Get most popular starters
    const popularStarters = await LeaderboardEntry.aggregate([
      { $group: { _id: '$starter', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      ...(stats[0] || {
        totalRuns: 0,
        totalVictories: 0,
        avgFloorsReached: 0,
        highestFloor: 0,
        totalGoldEarned: 0,
        totalPlaytime: 0
      }),
      uniquePlayers: uniquePlayers.length,
      popularStarters: popularStarters.map(s => ({
        starter: s._id,
        count: s.count
      }))
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

export default router;
