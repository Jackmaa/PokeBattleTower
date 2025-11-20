import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { teamState } from "../recoil/atoms/team";
import { getRandomPokemon } from "../utils/getRandomPokemon";
import { activePokemonIndexState } from "../recoil/atoms/active";
import PokemonCard from "../components/PokemonCard";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "../components/ui";

export default function StarterScreen({ onStart }) {
  const setTeam = useSetRecoilState(teamState);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const setActiveIndex = useSetRecoilState(activePokemonIndexState);

  useEffect(() => {
    const loadStarters = async () => {
      const starters = await Promise.all([
        getRandomPokemon(),
        getRandomPokemon(),
        getRandomPokemon(),
      ]);
      setOptions(starters);
      setIsLoading(false);
    };
    loadStarters();
  }, []);

  const selectStarter = (pokemon) => {
    setTeam([pokemon]);
    setActiveIndex(0);
    onStart();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-gaming-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xl text-white/80">Loading Starters...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-8">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gaming-accent/10 rounded-full blur-3xl"
          style={{ top: '10%', left: '10%' }}
          animate={{
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-gaming-accent-light/10 rounded-full blur-3xl"
          style={{ bottom: '10%', right: '10%' }}
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl w-full">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-glow bg-gradient-to-r from-gaming-accent via-gaming-accent-light to-gaming-accent bg-clip-text text-transparent drop-shadow-2xl">
              ⚔️ PokéBattle Tower 🗼
            </h1>
          </motion.div>

          <motion.div
            className="glass-card inline-block px-8 py-4 rounded-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl text-white font-semibold">
              Choose your Starter Pokémon
            </h2>
            <p className="text-white/70 mt-2">Begin your climb to the top!</p>
          </motion.div>
        </motion.div>

        {/* Pokemon Cards Grid */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          staggerDelay={0.15}
        >
          {options.map((poke) => (
            <StaggerItem key={poke.id}>
              <PokemonCard
                poke={poke}
                onSwitch={() => selectStarter(poke)}
                mode="starter"
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Instructions */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="glass-card inline-block px-6 py-3 rounded-xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(99, 102, 241, 0.3)",
                "0 0 30px rgba(99, 102, 241, 0.5)",
                "0 0 20px rgba(99, 102, 241, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <p className="text-white/80 text-lg flex items-center gap-2">
              <span className="text-2xl">👆</span>
              Click on a Pokémon to begin your journey
              <span className="text-2xl">✨</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
