import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { teamState } from "../recoil/atoms/team";
import { floorState } from "../recoil/atoms/floor";
import { towerMapState, currentNodeState } from "../recoil/atoms/towerMap";
import { inventoryState, currencyState } from "../recoil/atoms/inventory";
import { gameViewState } from "../recoil/atoms/game";
import { activePokemonIndexState } from "../recoil/atoms/active";
import { relicsState } from "../recoil/atoms/relics";
import { getRelicById } from "../utils/relics";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Card } from "../components/ui";
import { hasSaves, loadAutoSave } from "../utils/saveManager";
import SaveLoadUI from "../components/SaveLoadUI";
import TalentTree from "../components/TalentTree";
import StarterShop from "../components/StarterShop";
import AchievementsScreen from "../components/AchievementsScreen";
import RelicShopPage from "./RelicShopPage";
import { fetchStarterPokemon, getStarterInfo } from "../utils/getStarterPokemon";
import {
  getDifficultyLevels,
  setDifficulty,
  getMetaProgress,
  getRelicCollection
} from "../utils/metaProgression";
import {
  loadProgression,
  checkDailyLogin,
  getPlayerTitle,
  getXPForLevel,
  getTalentEffect,
  getAllTalentEffects,
} from "../utils/playerProgression";

export default function StarterScreen({ onStart }) {
  const setTeam = useSetRecoilState(teamState);
  const setFloor = useSetRecoilState(floorState);
  const setTowerMap = useSetRecoilState(towerMapState);
  const setInventory = useSetRecoilState(inventoryState);
  const setCurrency = useSetRecoilState(currencyState);
  const setCurrentNode = useSetRecoilState(currentNodeState);
  const setGameView = useSetRecoilState(gameViewState);
  const setActiveIndex = useSetRecoilState(activePokemonIndexState);
  const setRelics = useSetRecoilState(relicsState);

  const [isLoading, setIsLoading] = useState(true);
  const [showLoadUI, setShowLoadUI] = useState(false);
  const [showTalentTree, setShowTalentTree] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showRelicShop, setShowRelicShop] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  // Progression state
  const [progression, setProgression] = useState(null);
  const [metaProgress, setMetaProgress] = useState(null);

  // Difficulty
  const [difficulties, setDifficulties] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');

  // Starter selection
  const [selectedStarter, setSelectedStarter] = useState(null);
  const [starterPokemon, setStarterPokemon] = useState(null);
  const [loadingStarter, setLoadingStarter] = useState(false);

  // Load progression data
  useEffect(() => {
    const loadData = async () => {
      // Load and check daily login
      let prog = loadProgression();
      prog = checkDailyLogin(prog);
      setProgression(prog);

      // Load meta progress for achievements display
      const meta = getMetaProgress();
      setMetaProgress(meta);

      // Load difficulties
      const diffLevels = getDifficultyLevels();
      setDifficulties(diffLevels);
      setSelectedDifficulty(meta.selectedDifficulty || 'normal');

      // Check for saves
      setCanContinue(hasSaves() || !!loadAutoSave());

      setIsLoading(false);
    };
    loadData();
  }, []);

  // Reload progression when shop/talent tree closes
  useEffect(() => {
    if (!showTalentTree && !showShop) {
      setProgression(loadProgression());
    }
  }, [showTalentTree, showShop]);

  // Load starter Pokemon when selected
  useEffect(() => {
    if (selectedStarter) {
      setLoadingStarter(true);
      fetchStarterPokemon(selectedStarter).then(pokemon => {
        if (pokemon) {
          // Apply talent bonuses
          const effects = getAllTalentEffects(progression || loadProgression());
          const starterBonus = effects.starter_bonus || 0;
          const hpBonus = effects.hp_bonus || 0;

          if (starterBonus > 0 || hpBonus > 0) {
            pokemon.stats.hp = Math.floor(pokemon.stats.hp * (1 + starterBonus + hpBonus));
            pokemon.stats.hp_max = pokemon.stats.hp;
            pokemon.stats.attack = Math.floor(pokemon.stats.attack * (1 + starterBonus));
            pokemon.stats.defense = Math.floor(pokemon.stats.defense * (1 + starterBonus));
            pokemon.stats.special_attack = Math.floor(pokemon.stats.special_attack * (1 + starterBonus));
            pokemon.stats.special_defense = Math.floor(pokemon.stats.special_defense * (1 + starterBonus));
            pokemon.stats.speed = Math.floor(pokemon.stats.speed * (1 + starterBonus));
          }
        }
        setStarterPokemon(pokemon);
        setLoadingStarter(false);
      });
    }
  }, [selectedStarter, progression]);

  const handleSelectStarter = async () => {
    if (!starterPokemon) return;

    // Set difficulty
    setDifficulty(selectedDifficulty);

    // Apply starting gold from talents
    const effects = getAllTalentEffects(progression || loadProgression());
    const startingGold = effects.starting_gold || 0;

    if (startingGold > 0) {
      setCurrency(prev => prev + startingGold);
    }

    // Load equipped relics from localStorage for this run
    const relicCollection = getRelicCollection();
    if (relicCollection.equipped?.length > 0) {
      // Convert equipped relic IDs to full relic objects
      const equippedRelics = relicCollection.equipped
        .map(id => getRelicById(id))
        .filter(r => r); // Filter out any null relics

      setRelics(equippedRelics);
      console.log(`[StarterScreen] Loaded ${equippedRelics.length} equipped relics for run`);
    } else {
      setRelics([]); // Reset relics for new run
    }

    // Start with selected starter
    setTeam([starterPokemon]);
    setActiveIndex(0);
    onStart();
  };

  const handleContinue = () => {
    const autoSave = loadAutoSave();
    if (autoSave) {
      const { gameState } = autoSave;
      setTeam(gameState.team);
      setFloor(gameState.floor);
      setTowerMap(gameState.towerMap);
      setInventory(gameState.inventory);
      setCurrency(gameState.currency);
      setCurrentNode(gameState.currentNode);
      setGameView(gameState.gameView || 'map');
      setActiveIndex(0);
      onStart();
    } else {
      setShowLoadUI(true);
    }
  };

  const handleLoadComplete = () => {
    setShowLoadUI(false);
    setActiveIndex(0);
    onStart();
  };

  if (isLoading || !progression) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-16 h-16 border-4 border-gaming-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-white/80">Loading...</p>
        </motion.div>
      </div>
    );
  }

  const title = getPlayerTitle(progression.level);
  const xpForNext = getXPForLevel(progression.level + 1);
  const xpProgress = Math.min(progression.currentXP / xpForNext, 1);

  // Get unlocked starters from progression
  const unlockedStarters = progression.unlockedStarters || ['charizard', 'blastoise', 'venusaur'];

  return (
    <div className="min-h-screen relative overflow-hidden p-8 flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] bg-neon-violet/10 rounded-full blur-[120px]"
          style={{ top: '-20%', left: '-10%' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[100px]"
          style={{ bottom: '-10%', right: '-10%' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-grow flex flex-col">
        {/* Header with Player Info */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-7xl font-display font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-violet drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] tracking-tight">
              NEON BATTLE TOWER
            </h1>
            <p className="text-neon-cyan/60 text-xl font-display tracking-widest uppercase">Initiate Protocol: Starter Selection</p>
          </div>

          {/* Player Stats Bar */}
          <div className="glass-card p-4 border-neon-cyan/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Player Level */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-violet to-indigo-900 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(188,19,254,0.4)] border border-neon-violet/50">
                  {title.icon}
                </div>
                <div>
                  <div className="text-white font-display font-bold text-xl tracking-wide">{title.title}</div>
                  <div className="text-sm text-neon-cyan/60 font-mono">Level {progression.level}</div>
                  {/* XP Bar */}
                  <div className="w-48 h-2 bg-black/50 rounded-full mt-2 overflow-hidden border border-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Currency Display */}
              <div className="flex gap-6">
                <div className="flex items-center gap-3 bg-black/30 px-5 py-2.5 rounded-lg border border-neon-gold/30 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                  <span className="text-2xl">🪙</span>
                  <div>
                    <div className="text-neon-gold font-bold font-mono text-lg leading-none">{progression.towerTokens}</div>
                    <div className="text-neon-gold/50 text-[10px] uppercase tracking-wider">Tokens</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/30 px-5 py-2.5 rounded-lg border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                  <span className="text-2xl">💰</span>
                  <div>
                    <div className="text-yellow-400 font-bold font-mono text-lg leading-none">{progression.permanentGold}</div>
                    <div className="text-yellow-400/50 text-[10px] uppercase tracking-wider">Gold</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4 bg-black/20 p-2 rounded-lg border border-white/5">
                <div className="text-center px-4">
                  <div className="text-lg font-bold text-white font-mono">{progression.totalWins}</div>
                  <div className="text-[10px] text-neon-cyan/60 uppercase tracking-wider">Wins</div>
                </div>
                <div className="text-center px-4 border-l border-white/10">
                  <div className="text-lg font-bold text-white font-mono">{progression.totalRuns}</div>
                  <div className="text-[10px] text-neon-cyan/60 uppercase tracking-wider">Runs</div>
                </div>
                <div className="text-center px-4 border-l border-white/10">
                  <div className="text-lg font-bold text-white font-mono">{progression.highestFloorReached}</div>
                  <div className="text-[10px] text-neon-cyan/60 uppercase tracking-wider">Best Floor</div>
                </div>
                <div className="text-center px-4 border-l border-white/10">
                  <div className="text-lg font-bold text-neon-gold font-mono">{progression.loginStreak}</div>
                  <div className="text-[10px] text-neon-gold/60 uppercase tracking-wider">Streak</div>
                </div>
              </div>

              {/* Progression Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTalentTree(true)}
                  className="btn-neon px-4 py-2 flex items-center gap-2 text-sm"
                >
                  <span>✨</span> Talents
                </button>
                <button
                  onClick={() => setShowShop(true)}
                  className="btn-neon px-4 py-2 flex items-center gap-2 text-sm border-neon-gold text-neon-gold hover:bg-neon-gold/10 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                >
                  <span>🏪</span> Shop
                </button>
                <button
                  onClick={() => setShowAchievements(true)}
                  className="btn-neon px-4 py-2 flex items-center gap-2 text-sm border-neon-emerald text-neon-emerald hover:bg-neon-emerald/10 hover:shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                >
                  <span>🏆</span> Trophies
                </button>
                <button
                  onClick={() => setShowRelicShop(true)}
                  className="btn-neon px-4 py-2 flex items-center gap-2 text-sm border-neon-violet text-neon-violet hover:bg-neon-violet/10 hover:shadow-[0_0_15px_rgba(188,19,254,0.3)]"
                >
                  <span>💎</span> Relics
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
          {/* Left: Starter Selection */}
          <motion.div
            className="lg:col-span-8 flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 h-full flex flex-col border-neon-cyan/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
                  <span className="text-neon-cyan">►</span> SELECT STARTER UNIT
                </h2>
                <span className="text-neon-cyan/60 font-mono text-sm bg-neon-cyan/10 px-3 py-1 rounded border border-neon-cyan/20">
                  {unlockedStarters.length} UNLOCKED
                </span>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {unlockedStarters.map((starterId) => {
                  const info = getStarterInfo(starterId);
                  const isSelected = selectedStarter === starterId;

                  return (
                    <motion.button
                      key={starterId}
                      onClick={() => setSelectedStarter(starterId)}
                      className={`relative p-4 rounded-xl border transition-all group overflow-hidden ${
                        isSelected
                          ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-neon-cyan/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`text-4xl mb-2 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {info?.icon || '?'}
                      </div>
                      <div className={`font-display font-bold capitalize text-xs tracking-wider ${isSelected ? 'text-neon-cyan' : 'text-white/70'}`}>
                        {info?.name || starterId}
                      </div>

                      {isSelected && (
                        <motion.div
                          className="absolute top-2 right-2 w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_var(--accent-cyan)]"
                          layoutId="selectedIndicator"
                        />
                      )}
                    </motion.button>
                  );
                })}

                {/* Add more button */}
                <motion.button
                  onClick={() => setShowShop(true)}
                  className="p-4 rounded-xl border border-dashed border-white/20 bg-transparent hover:bg-white/5 transition-all flex flex-col items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-3xl mb-2 text-white/30 group-hover:text-neon-gold transition-colors">➕</div>
                  <div className="text-white/30 font-display font-bold text-xs tracking-wider group-hover:text-neon-gold transition-colors">UNLOCK</div>
                </motion.button>
              </div>

              {/* Starter Preview */}
              <div className="flex-grow relative rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                <div className="absolute inset-0 opacity-10" 
                  style={{ 
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} 
                />
                
                <AnimatePresence mode="wait">
                  {selectedStarter ? (
                    <motion.div
                      key={selectedStarter}
                      className="absolute inset-0 flex items-center justify-center p-8"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      {loadingStarter ? (
                        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                      ) : starterPokemon ? (
                        <div className="flex flex-col md:flex-row items-center gap-12 w-full max-w-3xl">
                          <motion.div 
                            className="relative"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="absolute inset-0 bg-neon-cyan/20 blur-[50px] rounded-full" />
                            <img
                              src={starterPokemon.sprite}
                              alt={starterPokemon.name}
                              className="w-64 h-64 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                            />
                          </motion.div>
                          
                          <div className="flex-1 space-y-6">
                            <div>
                              <h3 className="text-4xl font-display font-black text-white capitalize mb-3 text-glow">
                                {starterPokemon.name}
                              </h3>
                              <div className="flex gap-2">
                                {starterPokemon.types.map(type => (
                                  <span
                                    key={type}
                                    className="px-4 py-1 rounded text-sm font-bold text-white capitalize tracking-wider border border-white/20 shadow-lg"
                                    style={{ backgroundColor: getTypeColor(type) }}
                                  >
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(starterPokemon.stats).map(([stat, value]) => {
                                if (stat === 'hp_max' || stat === 'hp_prev') return null;
                                return (
                                  <div key={stat} className="bg-white/5 p-3 rounded border border-white/10 flex justify-between items-center">
                                    <span className="text-white/50 text-xs uppercase tracking-wider font-bold">
                                      {stat.replace('_', ' ')}
                                    </span>
                                    <span className="text-neon-cyan font-mono font-bold text-lg">{value}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                      <div className="text-6xl mb-4">⚡</div>
                      <p className="font-display text-xl tracking-widest">SELECT A UNIT TO PREVIEW</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* Right: Difficulty & Actions */}
          <motion.div
            className="lg:col-span-4 space-y-6 flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Difficulty Selection */}
            <Card className="p-6 border-neon-danger/20">
              <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-neon-danger">⚠️</span> THREAT LEVEL
              </h2>
              <div className="space-y-3">
                {difficulties.map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => diff.unlocked && setSelectedDifficulty(diff.id)}
                    disabled={!diff.unlocked}
                    className={`w-full p-4 rounded-xl border transition-all text-left relative overflow-hidden group ${
                      selectedDifficulty === diff.id
                        ? 'border-neon-danger bg-neon-danger/10'
                        : diff.unlocked
                        ? 'border-white/10 bg-white/5 hover:bg-white/10'
                        : 'border-white/5 bg-black/20 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{diff.icon}</span>
                        <div>
                          <div className={`font-display font-bold ${selectedDifficulty === diff.id ? 'text-neon-danger' : 'text-white'}`}>
                            {diff.name}
                          </div>
                          {diff.unlocked && (
                            <div className="text-[10px] text-white/50 font-mono mt-0.5">
                              GOLD: {diff.multipliers.gold}x | XP: {diff.multipliers.xp}x
                            </div>
                          )}
                        </div>
                      </div>
                      {!diff.unlocked && <span className="text-xl">🔒</span>}
                    </div>
                    
                    {selectedDifficulty === diff.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-danger/5 to-transparent pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Active Talent Effects */}
            {Object.keys(getAllTalentEffects(progression)).length > 0 && (
              <Card className="p-4 border-neon-violet/20 bg-neon-violet/5">
                <h3 className="text-sm font-display font-bold text-neon-violet mb-3 flex items-center gap-2">
                  <span>🧬</span> ACTIVE MUTATIONS
                </h3>
                <div className="space-y-2">
                  {Object.entries(getAllTalentEffects(progression)).map(([key, value]) => {
                    if (!value) return null;
                    return (
                      <div key={key} className="flex justify-between text-xs border-b border-white/5 pb-1 last:border-0">
                        <span className="text-white/60 uppercase tracking-wide">{key.replace(/_/g, ' ')}</span>
                        <span className="text-neon-cyan font-mono">
                          {key.includes('bonus') ? `+${Math.round(value * 100)}%` : `+${value}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="mt-auto space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full py-6 text-xl shadow-[0_0_30px_rgba(0,243,255,0.4)]"
                onClick={handleSelectStarter}
                disabled={!selectedStarter || loadingStarter}
              >
                {selectedStarter ? '🚀 LAUNCH MISSION' : 'SELECT UNIT'}
              </Button>

              {canContinue && (
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full border-neon-gold text-neon-gold hover:bg-neon-gold/10"
                  onClick={handleContinue}
                >
                  📂 RESUME MISSION
                </Button>
              )}

              <Button
                variant="secondary"
                className="w-full opacity-70 hover:opacity-100"
                onClick={() => setShowLoadUI(true)}
              >
                💾 LOAD DATA
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showLoadUI && (
          <SaveLoadUI
            mode="load"
            onClose={() => setShowLoadUI(false)}
            onLoadComplete={handleLoadComplete}
          />
        )}
        {showTalentTree && (
          <TalentTree onClose={() => setShowTalentTree(false)} />
        )}
        {showShop && (
          <StarterShop onClose={() => setShowShop(false)} />
        )}
        {showAchievements && (
          <AchievementsScreen onClose={() => setShowAchievements(false)} />
        )}
        {showRelicShop && (
          <RelicShopPage onClose={() => setShowRelicShop(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper function for type colors
function getTypeColor(type) {
  const colors = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
    grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#EE99AC'
  };
  return colors[type] || '#888888';
}
