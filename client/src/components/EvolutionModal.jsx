import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui';
import { useMultiStageModal } from '../hooks/ui/useMultiStageModal';

export default function EvolutionModal({ oldPokemon, newPokemon, onComplete }) {
  const { currentStage } = useMultiStageModal({
    stages: ['intro', 'evolving', 'evolved'],
    timings: {
      intro: 2000,
      evolving: 3000,
    },
  });

  const [showStats, setShowStats] = useState(false);

  // Show stats when we reach evolved stage
  React.useEffect(() => {
    if (currentStage === 'evolved') {
      setShowStats(true);
    }
  }, [currentStage]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl p-8 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {currentStage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-8">What?</h2>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <img 
                  src={oldPokemon.sprite} 
                  alt={oldPokemon.name} 
                  className="w-48 h-48 object-contain mx-auto filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                />
              </motion.div>
              <p className="text-xl text-white mt-8">
                {oldPokemon.name} is evolving!
              </p>
            </motion.div>
          )}

          {currentStage === 'evolving' && (
            <motion.div
              key="evolving"
              className="relative flex items-center justify-center"
            >
              {/* Evolution Animation */}
              <motion.div
                className="absolute inset-0 bg-white rounded-full blur-3xl"
                animate={{ 
                  scale: [0.5, 2, 0.5],
                  opacity: [0.2, 0.8, 0.2] 
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
              
              {/* Silhouettes switching */}
              <motion.img
                src={oldPokemon.sprite}
                className="w-48 h-48 object-contain relative z-10 brightness-0 invert"
                animate={{ opacity: [1, 0], scale: [1, 0.5] }}
                transition={{ duration: 1.5 }}
              />
              <motion.img
                src={newPokemon.sprite}
                className="w-64 h-64 object-contain absolute z-10 brightness-0 invert"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1], scale: [0.5, 1] }}
                transition={{ delay: 1.5, duration: 1.5 }}
              />
            </motion.div>
          )}

          {currentStage === 'evolved' && (
            <motion.div
              key="evolved"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-8">
                Congratulations!
              </h2>
              
              <div className="relative mb-8">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-3xl rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <img 
                  src={newPokemon.sprite} 
                  alt={newPokemon.name} 
                  className="w-64 h-64 object-contain mx-auto relative z-10 filter drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]"
                />
              </div>

              <p className="text-2xl text-white mb-8">
                Your <span className="font-bold text-gray-400">{oldPokemon.name}</span> evolved into <span className="font-bold text-yellow-400">{newPokemon.name}</span>!
              </p>

              {showStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card p-6 max-w-md mx-auto mb-8"
                >
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Stat Changes</h3>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    {Object.entries(newPokemon.stats).map(([stat, value]) => {
                      if (stat === 'hp_prev' || stat === 'hp') return null;
                      const oldVal = oldPokemon.stats[stat];
                      const diff = value - oldVal;
                      return (
                        <div key={stat} className="flex justify-between items-center">
                          <span className="text-gray-400 capitalize">{stat.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-mono">{oldVal}</span>
                            <span className="text-gray-600">→</span>
                            <span className="text-green-400 font-bold font-mono">{value}</span>
                            {diff > 0 && <span className="text-xs text-green-500">(+{diff})</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              <Button 
                variant="primary" 
                onClick={onComplete}
                className="w-full max-w-xs mx-auto text-lg py-3"
              >
                Continue Adventure
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
