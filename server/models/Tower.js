import mongoose from "mongoose";

// Tower save state schema - for cloud saves
const towerSaveSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  slotId: { type: Number, required: true, min: 0, max: 3 },
  name: { type: String, default: 'Save' },

  // Game state
  floor: { type: Number, default: 1 },
  currency: { type: Number, default: 0 },

  // Team data
  team: [{
    id: String,
    name: String,
    baseName: String,
    level: Number,
    sprite: String,
    types: [String],
    stats: {
      hp: Number,
      hp_max: Number,
      attack: Number,
      defense: Number,
      special_attack: Number,
      special_defense: Number,
      speed: Number
    },
    moves: [{
      name: String,
      type: String,
      power: Number,
      accuracy: Number,
      pp: Number,
      maxPP: Number,
      category: String
    }],
    heldItem: String,
    isMega: Boolean,
    isShiny: Boolean
  }],

  // Inventory
  inventory: [{
    id: String,
    quantity: Number
  }],

  // Tower map state
  towerMap: mongoose.Schema.Types.Mixed,
  currentNodeId: String,

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  playtime: { type: Number, default: 0 } // in milliseconds
});

// Compound index for user + slot
towerSaveSchema.index({ userId: 1, slotId: 1 }, { unique: true });

const TowerSave = mongoose.model("TowerSave", towerSaveSchema);

export default TowerSave;
