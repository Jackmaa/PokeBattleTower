import mongoose from "mongoose";

// User meta-progression schema
const userSchema = new mongoose.Schema({
  // User identification (can be anonymous or authenticated)
  oduserId: { type: String, required: true, unique: true, index: true },
  username: { type: String, default: 'Trainer' },

  // Meta-progression stats
  totalRuns: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  highestFloor: { type: Number, default: 0 },
  totalGoldEarned: { type: Number, default: 0 },
  totalPokemonCaught: { type: Number, default: 0 },

  // Permanent currency (persists between runs)
  permanentGold: { type: Number, default: 0 },

  // Unlocks
  unlockedStarters: {
    type: [String],
    default: ['charizard', 'blastoise', 'venusaur']
  },
  unlockedAchievements: { type: [String], default: [] },

  // Settings
  selectedDifficulty: {
    type: String,
    default: 'normal',
    enum: ['easy', 'normal', 'hard', 'extreme']
  },
  selectedTheme: { type: String, default: 'dark' },

  // Detailed stats
  stats: {
    totalBattlesWon: { type: Number, default: 0 },
    totalDamageDealt: { type: Number, default: 0 },
    totalMegaEvolutions: { type: Number, default: 0 },
    perfectBattles: { type: Number, default: 0 },
    totalItemsUsed: { type: Number, default: 0 },
    longestWinStreak: { type: Number, default: 0 },
    totalPlaytime: { type: Number, default: 0 }
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastPlayedAt: { type: Date, default: Date.now }
});

// Method to update after run
userSchema.methods.updateAfterRun = function(runData) {
  this.totalRuns += 1;
  this.totalGoldEarned += runData.goldEarned || 0;
  this.totalPokemonCaught += runData.pokemonCaught || 0;

  if (runData.floor > this.highestFloor) {
    this.highestFloor = runData.floor;
  }

  if (runData.victory) {
    this.totalWins += 1;
  }

  // Add 10% of gold to permanent gold
  this.permanentGold += Math.floor((runData.goldEarned || 0) * 0.1);

  this.lastPlayedAt = new Date();
};

const User = mongoose.model("User", userSchema);

export default User;
