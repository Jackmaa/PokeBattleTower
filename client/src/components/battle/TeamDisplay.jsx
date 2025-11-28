// TeamDisplay.jsx
// Team overview display for battle screens

import { motion } from 'framer-motion';
import { memo } from 'react';
import typeColors from '../../utils/typeColors';

/**
 * Single Pokemon team member card
 */
const TeamMemberCard = memo(function TeamMemberCard({
  pokemon,
  isActive = false,
  index,
  onClick,
}) {
  const hpPercent = (pokemon.stats.hp / pokemon.stats.hp_max) * 100;
  const isFainted = pokemon.stats.hp <= 0;

  return (
    <motion.div
      className={`relative p-2 rounded-lg border-2 transition-all cursor-pointer ${
        isActive
          ? 'border-yellow-400 bg-yellow-400/10'
          : isFainted
          ? 'border-red-500/30 bg-red-500/5'
          : 'border-white/10 bg-white/5 hover:border-white/30'
      }`}
      whileHover={!isFainted ? { scale: 1.02 } : {}}
      whileTap={!isFainted ? { scale: 0.98 } : {}}
      onClick={() => !isFainted && onClick?.(index)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
      )}

      <div className="flex items-center gap-2">
        {/* Sprite */}
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="w-12 h-12 pixelated"
          style={{
            filter: isFainted ? 'grayscale(100%)' : 'none',
            opacity: isFainted ? 0.4 : 1,
          }}
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name and Level */}
          <div className="flex items-center justify-between gap-1">
            <span className={`font-bold text-sm truncate ${isFainted ? 'text-white/40' : 'text-white'}`}>
              {pokemon.name}
            </span>
            <span className={`text-xs ${isFainted ? 'text-white/30' : 'text-white/60'}`}>
              Lv.{pokemon.level}
            </span>
          </div>

          {/* HP Bar */}
          <div className="mt-1">
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor:
                    hpPercent > 50
                      ? '#10b981'
                      : hpPercent > 20
                      ? '#f59e0b'
                      : '#ef4444',
                }}
                initial={{ width: '100%' }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className={`text-xs mt-0.5 ${isFainted ? 'text-white/30' : 'text-white/60'}`}>
              {isFainted ? 'Fainted' : `${pokemon.stats.hp}/${pokemon.stats.hp_max}`}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

/**
 * Team Display component
 * Shows overview of all team members
 */
export default function TeamDisplay({
  team,
  activeIndex = null,
  onPokemonClick,
  title = 'Your Team',
  className = '',
}) {
  if (!team || team.length === 0) {
    return (
      <div className={`bg-black/40 rounded-xl border border-white/10 p-4 ${className}`}>
        <p className="text-white/40 text-sm text-center">No team members</p>
      </div>
    );
  }

  const aliveCount = team.filter(p => p.stats.hp > 0).length;

  return (
    <div className={`bg-black/40 rounded-xl border border-white/10 ${className}`}>
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">{title}</h3>
        <div className="text-xs text-white/60">
          {aliveCount}/{team.length} Active
        </div>
      </div>

      {/* Team Grid */}
      <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {team.map((pokemon, index) => (
          <TeamMemberCard
            key={pokemon.id || index}
            pokemon={pokemon}
            isActive={index === activeIndex}
            index={index}
            onClick={onPokemonClick}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Compact team display for small spaces
 * Shows only HP bars in a row
 */
export function CompactTeamDisplay({ team, className = '' }) {
  if (!team || team.length === 0) return null;

  return (
    <div className={`flex gap-1 ${className}`}>
      {team.map((pokemon, index) => {
        const hpPercent = (pokemon.stats.hp / pokemon.stats.hp_max) * 100;
        const isFainted = pokemon.stats.hp <= 0;

        return (
          <div
            key={pokemon.id || index}
            className="flex-1 min-w-0"
            title={`${pokemon.name}: ${pokemon.stats.hp}/${pokemon.stats.hp_max} HP`}
          >
            <div className="h-2 bg-black/60 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: isFainted
                    ? '#666'
                    : hpPercent > 50
                    ? '#10b981'
                    : hpPercent > 20
                    ? '#f59e0b'
                    : '#ef4444',
                }}
                initial={{ width: '100%' }}
                animate={{ width: `${hpPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Turn order display for NvM battles
 */
export function TurnOrderDisplay({ turnOrder, currentIndex = 0, className = '' }) {
  if (!turnOrder || turnOrder.length === 0) return null;

  return (
    <div className={`bg-black/40 rounded-xl border border-white/10 p-3 ${className}`}>
      <h3 className="text-white font-bold text-sm mb-2">Turn Order</h3>
      <div className="flex flex-wrap gap-2">
        {turnOrder.map((combatant, index) => {
          const isCurrentTurn = index === currentIndex;
          const primaryType = combatant.pokemon?.types?.[0] || 'normal';

          return (
            <motion.div
              key={`${combatant.id}-${index}`}
              className={`px-2 py-1 rounded-lg text-xs font-bold border-2 ${
                isCurrentTurn
                  ? 'border-yellow-400 bg-yellow-400/20'
                  : 'border-white/10 bg-white/5'
              }`}
              style={{
                color: isCurrentTurn ? '#fbbf24' : 'white',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {combatant.pokemon?.name || 'Unknown'}
              {isCurrentTurn && ' ▶'}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
