import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema({
  name: String,
  level: Number,
  isShiny: Boolean,
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    speed: Number,
    special_attack: Number,
    special_defense: Number,
  },
});

const runSchema = new mongoose.Schema({
  username: { type: String, required: true },
  team: [pokemonSchema],
  floorReached: { type: Number, required: true },
  rewardsChosen: [String],
  timestamp: { type: Date, default: Date.now },
});

const Run = mongoose.model("Run", runSchema);

export default Run;
