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
    <div className="min-h-screen relative overflow-hidden p-8">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gaming-accent/10 rounded-full blur-3xl"
          style={{ top: '10%', left: '10%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          style={{ bottom: '10%', right: '10%' }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Player Info */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
              PokeBattle Tower
            </h1>
            <p className="text-white/70 text-lg">Choose your starter and begin your journey</p>
          </div>

          {/* Player Stats Bar */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Player Level */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl">
                  {title.icon}
                </div>
                <div>
                  <div className="text-white font-bold">{title.title}</div>
                  <div className="text-sm text-gray-400">Level {progression.level}</div>
                  {/* XP Bar */}
                  <div className="w-32 h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Currency Display */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-lg border border-amber-500/30">
                  <span className="text-xl">🪙</span>
                  <span className="text-amber-300 font-bold">{progression.towerTokens}</span>
                  <span className="text-amber-400/70 text-sm">Tokens</span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30">
                  <span className="text-xl">💰</span>
                  <span className="text-yellow-300 font-bold">{progression.permanentGold}</span>
                  <span className="text-yellow-400/70 text-sm">Gold</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-3">
                <div className="text-center px-3">
                  <div className="text-lg font-bold text-white">{progression.totalWins}</div>
                  <div className="text-xs text-gray-400">Wins</div>
                </div>
                <div className="text-center px-3 border-l border-gray-600">
                  <div className="text-lg font-bold text-white">{progression.totalRuns}</div>
                  <div className="text-xs text-gray-400">Runs</div>
                </div>
                <div className="text-center px-3 border-l border-gray-600">
                  <div className="text-lg font-bold text-white">{progression.highestFloorReached}</div>
                  <div className="text-xs text-gray-400">Best Floor</div>
                </div>
                <div className="text-center px-3 border-l border-gray-600">
                  <div className="text-lg font-bold text-amber-400">{progression.loginStreak}</div>
                  <div className="text-xs text-gray-400">Day Streak</div>
                </div>
              </div>

              {/* Progression Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTalentTree(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span>✨</span> Talents
                </button>
                <button
                  onClick={() => setShowShop(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span>🏪</span> Shop
                </button>
                <button
                  onClick={() => setShowAchievements(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span>🏆</span> Achievements
                </button>
                <button
                  onClick={() => setShowRelicShop(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span>💎</span> Relics
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Starter Selection */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Choose Your Starter</h2>
                <span className="text-gray-400 text-sm">
                  {unlockedStarters.length} unlocked
                </span>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {unlockedStarters.map((starterId) => {
                  const info = getStarterInfo(starterId);
                  const isSelected = selectedStarter === starterId;

                  return (
                    <motion.button
                      key={starterId}
                      onClick={() => setSelectedStarter(starterId)}
                      className={`relative p-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-gaming-accent bg-gaming-accent/20 shadow-lg shadow-gaming-accent/30'
                          : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-3xl mb-1">{info?.icon || '?'}</div>
                      <div className="text-white font-bold capitalize text-sm">{info?.name || starterId}</div>

                      {isSelected && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 bg-gaming-accent rounded-full flex items-center justify-center text-xs"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}

                {/* Add more button */}
                <motion.button
                  onClick={() => setShowShop(true)}
                  className="p-3 rounded-xl border-2 border-dashed border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-3xl mb-1">➕</div>
                  <div className="text-amber-400 font-bold text-sm">More</div>
                </motion.button>
              </div>

              {/* Starter Preview */}
              <AnimatePresence mode="wait">
                {selectedStarter && (
                  <motion.div
                    key={selectedStarter}
                    className="mt-6 p-4 bg-gradient-to-r from-gaming-accent/20 to-purple-500/20 rounded-xl border border-gaming-accent/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {loadingStarter ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-8 h-8 border-2 border-gaming-accent border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : starterPokemon ? (
                      <div className="flex items-center gap-6">
                        <img
                          src={starterPokemon.sprite}
                          alt={starterPokemon.name}
                          className="w-32 h-32 object-contain"
                        />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white capitalize mb-2">
                            {starterPokemon.name}
                          </h3>
                          <div className="flex gap-2 mb-3">
                            {starterPokemon.types.map(type => (
                              <span
                                key={type}
                                className="px-3 py-1 rounded-full text-sm font-bold text-white capitalize"
                                style={{ backgroundColor: getTypeColor(type) }}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-white/70">HP: <span className="text-white font-bold">{starterPokemon.stats.hp}</span></div>
                            <div className="text-white/70">ATK: <span className="text-white font-bold">{starterPokemon.stats.attack}</span></div>
                            <div className="text-white/70">DEF: <span className="text-white font-bold">{starterPokemon.stats.defense}</span></div>
                            <div className="text-white/70">SP.ATK: <span className="text-white font-bold">{starterPokemon.stats.special_attack}</span></div>
                            <div className="text-white/70">SP.DEF: <span className="text-white font-bold">{starterPokemon.stats.special_defense}</span></div>
                            <div className="text-white/70">SPD: <span className="text-white font-bold">{starterPokemon.stats.speed}</span></div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Right: Difficulty & Actions */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Difficulty Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Difficulty</h2>
              <div className="space-y-2">
                {difficulties.map(diff => (
                  <button
                    key={diff.id}
                    onClick={() => diff.unlocked && setSelectedDifficulty(diff.id)}
                    disabled={!diff.unlocked}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      selectedDifficulty === diff.id
                        ? 'border-gaming-accent bg-gaming-accent/20'
                        : diff.unlocked
                        ? 'border-white/20 bg-white/5 hover:bg-white/10'
                        : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{diff.icon}</span>
                        <span className="font-bold text-white">{diff.name}</span>
                      </div>
                      {!diff.unlocked && <span className="text-xl">🔒</span>}
                    </div>
                    {diff.unlocked && (
                      <div className="text-xs text-white/60 mt-1">
                        Gold: {diff.multipliers.gold}x | XP: {diff.multipliers.xp}x
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleSelectStarter}
                  disabled={!selectedStarter || loadingStarter}
                >
                  {selectedStarter ? '🚀 Start Adventure' : 'Select a Starter'}
                </Button>

                {canContinue && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={handleContinue}
                  >
                    📂 Continue
                  </Button>
                )}

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setShowLoadUI(true)}
                >
                  💾 Load Game
                </Button>
              </div>
            </Card>

            {/* Active Talent Effects */}
            {Object.keys(getAllTalentEffects(progression)).length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-bold text-purple-400 mb-2">Active Bonuses</h3>
                <div className="space-y-1 text-xs">
                  {getAllTalentEffects(progression).attack_bonus && (
                    <div className="text-gray-300">+{Math.round(getAllTalentEffects(progression).attack_bonus * 100)}% Attack</div>
                  )}
                  {getAllTalentEffects(progression).defense_bonus && (
                    <div className="text-gray-300">+{Math.round(getAllTalentEffects(progression).defense_bonus * 100)}% Defense</div>
                  )}
                  {getAllTalentEffects(progression).hp_bonus && (
                    <div className="text-gray-300">+{Math.round(getAllTalentEffects(progression).hp_bonus * 100)}% HP</div>
                  )}
                  {getAllTalentEffects(progression).gold_bonus && (
                    <div className="text-gray-300">+{Math.round(getAllTalentEffects(progression).gold_bonus * 100)}% Gold</div>
                  )}
                  {getAllTalentEffects(progression).xp_bonus && (
                    <div className="text-gray-300">+{Math.round(getAllTalentEffects(progression).xp_bonus * 100)}% XP</div>
                  )}
                  {getAllTalentEffects(progression).starting_gold && (
                    <div className="text-gray-300">+{getAllTalentEffects(progression).starting_gold} Starting Gold</div>
                  )}
                </div>
              </Card>
            )}
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
