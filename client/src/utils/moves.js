// 📁 moves.js
// Pokemon moves database with power, accuracy, PP, and type

export const moves = {
  // Normal type moves
  tackle: {
    name: "Tackle",
    type: "normal",
    power: 40,
    accuracy: 100,
    pp: 35,
    maxPP: 35,
    category: "physical",
    description: "A physical attack in which the user charges and slams into the target.",
  },
  scratch: {
    name: "Scratch",
    type: "normal",
    power: 40,
    accuracy: 100,
    pp: 35,
    maxPP: 35,
    category: "physical",
    description: "Hard, pointed, sharp claws rake the target to inflict damage.",
  },
  bodySlam: {
    name: "Body Slam",
    type: "normal",
    power: 85,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    description: "The user drops onto the target with its full body weight.",
  },
  hyperBeam: {
    name: "Hyper Beam",
    type: "normal",
    power: 150,
    accuracy: 90,
    pp: 5,
    maxPP: 5,
    category: "special",
    description: "The target is attacked with a powerful beam.",
  },

  // Fire type moves
  ember: {
    name: "Ember",
    type: "fire",
    power: 40,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "special",
    description: "The target is attacked with small flames.",
  },
  flamethrower: {
    name: "Flamethrower",
    type: "fire",
    power: 90,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    description: "The target is scorched with an intense blast of fire.",
  },
  fireBlast: {
    name: "Fire Blast",
    type: "fire",
    power: 110,
    accuracy: 85,
    pp: 5,
    maxPP: 5,
    category: "special",
    description: "The target is attacked with an intense blast of all-consuming fire.",
  },

  // Water type moves
  waterGun: {
    name: "Water Gun",
    type: "water",
    power: 40,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "special",
    description: "The target is blasted with a forceful shot of water.",
  },
  surf: {
    name: "Surf",
    type: "water",
    power: 90,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    description: "The user attacks everything around it by swamping its surroundings with a giant wave.",
  },
  hydroPump: {
    name: "Hydro Pump",
    type: "water",
    power: 110,
    accuracy: 80,
    pp: 5,
    maxPP: 5,
    category: "special",
    description: "The target is blasted by a huge volume of water launched under great pressure.",
  },

  // Grass type moves
  vineWhip: {
    name: "Vine Whip",
    type: "grass",
    power: 45,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "physical",
    description: "The target is struck with slender, whiplike vines.",
  },
  razorLeaf: {
    name: "Razor Leaf",
    type: "grass",
    power: 55,
    accuracy: 95,
    pp: 25,
    maxPP: 25,
    category: "physical",
    description: "Sharp-edged leaves are launched to slash at opposing Pokémon.",
  },
  solarBeam: {
    name: "Solar Beam",
    type: "grass",
    power: 120,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    description: "A two-turn attack where the user gathers light then blasts a bundled beam.",
  },

  // Electric type moves
  thunderShock: {
    name: "Thunder Shock",
    type: "electric",
    power: 40,
    accuracy: 100,
    pp: 30,
    maxPP: 30,
    category: "special",
    description: "A jolt of electricity crashes down on the target.",
  },
  thunderbolt: {
    name: "Thunderbolt",
    type: "electric",
    power: 90,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "special",
    description: "A strong electric blast crashes down on the target.",
  },
  thunder: {
    name: "Thunder",
    type: "electric",
    power: 110,
    accuracy: 70,
    pp: 10,
    maxPP: 10,
    category: "special",
    description: "A wicked thunderbolt is dropped on the target.",
  },

  // Ice type moves
  powderSnow: {
    name: "Powder Snow",
    type: "ice",
    power: 40,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "special",
    description: "The user attacks with a chilling gust of powdery snow.",
  },
  iceBeam: {
    name: "Ice Beam",
    type: "ice",
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    description: "The target is struck with an icy-cold beam of energy.",
  },
  blizzard: {
    name: "Blizzard",
    type: "ice",
    power: 110,
    accuracy: 70,
    pp: 5,
    maxPP: 5,
    category: "special",
    description: "A howling blizzard is summoned to strike opposing Pokémon.",
  },

  // Fighting type moves
  karateChop: {
    name: "Karate Chop",
    type: "fighting",
    power: 50,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "physical",
    description: "The target is attacked with a sharp chop.",
  },
  brickBreak: {
    name: "Brick Break",
    type: "fighting",
    power: 75,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    description: "The user attacks with a swift chop.",
  },

  // Psychic type moves
  confusion: {
    name: "Confusion",
    type: "psychic",
    power: 50,
    accuracy: 100,
    pp: 25,
    maxPP: 25,
    category: "special",
    description: "The target is hit by a weak telekinetic force.",
  },
  psychic: {
    name: "Psychic",
    type: "psychic",
    power: 90,
    accuracy: 100,
    pp: 10,
    maxPP: 10,
    category: "special",
    description: "The target is hit by a strong telekinetic force.",
  },

  // Dragon type moves
  dragonBreath: {
    name: "Dragon Breath",
    type: "dragon",
    power: 60,
    accuracy: 100,
    pp: 20,
    maxPP: 20,
    category: "special",
    description: "The user exhales a mighty gust that inflicts damage.",
  },
  dragonClaw: {
    name: "Dragon Claw",
    type: "dragon",
    power: 80,
    accuracy: 100,
    pp: 15,
    maxPP: 15,
    category: "physical",
    description: "The user slashes the target with huge, sharp claws.",
  },
};

// Get moves for a Pokemon based on its type
export function getMovesByType(pokemonType) {
  const typeMoveSets = {
    fire: ["ember", "flamethrower", "tackle", "bodySlam"],
    water: ["waterGun", "surf", "tackle", "bodySlam"],
    grass: ["vineWhip", "razorLeaf", "tackle", "bodySlam"],
    electric: ["thunderShock", "thunderbolt", "tackle", "scratch"],
    ice: ["powderSnow", "iceBeam", "tackle", "scratch"],
    fighting: ["karateChop", "brickBreak", "tackle", "bodySlam"],
    psychic: ["confusion", "psychic", "tackle", "scratch"],
    dragon: ["dragonBreath", "dragonClaw", "tackle", "scratch"],
    normal: ["tackle", "scratch", "bodySlam", "hyperBeam"],
  };

  const moveKeys = typeMoveSets[pokemonType?.toLowerCase()] || typeMoveSets.normal;

  return moveKeys.map((key) => ({
    id: key,
    ...moves[key],
  }));
}

// Generate random moves for a Pokemon
export function generatePokemonMoves(pokemon) {
  const primaryType = pokemon.types?.[0]?.toLowerCase() || "normal";
  const availableMoves = getMovesByType(primaryType);

  // Select 4 moves (or all if less than 4 available)
  const selectedMoves = availableMoves.slice(0, 4);

  return selectedMoves.map((move) => ({
    ...move,
    pp: move.maxPP, // Start with full PP
  }));
}
