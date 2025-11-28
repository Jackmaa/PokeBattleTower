import { motion } from "framer-motion";
import { Card } from "../ui";
import { useState, useEffect, useMemo } from "react";
import { generateRandomRewards, getTierConfig, REWARD_TIERS } from "../../utils/rewards";
import { useRecoilValue } from "recoil";
import { floorState } from "../../recoil/atoms/floor";

export default function RewardScreen({ setPendingReward, onApplyReward }) {
  const [showConfetti, setShowConfetti] = useState(true);
  const floor = useRecoilValue(floorState);

  // Generate random confetti particles (only once)
  const confettiParticles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
    }))
  , []);

  // Generate random rewards based on floor level (only once when component mounts)
  const [rewards] = useState(() => {
    const generated = generateRandomRewards(3, floor);
    return generated.map(reward => ({
      ...reward,
      onClick: () => {
        if (reward.type === 'catch') {
          onApplyReward('catch', null, reward);
        } else {
          setPendingReward({ type: reward.type, data: reward });
        }
      },
    }));
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti Particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {confettiParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: '-5%',
                backgroundColor: particle.color,
              }}
              initial={{ y: -50, opacity: 1, rotate: 0 }}
              animate={{
                y: window.innerHeight + 50,
                opacity: [1, 1, 0],
                rotate: 360 * 3,
                x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeIn",
              }}
            />
          ))}
        </div>
      )}

      {/* Radial Glow Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        style={{
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="max-w-4xl w-full relative z-10"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
      >
        <Card className="p-8 relative overflow-hidden">
          {/* Animated Background Gradient */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                'linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)',
                'linear-gradient(45deg, #8b5cf6 0%, #ec4899 100%)',
                'linear-gradient(45deg, #ec4899 0%, #6366f1 100%)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* Victory Header */}
          <motion.div
            className="text-center mb-10 relative z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-8xl">🏆</span>
            </motion.div>
            <motion.h2
              className="text-6xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              VICTORY!
            </motion.h2>
            <p className="text-2xl text-white/90 font-semibold">Choose Your Reward</p>
          </motion.div>

          {/* Reward Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {rewards.map((reward, index) => {
              const tierConfig = getTierConfig(reward.tier);
              const isEpicOrLegendary = reward.tier === REWARD_TIERS.EPIC || reward.tier === REWARD_TIERS.LEGENDARY;
              const isLegendary = reward.tier === REWARD_TIERS.LEGENDARY;

              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.15,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  {/* Epic/Legendary Glow Ring */}
                  {isEpicOrLegendary && (
                    <motion.div
                      className="absolute -inset-1 rounded-xl z-0"
                      style={{
                        background: isLegendary
                          ? 'linear-gradient(45deg, #fbbf24, #f59e0b, #fbbf24, #fcd34d, #fbbf24)'
                          : 'linear-gradient(45deg, #a855f7, #7c3aed, #a855f7, #c084fc, #a855f7)',
                        backgroundSize: '300% 300%',
                      }}
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  <button
                    onClick={reward.onClick}
                    className={`relative w-full bg-gradient-to-br ${reward.color} rounded-xl p-6 text-white transition-all duration-300 border-2 ${reward.borderColor} overflow-hidden group z-10`}
                    style={{
                      boxShadow: `0 0 ${isLegendary ? '40px' : isEpicOrLegendary ? '30px' : '20px'} ${reward.glowColor}`,
                    }}
                  >
                    {/* Tier Badge */}
                    <div className="absolute top-2 right-2">
                      <motion.span
                        className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${tierConfig.textColor}`}
                        style={{
                          backgroundColor: isLegendary ? 'rgba(251, 191, 36, 0.3)' :
                            reward.tier === REWARD_TIERS.EPIC ? 'rgba(168, 85, 247, 0.3)' :
                            reward.tier === REWARD_TIERS.RARE ? 'rgba(59, 130, 246, 0.3)' :
                            reward.tier === REWARD_TIERS.UNCOMMON ? 'rgba(74, 222, 128, 0.3)' :
                            'rgba(156, 163, 175, 0.3)',
                          border: `1px solid ${isLegendary ? 'rgba(251, 191, 36, 0.5)' :
                            reward.tier === REWARD_TIERS.EPIC ? 'rgba(168, 85, 247, 0.5)' :
                            reward.tier === REWARD_TIERS.RARE ? 'rgba(59, 130, 246, 0.5)' :
                            reward.tier === REWARD_TIERS.UNCOMMON ? 'rgba(74, 222, 128, 0.5)' :
                            'rgba(156, 163, 175, 0.5)'}`,
                        }}
                        animate={isLegendary ? {
                          scale: [1, 1.05, 1],
                          boxShadow: ['0 0 5px rgba(251,191,36,0.5)', '0 0 15px rgba(251,191,36,0.8)', '0 0 5px rgba(251,191,36,0.5)'],
                        } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {tierConfig.label}
                      </motion.span>
                    </div>

                    {/* Shimmer Effect - faster for legendary */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        duration: isLegendary ? 1.2 : 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                        ease: "linear",
                      }}
                    />

                    {/* Legendary Sparkles */}
                    {isLegendary && (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
                            style={{
                              left: `${20 + i * 15}%`,
                              top: `${30 + (i % 3) * 20}%`,
                            }}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.3,
                            }}
                          />
                        ))}
                      </>
                    )}

                    {/* Icon */}
                    <motion.div
                      className="text-7xl mb-4"
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: isLegendary ? 2 : 3,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                    >
                      {reward.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className={`text-2xl font-bold mb-2 relative z-10 ${isLegendary ? 'text-yellow-100' : ''}`}>
                      {reward.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/90 text-sm relative z-10">
                      {reward.description}
                    </p>

                    {/* Hover Glow */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${reward.glowColor}, transparent 70%)`,
                      }}
                    />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Tip */}
          <motion.p
            className="text-center text-white/50 text-sm mt-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            💡 Tip: Choose wisely! Each reward can turn the tide of battle.
          </motion.p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
