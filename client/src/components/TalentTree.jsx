import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TALENTS,
  TALENT_BRANCHES,
  loadProgression,
  saveProgression,
  getTalentRank,
  canUnlockTalent,
  unlockTalent,
  resetTalents,
  getAvailableTalentPoints,
  getPlayerTitle,
  getXPForLevel,
} from '../utils/playerProgression';

const BRANCH_CONFIG = {
  [TALENT_BRANCHES.COMBAT]: {
    name: 'Combat',
    icon: '⚔️',
    color: '#ef4444',
    gradient: 'from-red-600 to-red-400',
    description: 'Increase damage and critical hits',
  },
  [TALENT_BRANCHES.SURVIVAL]: {
    name: 'Survival',
    icon: '🛡️',
    color: '#10b981',
    gradient: 'from-green-600 to-green-400',
    description: 'Boost HP, defense, and healing',
  },
  [TALENT_BRANCHES.FORTUNE]: {
    name: 'Fortune',
    icon: '💰',
    color: '#f59e0b',
    gradient: 'from-amber-600 to-amber-400',
    description: 'Earn more gold and find better items',
  },
  [TALENT_BRANCHES.MASTERY]: {
    name: 'Mastery',
    icon: '✨',
    color: '#8b5cf6',
    gradient: 'from-purple-600 to-purple-400',
    description: 'Enhance XP gain and Pokémon power',
  },
};

function TalentNode({ talent, rank, maxRank, canUpgrade, onUpgrade, branchColor }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isMaxed = rank >= maxRank;
  const isUnlocked = rank > 0;

  const description = talent.description.replace('{value}', talent.valuePerRank * (rank || 1));

  return (
    <div className="relative">
      <motion.button
        className={`
          relative w-14 h-14 rounded-xl border-2 flex items-center justify-center
          transition-all duration-200 cursor-pointer
          ${isMaxed ? 'border-yellow-400 bg-yellow-500/20' : ''}
          ${isUnlocked && !isMaxed ? 'border-opacity-100' : 'border-opacity-40'}
          ${canUpgrade ? 'hover:scale-110 hover:shadow-lg' : 'opacity-60'}
        `}
        style={{
          borderColor: branchColor,
          backgroundColor: isUnlocked ? `${branchColor}20` : 'transparent',
        }}
        whileHover={canUpgrade ? { scale: 1.1 } : {}}
        whileTap={canUpgrade ? { scale: 0.95 } : {}}
        onClick={() => canUpgrade && onUpgrade(talent.id)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="text-2xl">{talent.icon}</span>

        {/* Rank indicator */}
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
          style={{
            backgroundColor: isMaxed ? '#eab308' : branchColor,
            color: 'white'
          }}
        >
          {rank}/{maxRank}
        </div>

        {/* Glow effect when maxed */}
        {isMaxed && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{ boxShadow: `0 0 15px ${branchColor}` }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          >
            <div
              className="bg-gray-900 border rounded-lg p-3 w-48 text-center shadow-xl"
              style={{ borderColor: branchColor }}
            >
              <div className="font-bold text-white mb-1">{talent.name}</div>
              <div className="text-sm text-gray-300 mb-2">{description}</div>
              <div className="text-xs text-gray-400">
                Tier {talent.tier} • Requires Lv.{talent.levelRequired}
              </div>
              {talent.requires.length > 0 && (
                <div className="text-xs text-amber-400 mt-1">
                  Requires: {talent.requires.map(r => TALENTS[r]?.name).join(', ')}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TalentBranch({ branch, progression, onUpgrade }) {
  const config = BRANCH_CONFIG[branch];
  const branchTalents = Object.values(TALENTS).filter(t => t.branch === branch);

  // Group by tier
  const tierGroups = {};
  branchTalents.forEach(talent => {
    if (!tierGroups[talent.tier]) tierGroups[talent.tier] = [];
    tierGroups[talent.tier].push(talent);
  });

  const totalRanks = branchTalents.reduce((sum, t) => sum + getTalentRank(progression, t.id), 0);
  const maxRanks = branchTalents.reduce((sum, t) => sum + t.maxRank, 0);

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      {/* Branch Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center text-xl`}
        >
          {config.icon}
        </div>
        <div>
          <div className="font-bold text-white">{config.name}</div>
          <div className="text-xs text-gray-400">{config.description}</div>
        </div>
        <div className="ml-auto text-sm font-bold" style={{ color: config.color }}>
          {totalRanks}/{maxRanks}
        </div>
      </div>

      {/* Talent Tiers */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map(tier => {
          const talents = tierGroups[tier] || [];
          if (talents.length === 0) return null;

          return (
            <div key={tier}>
              <div className="text-xs text-gray-500 mb-2">
                Tier {tier} {tier === 4 && '(Capstone)'}
              </div>
              <div className="flex gap-3 justify-center">
                {talents.map(talent => (
                  <TalentNode
                    key={talent.id}
                    talent={talent}
                    rank={getTalentRank(progression, talent.id)}
                    maxRank={talent.maxRank}
                    canUpgrade={canUnlockTalent(progression, talent.id).canUnlock}
                    onUpgrade={onUpgrade}
                    branchColor={config.color}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TalentTree({ onClose }) {
  const [progression, setProgression] = useState(loadProgression());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const availablePoints = getAvailableTalentPoints(progression);
  const title = getPlayerTitle(progression.level);
  const xpForNext = getXPForLevel(progression.level + 1);
  const xpProgress = progression.currentXP / xpForNext;

  const handleUpgrade = (talentId) => {
    const result = unlockTalent(progression, talentId);
    if (result.success) {
      setProgression(result.progression);
    }
  };

  const handleReset = () => {
    const updated = resetTalents(progression);
    setProgression(updated);
    setShowResetConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>{title.icon}</span>
                <span>Talent Tree</span>
              </h2>
              <div className="text-purple-200 text-sm">
                {title.title} • Level {progression.level}
              </div>
            </div>

            <div className="text-right">
              <div className="text-white font-bold text-lg">
                {availablePoints} Points Available
              </div>
              <div className="text-purple-200 text-sm">
                {progression.talentPointsSpent} spent
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-purple-200 mb-1">
              <span>XP Progress</span>
              <span>{progression.currentXP} / {xpForNext}</span>
            </div>
            <div className="h-2 bg-purple-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Talent Branches */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(TALENT_BRANCHES).map(branch => (
              <TalentBranch
                key={branch}
                branch={branch}
                progression={progression}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 flex justify-between items-center">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
          >
            Reset Talents
          </button>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-lg">
              <span className="text-amber-400">🪙</span>
              <span className="text-amber-300 font-bold">{progression.towerTokens} Tokens</span>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-600 max-w-sm"
              >
                <h3 className="text-xl font-bold text-white mb-3">Reset Talents?</h3>
                <p className="text-gray-300 mb-4">
                  This will refund all your talent points. You can redistribute them freely.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                  >
                    Reset
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
