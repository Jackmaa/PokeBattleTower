import HealthBar from "./HealthBar";
import typeColors from "../utils/typeColors";
import StatusEffectOverlay from "./effects/StatusEffectOverlay";
import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { getLevelDisplayInfo } from "../utils/pokemonLeveling";

function PokemonCard({
  poke,
  isEnemy,
  highlight,
  onSwitch,
  onRewardClick,
  mode = "default", // "default", "starter", "nvm_combat"
  isAttacking = false,
  isCurrentTurn = false, // For NvM combat - shows whose turn it is
  enemyIntent = null, // For showing enemy targeting { moveName, targetName }
}) {
  const [wasHit, setWasHit] = useState(false);
  const [spriteAnimation, setSpriteAnimation] = useState("idle");
  const isFainted = poke.stats.hp <= 0;
  const primaryType = poke.types?.[0]?.toLowerCase();
  const borderColor = typeColors[primaryType] || "#ccc";

  const handleClick = () => {
    if (onRewardClick) onRewardClick();
    else if (mode === "starter" && onSwitch) onSwitch();
  };

  // Handle hit animation
  useEffect(() => {
    if (poke.stats.hp < (poke.stats.hp_prev || poke.stats.hp_max)) {
      setWasHit(true);
      setSpriteAnimation("hurt");
      const timeout = setTimeout(() => {
        setWasHit(false);
        setSpriteAnimation("idle");
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [poke.stats.hp]);

  // Handle attack animation
  useEffect(() => {
    if (isAttacking) {
      setSpriteAnimation("attack");
      const timeout = setTimeout(() => {
        setSpriteAnimation("idle");
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isAttacking]);

  const isClickable = onRewardClick || mode === "starter";

  return (
    <motion.div
      className={`glass-card p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden h-full flex flex-col ${
        isClickable ? 'cursor-pointer' : ''
      } ${isFainted ? 'opacity-50 grayscale' : ''}`}
      style={{
        borderColor: borderColor,
        boxShadow: poke.isActive ? `0 0 20px ${borderColor}` : '0 4px 6px rgba(0,0,0,0.1)',
        minHeight: mode === 'starter' ? '360px' : '280px',
      }}
      onClick={isClickable ? handleClick : undefined}
      whileHover={isClickable && !isFainted ? { scale: 1.05, y: -5 } : {}}
      whileTap={isClickable && !isFainted ? { scale: 0.98 } : {}}
      animate={wasHit ? {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.3 }
      } : {}}
    >
      {/* Status Effect Overlay */}
      {poke.status && !isFainted && (
        <StatusEffectOverlay status={poke.status} isActive={true} />
      )}
      {/* Pokemon Image */}
      <div className="relative flex justify-center mb-1">
        <motion.img
          src={poke.sprite}
          alt={poke.name}
          className={`${mode === 'starter' ? 'w-24 h-24' : 'w-20 h-20'} object-contain ${isFainted ? 'rotate-90' : ''}`}
          initial={{ scale: 0 }}
          animate={
            isFainted
              ? { rotate: 90, scale: 1 }
              : spriteAnimation === "idle"
              ? {
                  y: [0, -3, 0],
                  scale: 1,
                  rotate: 0,
                  transition: {
                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  },
                }
              : spriteAnimation === "attack"
              ? {
                  x: [0, 15, -5, 0],
                  scale: [1, 1.1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 },
                }
              : spriteAnimation === "hurt"
              ? {
                  x: [0, -8, 8, -8, 8, 0],
                  scale: [1, 0.95, 0.95, 1],
                  filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                  transition: { duration: 0.3 },
                }
              : { scale: 1 }
          }
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        {/* Current Turn Indicator (NvM mode) */}
        {mode === "nvm_combat" && isCurrentTurn && !isFainted && (
          <motion.div
            className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <span className="text-xs">⚔️</span>
          </motion.div>
        )}
        {/* Legacy Active Indicator (non-NvM mode) */}
        {mode !== "nvm_combat" && poke.isActive && (
          <motion.div
            className="absolute -top-2 -right-2 bg-gaming-success rounded-full p-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <span className="text-xs">🟢</span>
          </motion.div>
        )}
      </div>

      {/* Pokemon Name & Level */}
      <div className="text-center mb-2">
        <h4 className="text-lg font-bold capitalize" style={{ color: borderColor }}>
          {poke.name}
        </h4>
        {poke.level && (
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-xs text-white/60">Lv. {poke.level}</div>
            {/* XP Bar */}
            {!poke.isEnemy && poke.xp !== undefined && (
              <div className="w-full max-w-[80px]">
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${getLevelDisplayInfo(poke).progress * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-[8px] text-white/40 text-center mt-0.5">
                  {getLevelDisplayInfo(poke).xpInLevel}/{getLevelDisplayInfo(poke).xpNeeded} XP
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Type Badges */}
      {poke.types && poke.types.length > 0 && (
        <div className="flex justify-center gap-1 mb-2">
          {poke.types.map((type, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
              style={{
                backgroundColor: typeColors[type.toLowerCase()] || '#999',
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {type}
            </span>
          ))}
        </div>
      )}

      {/* Health Bar */}
      <HealthBar current={poke.stats.hp} max={poke.stats.hp_max} />

      {/* Stats Grid - Enhanced */}
      <div className={`grid grid-cols-3 gap-1 mt-2 ${mode === 'starter' ? 'text-sm' : 'text-[10px]'} flex-grow`}>
        {/* Row 1: ATK, DEF, SPD */}
        <div className={`flex flex-col items-center p-1 rounded bg-red-500/10 border border-red-500/20 ${
          highlight?.index === poke.id && highlight?.stat === "attack" ? "ring-2 ring-red-400" : ""
        }`}>
          <span className="text-red-400">⚔️</span>
          <span className="font-bold text-white">{poke.stats.attack}</span>
        </div>
        <div className="flex flex-col items-center p-1 rounded bg-blue-500/10 border border-blue-500/20">
          <span className="text-blue-400">🛡️</span>
          <span className="font-bold text-white">{poke.stats.defense}</span>
        </div>
        <div className="flex flex-col items-center p-1 rounded bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-yellow-400">⚡</span>
          <span className="font-bold text-white">{poke.stats.speed}</span>
        </div>
        {/* Row 2: SPA, SPD */}
        <div className="flex flex-col items-center p-1 rounded bg-purple-500/10 border border-purple-500/20">
          <span className="text-purple-400">✨</span>
          <span className="font-bold text-white">{poke.stats.special_attack}</span>
        </div>
        <div className="flex flex-col items-center p-1 rounded bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-cyan-400">🔮</span>
          <span className="font-bold text-white">{poke.stats.special_defense}</span>
        </div>
        {/* Empty cell for balance or could show total */}
        <div className="flex flex-col items-center p-1 rounded bg-white/5 border border-white/10">
          <span className="text-white/40 text-[8px]">TOT</span>
          <span className="font-bold text-white/60 text-[9px]">
            {poke.stats.attack + poke.stats.defense + poke.stats.speed + poke.stats.special_attack + poke.stats.special_defense}
          </span>
        </div>
      </div>

      {/* Enemy Intent Display (NvM mode) */}
      {mode === "nvm_combat" && enemyIntent && !isFainted && (
        <motion.div
          className="mt-2 p-1.5 bg-red-900/50 rounded-lg border border-red-500/30 text-center"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] text-red-300">
            <span className="font-bold">{enemyIntent.moveName}</span>
            {enemyIntent.targetName && (
              <span className="text-red-400"> → {enemyIntent.targetName}</span>
            )}
          </p>
        </motion.div>
      )}

      {/* Switch Button - Hidden in NvM combat mode */}
      {mode !== "nvm_combat" && (
        <div className="mt-2" style={{ minHeight: mode === 'starter' ? '40px' : '32px' }}>
          {poke.stats.hp > 0 && !poke.isActive && onSwitch && mode !== "starter" && (
            <motion.button
              className="btn-primary w-full text-xs py-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onSwitch();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Switch
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default memo(PokemonCard);
