// 📁 TurnOrderDisplay.jsx
// Displays turn order for all combatants in NvM combat

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui";

/**
 * Single combatant portrait in turn order
 */
function CombatantPortrait({
  combatant,
  isCurrent,
  index,
  showTargeting = false,
  onTargetClick,
}) {
  const { name, sprite, hp, maxHp, isEnemy, status, targetedBy, currentTarget } = combatant;
  const hpPercent = Math.round((hp / maxHp) * 100);

  // HP bar color
  const getHpColor = () => {
    if (hpPercent > 50) return 'bg-green-500';
    if (hpPercent > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Status indicator
  const getStatusIcon = () => {
    switch (status) {
      case 'paralyzed': return '⚡';
      case 'burned': return '🔥';
      case 'poisoned': return '☠️';
      case 'frozen': return '❄️';
      case 'asleep': return '💤';
      default: return null;
    }
  };

  return (
    <motion.div
      className={`relative flex flex-col items-center cursor-pointer transition-all ${
        isCurrent ? 'scale-110 z-10' : 'opacity-70 hover:opacity-100'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onTargetClick?.(combatant)}
      whileHover={{ scale: isCurrent ? 1.1 : 1.05 }}
    >
      {/* Current turn indicator */}
      {isCurrent && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <span className="text-yellow-400 text-sm">▼</span>
        </motion.div>
      )}

      {/* Portrait container */}
      <div
        className={`relative w-12 h-12 rounded-lg border-2 overflow-hidden ${
          isEnemy
            ? 'border-red-500/70 bg-red-900/30'
            : 'border-blue-500/70 bg-blue-900/30'
        } ${isCurrent ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900' : ''}`}
      >
        <img
          src={sprite}
          alt={name}
          className={`w-full h-full object-contain ${isEnemy ? 'scale-x-[-1]' : ''}`}
        />

        {/* Status indicator */}
        {status && (
          <div className="absolute top-0 right-0 bg-black/70 rounded-bl px-0.5 text-xs">
            {getStatusIcon()}
          </div>
        )}

        {/* Targeting indicator - who is targeting this combatant */}
        {targetedBy && targetedBy.length > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {targetedBy.length}
          </motion.div>
        )}
      </div>

      {/* HP bar */}
      <div className="w-12 h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
        <motion.div
          className={`h-full ${getHpColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${hpPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Name */}
      <p className="text-[10px] text-white/80 truncate max-w-12 mt-0.5 capitalize">
        {name.split(' ')[0]}
      </p>

      {/* Targeting line */}
      {showTargeting && currentTarget && (
        <motion.div
          className="absolute top-1/2 right-0 w-8 h-0.5 bg-red-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: 'left' }}
        />
      )}
    </motion.div>
  );
}

/**
 * Arrow separator between combatants
 */
function TurnArrow({ index }) {
  return (
    <motion.div
      className="text-white/30 text-sm mx-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 + 0.1 }}
    >
      →
    </motion.div>
  );
}

/**
 * Main turn order display component
 */
export default function TurnOrderDisplay({
  turnOrder = [],
  currentTurnIndex = 0,
  roundNumber = 1,
  isVisible = true,
  onCombatantClick,
  compact = false,
}) {
  if (!isVisible || turnOrder.length === 0) {
    return (
      <div className="glass-card p-3 border-2 border-white/10 flex items-center justify-center">
        <p className="text-white/40 italic text-xs">Preparing battle...</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1 p-2 bg-black/30 rounded-lg">
        {turnOrder.slice(0, 8).map((combatant, index) => (
          <div key={combatant.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded border ${
                combatant.isEnemy ? 'border-red-500/50' : 'border-blue-500/50'
              } ${index === currentTurnIndex ? 'ring-1 ring-yellow-400' : ''}`}
            >
              <img
                src={combatant.sprite}
                alt={combatant.name}
                className={`w-full h-full object-contain ${combatant.isEnemy ? 'scale-x-[-1]' : ''}`}
              />
            </div>
            {index < turnOrder.length - 1 && index < 7 && (
              <span className="text-white/20 text-xs mx-0.5">→</span>
            )}
          </div>
        ))}
        {turnOrder.length > 8 && (
          <span className="text-white/50 text-xs ml-1">+{turnOrder.length - 8}</span>
        )}
      </div>
    );
  }

  return (
    <Card className="p-3 border-2 border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-purple-400 flex items-center gap-1">
          ⚔️ Turn Order
        </h3>
        <div className="text-xs text-white/50">
          Round {roundNumber}
        </div>
      </div>

      {/* Turn order bar */}
      <div className="flex items-center justify-center gap-1 py-2 overflow-x-auto">
        <AnimatePresence mode="popLayout">
          {turnOrder.map((combatant, index) => (
            <div key={combatant.id} className="flex items-center">
              <CombatantPortrait
                combatant={combatant}
                isCurrent={index === currentTurnIndex}
                index={index}
                onTargetClick={onCombatantClick}
              />
              {index < turnOrder.length - 1 && <TurnArrow index={index} />}
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Current turn info */}
      {turnOrder[currentTurnIndex] && (
        <motion.div
          className="mt-2 text-center"
          key={currentTurnIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className={`text-sm font-bold ${
            turnOrder[currentTurnIndex].isEnemy ? 'text-red-400' : 'text-blue-400'
          }`}>
            {turnOrder[currentTurnIndex].isEnemy ? '👾 Enemy' : '🎮 Your'} {turnOrder[currentTurnIndex].name}'s turn
          </p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-white/50">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border border-blue-500/50 bg-blue-900/30" />
          <span>Player</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border border-red-500/50 bg-red-900/30" />
          <span>Enemy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border border-yellow-400 ring-1 ring-yellow-400" />
          <span>Current</span>
        </div>
      </div>
    </Card>
  );
}

// Export for use elsewhere
export { CombatantPortrait };
