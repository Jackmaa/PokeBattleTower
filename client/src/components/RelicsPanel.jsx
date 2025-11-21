import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { relicsState } from '../recoil/atoms/relics';
import { getRelicTierColor, calculateRelicBonuses, RELIC_TIERS } from '../utils/relics';

function RelicTooltip({ relic, position = 'top' }) {
  const tierColor = getRelicTierColor(relic.tier);

  const positionClasses = position === 'bottom'
    ? 'top-full left-1/2 -translate-x-1/2 mt-2'
    : 'bottom-full left-1/2 -translate-x-1/2 mb-2';

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'bottom' ? -10 : 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: position === 'bottom' ? -10 : 10, scale: 0.9 }}
      className={`absolute ${positionClasses} z-[100] pointer-events-none`}
    >
      <div
        className="bg-gray-900 rounded-lg p-3 min-w-[200px] border-2 shadow-xl"
        style={{ borderColor: tierColor }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{relic.icon}</span>
          <div>
            <div className="font-bold text-white">{relic.name}</div>
            <div
              className="text-xs font-bold uppercase"
              style={{ color: tierColor }}
            >
              {relic.tier}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-300 mb-2">{relic.description}</div>
        {relic.flavor && (
          <div className="text-xs text-gray-500 italic">"{relic.flavor}"</div>
        )}
      </div>
    </motion.div>
  );
}

function RelicIcon({ relic, size = 'md', tooltipPosition = 'top' }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tierColor = getRelicTierColor(relic.tier);

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.div
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center cursor-pointer border-2`}
        style={{
          borderColor: tierColor,
          backgroundColor: `${tierColor}20`,
        }}
        whileHover={{ scale: 1.1 }}
      >
        <span>{relic.icon}</span>

        {/* Tier glow for rare+ */}
        {(relic.tier === RELIC_TIERS.RARE || relic.tier === RELIC_TIERS.LEGENDARY) && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{ boxShadow: `0 0 10px ${tierColor}` }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {showTooltip && <RelicTooltip relic={relic} position={tooltipPosition} />}
      </AnimatePresence>
    </div>
  );
}

export default function RelicsPanel({ compact = false, tooltipPosition = 'top' }) {
  const relics = useRecoilValue(relicsState);
  const [expanded, setExpanded] = useState(false);

  if (relics.length === 0) {
    if (compact) return null;

    return (
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
        <div className="text-gray-500 text-sm text-center">No relics collected</div>
      </div>
    );
  }

  const bonuses = calculateRelicBonuses(relics);

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {relics.slice(0, 5).map((relic, index) => (
          <RelicIcon key={relic.id + index} relic={relic} size="sm" tooltipPosition={tooltipPosition} />
        ))}
        {relics.length > 5 && (
          <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-gray-400 font-bold">
            +{relics.length - 5}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🏆</span>
          <span className="font-bold text-white">Relics</span>
          <span className="text-gray-400 text-sm">({relics.length})</span>
        </div>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-gray-400"
        >
          ▼
        </motion.span>
      </button>

      {/* Relic Icons (always visible) */}
      <div className="px-3 pb-3 flex flex-wrap gap-2">
        {relics.map((relic, index) => (
          <RelicIcon key={relic.id + index} relic={relic} size="md" tooltipPosition={tooltipPosition} />
        ))}
      </div>

      {/* Expanded Bonuses */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-700 overflow-hidden"
          >
            <div className="p-3">
              <div className="text-sm font-bold text-purple-400 mb-2">Active Bonuses</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {bonuses.attack_bonus > 0 && (
                  <div className="text-gray-300">+{bonuses.attack_bonus} Attack</div>
                )}
                {bonuses.defense_bonus > 0 && (
                  <div className="text-gray-300">+{bonuses.defense_bonus} Defense</div>
                )}
                {bonuses.speed_bonus > 0 && (
                  <div className="text-gray-300">+{bonuses.speed_bonus} Speed</div>
                )}
                {bonuses.hp_bonus > 0 && (
                  <div className="text-gray-300">+{bonuses.hp_bonus} HP</div>
                )}
                {bonuses.all_stats > 0 && (
                  <div className="text-gray-300">+{bonuses.all_stats} All Stats</div>
                )}
                {bonuses.crit_chance > 0 && (
                  <div className="text-gray-300">+{Math.round(bonuses.crit_chance * 100)}% Crit</div>
                )}
                {bonuses.gold_bonus > 0 && (
                  <div className="text-yellow-400">+{Math.round(bonuses.gold_bonus * 100)}% Gold</div>
                )}
                {bonuses.lifesteal > 0 && (
                  <div className="text-red-400">+{Math.round(bonuses.lifesteal * 100)}% Lifesteal</div>
                )}
                {bonuses.post_battle_heal > 0 && (
                  <div className="text-green-400">+{Math.round(bonuses.post_battle_heal * 100)}% Post-Battle Heal</div>
                )}
                {bonuses.shop_discount > 0 && (
                  <div className="text-amber-400">-{Math.round(bonuses.shop_discount * 100)}% Shop Prices</div>
                )}
                {bonuses.revive_once && (
                  <div className="text-purple-400">Revive Ready</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export individual components for use elsewhere
export { RelicIcon, RelicTooltip };
