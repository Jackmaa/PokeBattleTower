import mongoose from "mongoose";

// Leaderboard entry schema - for global leaderboard
const leaderboardEntrySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  username: { type: String, required: true },

  // Run stats
  floorsReached: { type: Number, required: true },
  victory: { type: Boolean, default: false },
  battlesWon: { type: Number, default: 0 },
  goldEarned: { type: Number, default: 0 },
  playtime: { type: Number, default: 0 }, // milliseconds

  // Starter info
  starter: { type: String, required: true },

  // Final team
  finalTeam: [{
    name: String,
    level: Number,
    sprite: String,
    types: [String]
  }],

  // Difficulty
  difficulty: { type: String, default: 'normal', enum: ['easy', 'normal', 'hard', 'extreme'] },

  // Score calculation
  score: { type: Number, default: 0 },

  // Timestamps
  timestamp: { type: Date, default: Date.now }
});

// Index for leaderboard queries
leaderboardEntrySchema.index({ score: -1 });
leaderboardEntrySchema.index({ floorsReached: -1, timestamp: 1 });
leaderboardEntrySchema.index({ victory: 1, score: -1 });

// Calculate score before saving
leaderboardEntrySchema.pre('save', function(next) {
  // Score formula: floors * 100 + battles * 10 + gold/10 + victory bonus
  this.score = (this.floorsReached * 100) +
               (this.battlesWon * 10) +
               Math.floor(this.goldEarned / 10) +
               (this.victory ? 1000 : 0);

  // Difficulty multiplier
  const diffMultipliers = { easy: 0.5, normal: 1, hard: 1.5, extreme: 2 };
  this.score = Math.floor(this.score * (diffMultipliers[this.difficulty] || 1));

  next();
});

const LeaderboardEntry = mongoose.model("LeaderboardEntry", leaderboardEntrySchema);

export default LeaderboardEntry;
