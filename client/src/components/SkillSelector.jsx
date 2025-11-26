// 📁 SkillSelector.jsx
// Trainer skill selection UI for battle

import { motion } from "framer-motion";
import { Card } from "./ui";
import { TRAINER_SKILLS } from "../utils/playerProgression";
import useKeyboardNavigation from "../hooks/useKeyboardNavigation";
import { keybindManager, getGridNumber } from "../utils/keybindConfig";
import FocusIndicator from "./keyboard/FocusIndicator";

export default function SkillSelector({
  unlockedSkills = [],
  cooldowns = {},
  activeEffects = {},
  onUseSkill,
  disabled = false,
  onBack = null
}) {
  if (!unlockedSkills || unlockedSkills.length === 0) {
    return (
      <Card className="p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-white/60">No skills unlocked yet.</p>
          <p className="text-white/40 text-sm mt-2">
            Unlock skills in the Talent Tree!
          </p>
        </div>
      </Card>
    );
  }

  // Configuration de la navigation clavier
  const {
    selectedIndex,
    isKeyboardFocused,
    getItemProps,
  } = useKeyboardNavigation({
    items: unlockedSkills,
    enabled: !disabled && keybindManager.isEnabled(),
    layout: 'grid',
    columns: 2,
    onSelect: (skillId, index) => {
      const cooldown = cooldowns[skillId] || 0;
      const isOnCooldown = cooldown > 0;
      if (!isOnCooldown && !disabled) {
        onUseSkill(skillId);
      }
    },
    onCancel: onBack,
    enableNumberKeys: true,
    loop: true,
    isItemDisabled: (skillId) => (cooldowns[skillId] || 0) > 0,
  });

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        {onBack && (
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-neon-cyan hover:text-white transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl">←</span>
            <span className="font-display text-sm uppercase tracking-wider">Back</span>
          </motion.button>
        )}
        <h3 className={`text-xl font-bold text-gaming-accent ${onBack ? '' : 'text-center w-full'}`}>
          ✨ Trainer Skills
        </h3>
        {onBack && <div className="w-20" />} {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {unlockedSkills.map((skillId, index) => {
          const skill = TRAINER_SKILLS[skillId];
          if (!skill) return null;

          const cooldown = cooldowns[skillId] || 0;
          const isOnCooldown = cooldown > 0;
          const isActive = activeEffects[skillId] !== undefined;
          const isDisabled = isOnCooldown || disabled;
          const isSelected = index === selectedIndex && isKeyboardFocused;
          const keyNumber = getGridNumber(index);

          // Skill type colors
          const getSkillColor = () => {
            if (skill.effect.type === 'heal') return { bg: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' };
            if (skill.effect.type === 'buff') return { bg: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' };
            if (skill.effect.type === 'cure_status') return { bg: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' };
            return { bg: '#06b6d4', glow: 'rgba(6, 182, 212, 0.3)' };
          };

          const colors = getSkillColor();

          return (
            <FocusIndicator key={skillId} isVisible={isSelected && !isOnCooldown} color="purple" animated>
              <motion.button
                {...getItemProps(index)}
                onClick={() => !isDisabled && onUseSkill(skillId)}
                disabled={isDisabled}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed bg-gray-700/30"
                    : "hover:scale-105 cursor-pointer"
                }`}
                style={{
                  borderColor: isActive ? colors.bg : isDisabled ? '#4b5563' : colors.bg + '80',
                  backgroundColor: isActive ? colors.glow : 'rgba(0, 0, 0, 0.3)',
                  boxShadow: isActive ? `0 0 20px ${colors.glow}` : 'none',
                }}
                whileHover={!isDisabled ? { y: -3 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
            >
              {/* Indicateur de touche numérique */}
              {!isOnCooldown && (
                <div className="absolute top-1 left-1 text-xs opacity-50 font-mono bg-black/50 px-1.5 py-0.5 rounded z-10">
                  {keyNumber}
                </div>
              )}

              {/* Skill Icon & Name */}
              <div className="text-left mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{skill.icon}</span>
                  <h4
                    className="font-bold text-lg"
                    style={{ color: isDisabled ? '#9ca3af' : colors.bg }}
                  >
                    {skill.name}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-xs text-white/70 leading-tight">
                  {skill.description}
                </p>
              </div>

              {/* Cooldown Info */}
              <div className="mt-3 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/70">Cooldown</span>
                  <span className={`font-mono font-bold ${isOnCooldown ? 'text-red-400' : 'text-green-400'}`}>
                    {isOnCooldown ? `${cooldown} floor${cooldown > 1 ? 's' : ''}` : 'READY'}
                  </span>
                </div>

                {/* Cooldown bar */}
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: isOnCooldown
                        ? "linear-gradient(90deg, #ef4444, #dc2626)"
                        : "linear-gradient(90deg, #10b981, #059669)",
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: isOnCooldown
                        ? `${((skill.cooldown - cooldown) / skill.cooldown) * 100}%`
                        : '100%'
                    }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </div>
              </div>

              {/* Active Effect Badge */}
              {isActive && (
                <div className="absolute -top-2 -right-2 z-10">
                  <motion.div
                    className="px-2 py-1 rounded-full text-xs font-bold shadow-lg"
                    style={{
                      backgroundColor: colors.bg,
                      color: '#fff',
                    }}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        `0 0 0px ${colors.bg}`,
                        `0 0 15px ${colors.glow}`,
                        `0 0 0px ${colors.bg}`
                      ]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  >
                    ACTIVE
                  </motion.div>
                </div>
              )}

              {/* On Cooldown Overlay */}
              {isOnCooldown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
                  <div className="text-center">
                    <span className="text-red-400 font-bold text-sm block">
                      ON COOLDOWN
                    </span>
                    <span className="text-white/60 text-xs">
                      {cooldown} floor{cooldown > 1 ? 's' : ''} remaining
                    </span>
                  </div>
                </div>
              )}

              {/* Ready Glow */}
              {!isOnCooldown && !disabled && (
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  style={{
                    boxShadow: `0 0 15px ${colors.glow}`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />
              )}
              </motion.button>
            </FocusIndicator>
          );
        })}
      </div>

      {disabled && (
        <p className="text-center text-white/60 text-sm mt-4">
          Battle in progress...
        </p>
      )}

      <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/10">
        <p className="text-xs text-white/60 text-center">
          💡 Skills are <span className="text-neon-cyan font-bold">free actions</span> - you can still attack after using one!
        </p>
      </div>
    </Card>
  );
}
