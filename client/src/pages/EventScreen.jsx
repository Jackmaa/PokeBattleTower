// 📁 EventScreen.jsx
// Random event screen with choices - Slay the Spire style

import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { teamState } from '../recoil/atoms/team';
import { inventoryState, currencyState } from '../recoil/atoms/inventory';
import { highlightedStatState } from '../recoil/atoms/highlight';
import { floorState } from '../recoil/atoms/floor';
import { relicsState } from '../recoil/atoms/relics';
import { Button, Card } from '../components/ui';
import PokemonCard from '../components/PokemonCard';
import { RelicIcon } from '../components/RelicsPanel';
import { getChoiceEvent, canAffordChoice, processChoiceOutcome } from '../utils/events';
import { getRandomPokemon } from '../utils/getRandomPokemon';
import { getRandomRelic, RELIC_TIERS } from '../utils/relics';
import { getItemById } from '../utils/items';
import { useAudio } from '../hooks/useAudio';
import { discoverRelic } from '../utils/metaProgression';

export default function EventScreen({ onComplete }) {
  const [team, setTeam] = useRecoilState(teamState);
  const [inventory, setInventory] = useRecoilState(inventoryState);
  const [currency, setCurrency] = useRecoilState(currencyState);
  const [highlight, setHighlight] = useRecoilState(highlightedStatState);
  const [relics, setRelics] = useRecoilState(relicsState);
  const floor = useRecoilValue(floorState);

  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [outcomeMessages, setOutcomeMessages] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [newPokemon, setNewPokemon] = useState(null);
  const [newRelic, setNewRelic] = useState(null);
  const [showPokemonChoice, setShowPokemonChoice] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const { playHealSound, playLevelUpSound, playCatchSound, playMenuSelect, playDefeatSound } = useAudio();

  useEffect(() => {
    // Load random choice event based on floor
    const event = getChoiceEvent(floor);
    setCurrentEvent(event);
  }, [floor]);

  const applyOutcome = async (outcome) => {
    const messages = [];

    switch (outcome.type) {
      case 'heal_percent': {
        const healPercent = outcome.value;
        setTeam(prev => prev.map(poke => ({
          ...poke,
          stats: {
            ...poke.stats,
            hp: Math.min(poke.stats.hp_max, poke.stats.hp + Math.floor(poke.stats.hp_max * healPercent)),
          },
        })));
        playHealSound();
        messages.push(outcome.message);
        break;
      }

      case 'damage_percent': {
        const damagePercent = outcome.value;
        setTeam(prev => prev.map(poke => ({
          ...poke,
          stats: {
            ...poke.stats,
            hp: Math.max(1, poke.stats.hp - Math.floor(poke.stats.hp_max * damagePercent)),
          },
        })));
        playDefeatSound();
        messages.push(outcome.message);
        break;
      }

      case 'stat_boost': {
        const stats = ['attack', 'defense', 'special_attack', 'special_defense', 'speed'];
        const stat = outcome.stat === 'random' ? stats[Math.floor(Math.random() * stats.length)] : outcome.stat;
        const randomIndex = Math.floor(Math.random() * team.length);

        setTeam(prev => prev.map((poke, i) => i === randomIndex ? {
          ...poke,
          stats: { ...poke.stats, [stat]: poke.stats[stat] + outcome.value },
        } : poke));

        setHighlight({ index: randomIndex, stat });
        playLevelUpSound();
        setTimeout(() => setHighlight(null), 3000);
        messages.push(outcome.message);
        break;
      }

      case 'stat_boost_all': {
        const randomIndex = Math.floor(Math.random() * team.length);
        setTeam(prev => prev.map((poke, i) => i === randomIndex ? {
          ...poke,
          stats: {
            ...poke.stats,
            attack: poke.stats.attack + outcome.value,
            defense: poke.stats.defense + outcome.value,
            special_attack: poke.stats.special_attack + outcome.value,
            special_defense: poke.stats.special_defense + outcome.value,
            speed: poke.stats.speed + outcome.value,
          },
        } : poke));

        setHighlight({ index: randomIndex, stat: 'all' });
        playLevelUpSound();
        setTimeout(() => setHighlight(null), 3000);
        messages.push(outcome.message);
        break;
      }

      case 'stat_decrease': {
        const stats = ['attack', 'defense', 'special_attack', 'special_defense', 'speed'];
        const stat = outcome.stat === 'random' ? stats[Math.floor(Math.random() * stats.length)] : outcome.stat;
        const randomIndex = Math.floor(Math.random() * team.length);

        setTeam(prev => prev.map((poke, i) => i === randomIndex ? {
          ...poke,
          stats: { ...poke.stats, [stat]: Math.max(1, poke.stats[stat] - outcome.value) },
        } : poke));

        playDefeatSound();
        messages.push(outcome.message);
        break;
      }

      case 'gain_gold': {
        setCurrency(prev => prev + outcome.value);
        playCatchSound();
        messages.push(outcome.message);
        break;
      }

      case 'gain_relic': {
        const tier = outcome.tier === 'common' ? RELIC_TIERS.COMMON :
                     outcome.tier === 'uncommon' ? RELIC_TIERS.UNCOMMON :
                     outcome.tier === 'rare' ? RELIC_TIERS.RARE :
                     RELIC_TIERS.LEGENDARY;
        const relic = getRandomRelic(tier);
        if (relic) {
          setRelics(prev => [...prev, relic]);
          setNewRelic(relic);
          playLevelUpSound();

          // Persist relic discovery to localStorage
          discoverRelic(relic.id);
        }
        messages.push(outcome.message);
        break;
      }

      case 'gain_item': {
        // Map item IDs to actual items
        let itemId = outcome.itemId;
        if (itemId === 'random_common') {
          const commonItems = ['potion', 'ether', 'antidote'];
          itemId = commonItems[Math.floor(Math.random() * commonItems.length)];
        } else if (itemId === 'random_rare') {
          const rareItems = ['max_potion', 'full_restore', 'rare_candy'];
          itemId = rareItems[Math.floor(Math.random() * rareItems.length)];
        } else if (itemId === 'random_berry') {
          const berries = ['oran_berry', 'sitrus_berry', 'lum_berry'];
          itemId = berries[Math.floor(Math.random() * berries.length)];
        }

        setInventory(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        playCatchSound();
        messages.push(outcome.message);
        break;
      }

      case 'nothing':
      default:
        messages.push(outcome.message);
        break;
    }

    return messages;
  };

  const handleChoiceSelect = async (choice) => {
    if (isRevealing) return;

    playMenuSelect();
    setSelectedChoice(choice);

    // Check if player can afford the choice
    if (!canAffordChoice(choice, currency)) {
      return;
    }

    setIsRevealing(true);

    // Deduct cost if any
    if (choice.cost?.gold) {
      setCurrency(prev => prev - choice.cost.gold);
    }

    // Wait a bit for suspense
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get outcomes using the new system
    const outcomes = processChoiceOutcome(choice);

    // Apply all outcomes and collect messages
    const allMessages = [];
    for (const outcome of outcomes) {
      const msgs = await applyOutcome(outcome);
      allMessages.push(...msgs);
    }

    setOutcomeMessages(allMessages);
    setIsComplete(true);
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    }
  };

  if (!currentEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-white text-2xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading event...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gaming-darker via-gaming-dark to-gaming-darker p-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Currency Display */}
        <motion.div
          className="absolute top-4 right-4 px-4 py-2 bg-black/50 rounded-lg border border-yellow-500/30"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-yellow-400 font-bold text-lg">💰 {currency}</span>
        </motion.div>

        {/* Event Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {currentEvent.icon}
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            {currentEvent.title}
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {currentEvent.description}
          </p>
        </motion.div>

        {/* Choices */}
        {!isComplete && currentEvent.choices && (
          <motion.div
            className="space-y-4 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {currentEvent.choices.map((choice, index) => {
              const canAfford = canAffordChoice(choice, currency);
              const isSelected = selectedChoice?.id === choice.id;

              return (
                <motion.div
                  key={choice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={!isRevealing && canAfford ? { scale: 1.02, x: 10 } : {}}
                  whileTap={!isRevealing && canAfford ? { scale: 0.98 } : {}}
                >
                  <Card
                    className={`p-5 cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'border-gaming-accent bg-gaming-accent/20'
                        : canAfford
                          ? 'border-white/20 hover:border-gaming-accent/50'
                          : 'border-red-500/30 opacity-50'
                    }`}
                    clickable={!isRevealing && canAfford}
                    onClick={() => handleChoiceSelect(choice)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {choice.label}
                        </h3>
                        <p className="text-white/60 text-sm">{choice.description}</p>
                      </div>

                      {choice.cost?.gold && (
                        <div className={`ml-4 px-3 py-1 rounded-lg text-sm font-bold ${
                          canAfford
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          💰 {choice.cost.gold}
                        </div>
                      )}
                    </div>

                    {isSelected && isRevealing && (
                      <motion.div
                        className="mt-3 flex items-center justify-center gap-2 text-gaming-accent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          ⏳
                        </motion.span>
                        <span>Revealing fate...</span>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Outcome Display */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="p-6 border-2 border-gaming-accent">
                <h2 className="text-2xl font-bold text-gaming-accent mb-4 text-center">
                  Outcome
                </h2>

                <div className="space-y-3">
                  {outcomeMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.2 }}
                      className="p-3 bg-black/30 rounded-lg text-white/90 text-center"
                    >
                      {msg}
                    </motion.div>
                  ))}
                </div>

                {/* New Relic Display */}
                {newRelic && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 p-4 bg-gradient-to-r from-purple-900/50 to-purple-600/50 rounded-lg border border-purple-500/50"
                  >
                    <div className="text-center mb-2 text-purple-300 font-bold">New Relic Acquired!</div>
                    <div className="flex items-center justify-center gap-3">
                      <RelicIcon relic={newRelic} size="lg" />
                      <div>
                        <div className="font-bold text-white">{newRelic.name}</div>
                        <div className="text-sm text-white/70">{newRelic.description}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Display */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Your Team</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {team.map((poke, i) => (
                  <PokemonCard
                    key={poke.id}
                    poke={poke}
                    highlight={highlight}
                    mode="default"
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Continue Button */}
        {isComplete && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={handleContinue}
              className="btn-primary px-8 py-4 text-xl font-bold"
            >
              Continue to Map →
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
