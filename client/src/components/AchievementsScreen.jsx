import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllAchievements, getMetaProgress } from '../utils/metaProgression';
import { loadProgression, getPlayerTitle } from '../utils/playerProgression';

// Achievement categories for filtering
const CATEGORIES = {
  ALL: 'all',
  PROGRESS: 'progress',
  COMBAT: 'combat',
  COLLECTION: 'collection',
  CHALLENGE: 'challenge',
};

// Map achievements to categories
function getAchievementCategory(achievementId) {
  const progressAchievements = ['first_win', 'floor_5', 'floor_10', 'floor_15', 'floor_20'];
  const combatAchievements = ['defeat_100', 'boss_slayer', 'elite_hunter', 'perfect_battle'];
  const collectionAchievements = ['collector', 'full_team', 'item_hoarder'];
  const challengeAchievements = ['speedrunner', 'no_items', 'solo_run', 'hard_mode'];

  if (progressAchievements.includes(achievementId)) return CATEGORIES.PROGRESS;
  if (combatAchievements.includes(achievementId)) return CATEGORIES.COMBAT;
  if (collectionAchievements.includes(achievementId)) return CATEGORIES.COLLECTION;
  if (challengeAchievements.includes(achievementId)) return CATEGORIES.CHALLENGE;
  return CATEGORIES.PROGRESS;
}

function AchievementCard({ achievement, index }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
        achievement.unlocked
          ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/50'
          : 'bg-gray-800/50 border-gray-700 opacity-60'
      }`}
      onClick={() => setShowDetails(!showDetails)}
      whileHover={{ scale: 1.02 }}
    >
      {/* Icon */}
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
            achievement.unlocked
              ? 'bg-gradient-to-br from-yellow-500 to-amber-600'
              : 'bg-gray-700 grayscale'
          }`}
        >
          {achievement.unlocked ? achievement.icon : '?'}
        </div>

        <div className="flex-1">
          <h3 className={`font-bold text-lg ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
            {achievement.name}
          </h3>
          <p className={`text-sm ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
            {achievement.description}
          </p>
        </div>

        {/* Unlocked badge */}
        {achievement.unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-sm">✓</span>
          </motion.div>
        )}
      </div>

      {/* Reward info (if any) */}
      {achievement.reward && showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-white/10"
        >
          <div className="text-sm text-amber-400">
            Reward: {achievement.reward}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function AchievementsScreen({ onClose }) {
  const [achievements, setAchievements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.ALL);
  const [metaProgress, setMetaProgress] = useState(null);
  const [playerProgress, setPlayerProgress] = useState(null);

  useEffect(() => {
    const allAchievements = getAllAchievements();
    setAchievements(allAchievements);
    setMetaProgress(getMetaProgress());
    setPlayerProgress(loadProgression());
  }, []);

  const filteredAchievements = selectedCategory === CATEGORIES.ALL
    ? achievements
    : achievements.filter(a => getAchievementCategory(a.id) === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const title = playerProgress ? getPlayerTitle(playerProgress.level) : { icon: '🌱', title: 'Novice' };

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
        <div className="bg-gradient-to-r from-yellow-600 to-amber-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span>🏆</span>
                <span>Achievements</span>
              </h2>
              <div className="text-yellow-200 mt-1">
                {title.icon} {title.title}
              </div>
            </div>

            <div className="text-right">
              <div className="text-4xl font-bold text-white">
                {unlockedCount}/{totalCount}
              </div>
              <div className="text-yellow-200 text-sm">
                {completionPercent}% Complete
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-3 bg-yellow-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-300 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-4 border-b border-gray-700 flex gap-2 overflow-x-auto">
          {Object.entries(CATEGORIES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(value)}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                selectedCategory === value
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="p-4 overflow-y-auto max-h-[55vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No achievements in this category
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="border-t border-gray-700 p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{metaProgress?.totalWins || 0}</div>
              <div className="text-xs text-gray-400">Total Wins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{metaProgress?.totalRuns || 0}</div>
              <div className="text-xs text-gray-400">Total Runs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{metaProgress?.highestFloor || 0}</div>
              <div className="text-xs text-gray-400">Highest Floor</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{metaProgress?.permanentGold || 0}</div>
              <div className="text-xs text-gray-400">Permanent Gold</div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
