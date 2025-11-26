// 📁 EventScreen.jsx
// Random event screen with choices - Revamped with epic animations!

import { useState, useEffect, useRef } from 'react';
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
import { useOutcomeProcessor } from '../hooks/core/useOutcomeProcessor';
import { useTemporaryState } from '../hooks/ui/useTemporaryState';
import { discoverRelic } from '../utils/metaProgression';

// Particle effect component for ambient atmosphere
function ParticleField({ color = '#fbbf24', count = 20 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: `0 0 ${4 + Math.random() * 4}px ${color}`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 50, 0],
            x: [0, (Math.random() - 0.5) * 30, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function EventScreen({ onComplete }) {
  const [team, setTeam] = useRecoilState(teamState);
  const floor = useRecoilValue(floorState);
  const [currency, setCurrency] = useRecoilState(currencyState);

  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [outcomeMessages, setOutcomeMessages] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [newPokemon, setNewPokemon] = useState(null);
  const [newRelic, setNewRelic] = useState(null);
  const [showPokemonChoice, setShowPokemonChoice] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const { playMenuSelect } = useAudio();
  const [highlight, setTemporaryHighlight] = useTemporaryState(null, 3000);
  const { applyOutcome } = useOutcomeProcessor(setTeam, setTemporaryHighlight, setNewRelic);

  useEffect(() => {
    // Load random choice event based on floor
    const event = getChoiceEvent(floor);
    setCurrentEvent(event);
  }, [floor]);

  // applyOutcome is now provided by useOutcomeProcessor hook
  // Wrap it to pass the team array for stat-based outcomes
  const processOutcome = async (outcome) => {
    return await applyOutcome(outcome, team);
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
      const msgs = await processOutcome(outcome);
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

  // Get event-specific color theme
  const eventColors = {
    shrine: { primary: '#fbbf24', secondary: '#f59e0b', particle: '#fcd34d' },
    mysterious: { primary: '#8b5cf6', secondary: '#7c3aed', particle: '#a78bfa' },
    encounter: { primary: '#ef4444', secondary: '#dc2626', particle: '#f87171' },
    fortune: { primary: '#10b981', secondary: '#059669', particle: '#34d399' },
    default: { primary: '#3b82f6', secondary: '#2563eb', particle: '#60a5fa' },
  };

  const colors = currentEvent?.type
    ? (eventColors[currentEvent.type] || eventColors.default)
    : eventColors.default;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background based on event type */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Radial glow */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ backgroundColor: colors.primary }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Secondary glow */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px]"
          style={{ backgroundColor: colors.secondary }}
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      {/* Ambient particles */}
      <ParticleField color={colors.particle} count={30} />

      {/* Main content */}
      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Currency Display - Floating */}
          <motion.div
            className="fixed top-4 right-4 z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="px-4 py-2 bg-black/70 backdrop-blur-md rounded-xl border border-yellow-500/40 shadow-lg shadow-yellow-500/10">
              <span className="text-yellow-400 font-bold text-lg">💰 {currency}</span>
            </div>
          </motion.div>

          {/* Event Card */}
          <motion.div
            className="relative mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Event Icon - Floating above card */}
            <motion.div
              className="absolute -top-16 left-1/2 -translate-x-1/2 z-10"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                className="text-8xl md:text-9xl filter drop-shadow-2xl"
                style={{
                  filter: `drop-shadow(0 0 30px ${colors.primary})`,
                }}
              >
                {currentEvent.icon}
              </div>
            </motion.div>

            {/* Main Event Card */}
            <Card className="relative overflow-hidden bg-black/60 backdrop-blur-xl border-2 rounded-2xl pt-16 pb-8 px-6 md:px-10"
              style={{ borderColor: `${colors.primary}40` }}
            >
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: colors.primary }} />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 rounded-tr-2xl" style={{ borderColor: colors.primary }} />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 rounded-bl-2xl" style={{ borderColor: colors.primary }} />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: colors.primary }} />

              {/* Event Title */}
              <div className="text-center mb-8">
                <motion.h1
                  className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
                  style={{
                    color: colors.primary,
                    textShadow: `0 0 40px ${colors.primary}60`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentEvent.title}
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentEvent.description}
                </motion.p>
              </div>

              {/* Choices */}
              {!isComplete && currentEvent.choices && (
                <motion.div
                  className="space-y-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {currentEvent.choices.map((choice, index) => {
                    const canAfford = canAffordChoice(choice, currency);
                    const isSelected = selectedChoice?.id === choice.id;

                    return (
                      <motion.div
                        key={choice.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <motion.button
                          className={`w-full p-5 rounded-xl text-left transition-all duration-300 relative overflow-hidden group ${
                            !canAfford ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20)`
                              : 'rgba(255,255,255,0.05)',
                            border: `2px solid ${isSelected ? colors.primary : 'rgba(255,255,255,0.1)'}`,
                          }}
                          onClick={() => !isRevealing && canAfford && handleChoiceSelect(choice)}
                          whileHover={!isRevealing && canAfford ? {
                            scale: 1.02,
                            borderColor: colors.primary,
                          } : {}}
                          whileTap={!isRevealing && canAfford ? { scale: 0.98 } : {}}
                          disabled={isRevealing || !canAfford}
                        >
                          {/* Hover glow effect */}
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background: `radial-gradient(circle at center, ${colors.primary}10 0%, transparent 70%)`,
                            }}
                          />

                          <div className="relative flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                {choice.label}
                                {choice.risk === 'high' && <span className="text-red-400 text-sm">⚠️ Risky</span>}
                              </h3>
                              <p className="text-white/50 text-sm">{choice.description}</p>
                            </div>

                            {choice.cost?.gold && (
                              <div className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap ${
                                canAfford
                                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                💰 {choice.cost.gold}
                              </div>
                            )}
                          </div>

                          {/* Selection reveal animation */}
                          {isSelected && isRevealing && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center bg-black/60"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <motion.div
                                className="flex items-center gap-3 text-xl font-bold"
                                style={{ color: colors.primary }}
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                >
                                  ✨
                                </motion.div>
                                <span>Revealing fate...</span>
                              </motion.div>
                            </motion.div>
                          )}
                        </motion.button>
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
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6"
                  >
                    {/* Outcome header with divider */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}60)` }} />
                      <motion.h2
                        className="text-2xl font-bold px-4"
                        style={{ color: colors.primary }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        ✨ Outcome ✨
                      </motion.h2>
                      <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${colors.primary}60, transparent)` }} />
                    </div>

                    <div className="space-y-3">
                      {outcomeMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: i * 0.2, type: 'spring' }}
                          className="p-4 rounded-xl text-center text-lg font-medium"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}15, transparent)`,
                            border: `1px solid ${colors.primary}30`,
                          }}
                        >
                          {msg}
                        </motion.div>
                      ))}
                    </div>

                    {/* New Relic Display */}
                    {newRelic && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="mt-6 p-5 rounded-xl border"
                        style={{
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))',
                          borderColor: 'rgba(139, 92, 246, 0.5)',
                        }}
                      >
                        <motion.div
                          className="text-center mb-3 text-purple-300 font-bold text-xl"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          🎁 New Relic Acquired! 🎁
                        </motion.div>
                        <div className="flex items-center justify-center gap-4">
                          <RelicIcon relic={newRelic} size="lg" />
                          <div className="text-left">
                            <div className="font-bold text-white text-lg">{newRelic.name}</div>
                            <div className="text-sm text-white/70">{newRelic.description}</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* Team Display */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Card className="p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>Your Team</span>
                  <div className="flex-1 h-px bg-white/20" />
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {team.map((poke, i) => (
                    <motion.div
                      key={poke.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                    >
                      <PokemonCard
                        poke={poke}
                        highlight={highlight}
                        mode="default"
                      />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Continue Button */}
          {isComplete && (
            <motion.div
              className="flex justify-center mt-8 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                onClick={handleContinue}
                className="relative px-10 py-4 text-xl font-bold rounded-xl overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `0 0 30px ${colors.primary}40`,
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${colors.primary}60` }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 text-white drop-shadow-lg">Continue to Map →</span>
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                  style={{ opacity: 0.2 }}
                />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
