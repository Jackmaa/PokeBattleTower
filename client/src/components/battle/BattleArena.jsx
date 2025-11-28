// BattleArena.jsx
// Main battle arena display with Pokemon sprites and battlefield

import { motion } from 'framer-motion';
import { memo } from 'react';

/**
 * Single Pokemon sprite display
 */
const PokemonSprite = memo(function PokemonSprite({
  pokemon,
  isPlayer = true,
  isAttacking = false,
  screenShake = false,
}) {
  if (!pokemon) return null;

  const baseX = isPlayer ? 20 : 75;
  const baseY = isPlayer ? 60 : 30;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${baseX}%`,
        top: `${baseY}%`,
      }}
      animate={{
        x: isAttacking ? (isPlayer ? 50 : -50) : 0,
        scale: screenShake ? [1, 1.1, 0.9, 1.05, 1] : 1,
      }}
      transition={{
        x: { duration: 0.3, type: 'spring' },
        scale: { duration: 0.5 },
      }}
    >
      {/* HP Bar */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 bg-black/60 rounded-full p-1">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: pokemon.stats.hp / pokemon.stats.hp_max > 0.5
                ? '#10b981'
                : pokemon.stats.hp / pokemon.stats.hp_max > 0.2
                ? '#f59e0b'
                : '#ef4444',
            }}
            initial={{ width: '100%' }}
            animate={{ width: `${(pokemon.stats.hp / pokemon.stats.hp_max) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-xs text-white text-center mt-0.5">
          {pokemon.stats.hp}/{pokemon.stats.hp_max}
        </div>
      </div>

      {/* Pokemon Sprite */}
      <motion.img
        src={pokemon.sprite}
        alt={pokemon.name}
        className="w-32 h-32 pixelated drop-shadow-2xl"
        style={{
          filter: pokemon.stats.hp <= 0 ? 'grayscale(100%)' : 'none',
          opacity: pokemon.stats.hp <= 0 ? 0.5 : 1,
        }}
        whileHover={{ scale: 1.05 }}
      />

      {/* Pokemon Name */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-bold bg-black/60 px-2 py-1 rounded">
        {pokemon.name} Lv.{pokemon.level}
      </div>
    </motion.div>
  );
});

/**
 * Background battlefield with weather effects
 */
const BattleField = memo(function BattleField({ weather = 'none' }) {
  const getWeatherOverlay = () => {
    switch (weather) {
      case 'rain':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-4 bg-blue-400/40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, 400],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        );
      case 'sandstorm':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-600/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        );
      case 'hail':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white/80 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, 400],
                  rotate: [0, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        );
      case 'sun':
        return (
          <div className="absolute inset-0 bg-yellow-400/10 pointer-events-none">
            <motion.div
              className="absolute top-4 right-4 w-16 h-16 bg-yellow-400/40 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-400 to-green-600">
      {/* Ground */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-800 to-green-600" />

      {/* Grid lines for depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/3 w-full h-px bg-white/10" />
        <div className="absolute bottom-1/2 w-full h-px bg-white/10" />
      </div>

      {/* Weather overlay */}
      {getWeatherOverlay()}
    </div>
  );
});

/**
 * Main Battle Arena component
 */
export default function BattleArena({
  playerPokemon,
  enemyPokemon,
  attackingPokemon = null,
  weather = 'none',
  screenShake = false,
}) {
  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden border-4 border-white/20">
      {/* Battlefield background */}
      <BattleField weather={weather} />

      {/* Player Pokemon */}
      {playerPokemon && (
        <PokemonSprite
          pokemon={playerPokemon}
          isPlayer={true}
          isAttacking={attackingPokemon === 'player'}
          screenShake={screenShake && attackingPokemon !== 'player'}
        />
      )}

      {/* Enemy Pokemon */}
      {enemyPokemon && (
        <PokemonSprite
          pokemon={enemyPokemon}
          isPlayer={false}
          isAttacking={attackingPokemon === 'enemy'}
          screenShake={screenShake && attackingPokemon !== 'enemy'}
        />
      )}
    </div>
  );
}
