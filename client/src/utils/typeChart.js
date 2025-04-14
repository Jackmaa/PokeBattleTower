// 📁 utils/typeChart.js

export const typeChart = {
  fire: {
    weakTo: ["water", "rock", "ground"],
    strongAgainst: ["grass", "ice", "bug", "steel"],
  },
  water: {
    weakTo: ["electric", "grass"],
    strongAgainst: ["fire", "rock", "ground"],
  },
  grass: {
    weakTo: ["fire", "ice", "bug", "flying"],
    strongAgainst: ["water", "rock", "ground"],
  },
  electric: {
    weakTo: ["ground"],
    strongAgainst: ["water", "flying"],
  },
  ground: {
    weakTo: ["water", "grass", "ice"],
    strongAgainst: ["fire", "electric", "rock", "poison", "steel"],
  },
  rock: {
    weakTo: ["water", "grass", "fighting", "steel", "ground"],
    strongAgainst: ["fire", "ice", "flying", "bug"],
  },
  flying: {
    weakTo: ["electric", "rock", "ice"],
    strongAgainst: ["grass", "fighting", "bug"],
  },
  bug: {
    weakTo: ["fire", "flying", "rock"],
    strongAgainst: ["grass", "psychic", "dark"],
  },
  ice: {
    weakTo: ["fire", "rock", "fighting", "steel"],
    strongAgainst: ["grass", "ground", "flying", "dragon"],
  },
  steel: {
    weakTo: ["fire", "fighting", "ground"],
    strongAgainst: ["ice", "rock", "fairy"],
  },
  // ⚠️ Ajoute les autres types si nécessaire
};

export const getTypeEffectiveness = (attackerType, defenderTypes = []) => {
  if (!attackerType || !typeChart[attackerType]) return 1;

  let multiplier = 1;
  for (const defType of defenderTypes) {
    if (typeChart[attackerType].strongAgainst.includes(defType)) {
      multiplier *= 2;
    } else if (typeChart[attackerType].weakTo.includes(defType)) {
      multiplier *= 0.5;
    }
  }
  return multiplier;
};
