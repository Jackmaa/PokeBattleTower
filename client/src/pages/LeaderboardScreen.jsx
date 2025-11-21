// 📁 LeaderboardScreen.jsx
// Leaderboard and run history display

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from '../components/ui';
import { getTopRuns, getOverallStats, formatPlaytime } from '../utils/statsTracker';
import { useAudio } from '../hooks/useAudio';

export default function LeaderboardScreen({ onClose }) {
  const [topRuns, setTopRuns] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [selectedRun, setSelectedRun] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'victories', 'this_week'

  const { playMenuSelect } = useAudio();

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = () => {
    let runs = getTopRuns(10);

    // Apply filters
    if (filter === 'victories') {
      runs = runs.filter(r => r.victory);
    } else if (filter === 'this_week') {
      const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      runs = runs.filter(r => r.timestamp > weekAgo);
    }

    setTopRuns(runs);
    setOverallStats(getOverallStats());
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        className="max-w-6xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <Card className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">🏆 Leaderboard</h2>
              <p className="text-white/60">Your best tower runs</p>
            </div>
            <Button variant="secondary" onClick={onClose}>
              ✕ Close
            </Button>
          </div>

          {/* Overall Stats */}
          {overallStats && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-400/50">
                <div className="text-white/70 text-sm">Total Runs</div>
                <div className="text-3xl font-bold text-white">{overallStats.totalRuns}</div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-400/50">
                <div className="text-white/70 text-sm">Victories</div>
                <div className="text-3xl font-bold text-white">{overallStats.victories}</div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-400/50">
                <div className="text-white/70 text-sm">Best Floor</div>
                <div className="text-3xl font-bold text-white">{overallStats.bestFloor}</div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-orange-600/20 to-red-600/20 border-orange-400/50">
                <div className="text-white/70 text-sm">Avg. Floors</div>
                <div className="text-3xl font-bold text-white">{overallStats.averageFloors}</div>
              </Card>
            </motion.div>
          )}

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {[
              { id: 'all', label: 'All Time', icon: '📊' },
              { id: 'victories', label: 'Victories', icon: '🏆' },
              { id: 'this_week', label: 'This Week', icon: '📅' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => {
                  playMenuSelect();
                  setFilter(f.id);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-gaming-accent text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-y-auto max-h-[50vh]">
            {topRuns.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <div className="text-6xl mb-4">📭</div>
                <div className="text-xl">No runs found</div>
                <div className="text-sm mt-2">Complete a tower run to see it here!</div>
              </div>
            ) : (
              <div className="space-y-2">
                {topRuns.map((run, index) => (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        selectedRun?.id === run.id
                          ? 'border-2 border-gaming-accent bg-gaming-accent/10'
                          : 'hover:bg-white/5'
                      }`}
                      onClick={() => {
                        playMenuSelect();
                        setSelectedRun(run);
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="text-3xl font-bold w-16 text-center">
                          {getMedalEmoji(index)}
                        </div>

                        {/* Run Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl font-bold text-white">
                              Floor {run.floorsReached}
                            </span>
                            {run.victory && (
                              <span className="px-2 py-1 bg-green-600/30 border border-green-400 rounded text-green-300 text-xs font-bold">
                                VICTORY
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-white/70">
                            <div>
                              <span className="text-white/50">Starter:</span> {run.starter}
                            </div>
                            <div>
                              <span className="text-white/50">Battles:</span> {run.battlesWon}
                            </div>
                            <div>
                              <span className="text-white/50">Gold:</span> 💰 {run.goldEarned}
                            </div>
                            <div>
                              <span className="text-white/50">Time:</span> {formatPlaytime(run.playtime)}
                            </div>
                          </div>
                        </div>

                        {/* Team Preview */}
                        <div className="hidden md:flex gap-1">
                          {run.finalTeam?.slice(0, 3).map((pokemon, i) => (
                            <div
                              key={i}
                              className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden"
                              title={pokemon.name}
                            >
                              {pokemon.sprite ? (
                                <img
                                  src={pokemon.sprite}
                                  alt={pokemon.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <span className="text-2xl">?</span>
                              )}
                            </div>
                          ))}
                          {run.finalTeam?.length > 3 && (
                            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white/70 text-xs">
                              +{run.finalTeam.length - 3}
                            </div>
                          )}
                        </div>

                        {/* Date */}
                        <div className="text-white/50 text-xs text-right">
                          {formatDate(run.timestamp)}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Run Details */}
          <AnimatePresence>
            {selectedRun && (
              <motion.div
                className="mt-4 p-4 bg-gaming-accent/20 border-2 border-gaming-accent rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h3 className="text-xl font-bold text-white mb-3">Run Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Floors Reached:</span>
                    <div className="text-white font-bold">{selectedRun.floorsReached}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Battles Won:</span>
                    <div className="text-white font-bold">{selectedRun.battlesWon}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Gold Earned:</span>
                    <div className="text-white font-bold">💰 {selectedRun.goldEarned}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Items Used:</span>
                    <div className="text-white font-bold">{selectedRun.itemsUsed || 0}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Pokémon Caught:</span>
                    <div className="text-white font-bold">{selectedRun.pokemonCaught || 0}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Playtime:</span>
                    <div className="text-white font-bold">{formatPlaytime(selectedRun.playtime)}</div>
                  </div>
                </div>

                {/* Final Team */}
                {selectedRun.finalTeam && selectedRun.finalTeam.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-white font-bold mb-2">Final Team</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedRun.finalTeam.map((pokemon, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg"
                        >
                          {pokemon.sprite && (
                            <img
                              src={pokemon.sprite}
                              alt={pokemon.name}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          <div>
                            <div className="text-white font-semibold capitalize">
                              {pokemon.name}
                            </div>
                            <div className="text-white/60 text-xs">
                              Lv. {pokemon.level || 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
