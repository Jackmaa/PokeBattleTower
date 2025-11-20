// 📁 RestScreen.jsx
// Rest/Heal screen - Restore team HP at a heal node

import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import { teamState } from '../recoil/atoms/team';
import { Button, Card } from '../components/ui';
import PokemonCard from '../components/PokemonCard';

export default function RestScreen({ onComplete }) {
  const [team, setTeam] = useRecoilState(teamState);
  const [isHealing, setIsHealing] = useState(false);
  const [hasHealed, setHasHealed] = useState(false);

  // Reset state when component mounts (in case user visits multiple rest nodes)
  useEffect(() => {
    console.log('[RestScreen] Mounted - resetting heal states');
    console.log('[RestScreen] Team on mount:', team);
    setIsHealing(false);
    setHasHealed(false);
  }, []);

  // Check if team is already at full HP
  const isTeamFullHP = team.every(pokemon => pokemon.stats.hp === pokemon.stats.hp_max);

  // Check if team needs PP restoration
  const needsPPRestore = team.some(pokemon =>
    pokemon.moves?.some(move => move.pp < move.maxPP)
  );

  console.log('[RestScreen] Render - isHealing:', isHealing, 'hasHealed:', hasHealed);
  console.log('[RestScreen] isTeamFullHP:', isTeamFullHP, 'needsPPRestore:', needsPPRestore);

  const handleHeal = () => {
    console.log('[RestScreen] ========== HEAL BUTTON CLICKED ==========');
    console.log('[RestScreen] Starting heal...');
    console.log('[RestScreen] Current team:', team);
    console.log('[RestScreen] isHealing before:', isHealing);
    console.log('[RestScreen] hasHealed before:', hasHealed);
    setIsHealing(true);

    // Heal all Pokémon to full HP after a short delay
    setTimeout(() => {
      const healedTeam = team.map(pokemon => ({
        ...pokemon,
        stats: {
          ...pokemon.stats,
          hp: pokemon.stats.hp_max,
        },
        // Also restore PP to all moves
        moves: pokemon.moves?.map(move => ({
          ...move,
          pp: move.maxPP,
        })) || [],
      }));

      console.log('[RestScreen] Healed team:', healedTeam);
      setTeam(healedTeam);
      setIsHealing(false);
      setHasHealed(true);
    }, 2000);
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gaming-darker via-gaming-dark to-gaming-darker p-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            💊
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Rest Area
          </h1>
          <p className="text-xl text-white/70">
            {hasHealed
              ? "Your team is fully restored!"
              : isTeamFullHP && !needsPPRestore
              ? "Your team is already in perfect condition!"
              : isTeamFullHP
              ? "Your HP is full, but some moves need PP restoration"
              : "Take a moment to heal your team"}
          </p>
        </motion.div>

        {/* Team Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            {/* Team Status Summary */}
            <div className="mb-4 text-center">
              <p className="text-white/80">
                Team HP: {team.reduce((sum, p) => sum + p.stats.hp, 0)} / {team.reduce((sum, p) => sum + p.stats.hp_max, 0)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map((pokemon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <PokemonCard poke={pokemon} mode="display" />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {!hasHealed ? (
            <>
              <Button
                variant="primary"
                size="lg"
                onClick={handleHeal}
                disabled={isHealing}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
              >
                {isHealing ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >
                      ✨
                    </motion.span>
                    Healing...
                  </>
                ) : isTeamFullHP && !needsPPRestore ? (
                  <>✨ Rest Anyway</>
                ) : (
                  <>💊 Heal Team</>
                )}
              </Button>

              {/* Skip button if team is already perfect */}
              {isTeamFullHP && !needsPPRestore && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleContinue}
                  disabled={isHealing}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                >
                  Skip Rest →
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            >
              Continue to Map →
            </Button>
          )}
        </motion.div>

        {/* Healing Animation Overlay */}
        {isHealing && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-9xl"
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
            >
              ✨
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
