import HealthBar from "./HealthBar";
import typeColors from "../utils/typeColors";
import StatusEffectOverlay from "./effects/StatusEffectOverlay";
import { useEffect, useState, memo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getLevelDisplayInfo } from "../utils/pokemonLeveling";
import { useTemporaryState } from "../hooks/ui/useTemporaryState";

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
  isTargetable = false, // Can be targeted for attack
  isTargeted = false, // Currently selected as target
  onTarget = null, // Callback when clicked during targeting mode
}) {
  const [wasHit, setTemporaryHit] = useTemporaryState(false, 300);
  const [spriteAnimation, setSpriteAnimation] = useState("idle");
  const isFainted = poke.stats.hp <= 0;
  const primaryType = poke.types?.[0]?.toLowerCase();
  const borderColor = typeColors[primaryType] || "#ccc";
  
  // Holographic Tilt Logic
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    if (onTarget && isTargetable && !isFainted) {
      onTarget(poke.id);
    } else if (onRewardClick) {
      onRewardClick();
    } else if (mode === "starter" && onSwitch) {
      onSwitch();
    }
  };

  // Handle hit animation
  useEffect(() => {
    if (poke.stats.hp < (poke.stats.hp_prev || poke.stats.hp_max)) {
      setTemporaryHit(true);
      setSpriteAnimation("hurt");
      const timeout = setTimeout(() => {
        setSpriteAnimation("idle");
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [poke.stats.hp, setTemporaryHit]);

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

  const isClickable = onRewardClick || mode === "starter" || (isTargetable && !isFainted);

  // Determine card styling classes
  let targetingClasses = '';
  if (isTargeted) {
    targetingClasses = 'targeted-card';
  } else if (isTargetable && !isFainted) {
    targetingClasses = 'targetable-card';
  } else if (isTargetable && isFainted) {
    targetingClasses = 'non-targetable-card';
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={isClickable ? handleMouseMove : undefined}
      onMouseLeave={isClickable ? handleMouseLeave : undefined}
      style={{
        rotateX: isClickable ? rotateX : 0,
        rotateY: isClickable ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={`glass-card p-4 rounded-xl border transition-all duration-300 relative overflow-hidden h-full flex flex-col ${
        isClickable ? 'cursor-pointer hover:shadow-[0_0_30px_rgba(0,243,255,0.3)]' : ''
      } ${isFainted ? 'opacity-50 grayscale' : ''} ${targetingClasses}`}
      onClick={isClickable ? handleClick : undefined}
      animate={wasHit ? {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.3 }
      } : {}}
    >
      {/* Holographic Sheen */}
      {isClickable && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 z-10"
          style={{
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 25%, transparent 30%)',
            transform: 'translateZ(1px)',
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Rarity/Type Border Glow */}
      <div 
        className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
        style={{ boxShadow: `inset 0 0 20px ${borderColor}` }}
      />

      {/* Status Effect Overlay */}
      {poke.status && !isFainted && (
        <StatusEffectOverlay status={poke.status} isActive={true} />
      )}

      {/* Pokemon Image */}
      <div className="relative flex justify-center mb-2" style={{ transform: "translateZ(20px)" }}>
        <motion.img
          src={poke.sprite}
          alt={poke.name}
          className={`${mode === 'starter' ? 'w-32 h-32' : 'w-24 h-24'} object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${isFainted ? 'rotate-90' : ''}`}
          initial={{ scale: 0 }}
          animate={
            isFainted
              ? { rotate: 90, scale: 1 }
              : spriteAnimation === "idle"
              ? {
                  y: [0, -5, 0],
                  scale: 1,
                  rotate: 0,
                  transition: {
                    y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  },
                }
              : spriteAnimation === "attack"
              ? {
                  x: [0, 20, -5, 0],
                  scale: [1, 1.2, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                  transition: { duration: 0.5 },
                }
              : spriteAnimation === "hurt"
              ? {
                  x: [0, -8, 8, -8, 8, 0],
                  scale: [1, 0.95, 0.95, 1],
                  filter: ["brightness(1)", "brightness(2)", "brightness(1)"],
                  transition: { duration: 0.3 },
                }
              : { scale: 1 }
          }
        />
        
        {/* Current Turn Indicator (NvM mode) */}
        {mode === "nvm_combat" && isCurrentTurn && !isFainted && (
          <motion.div
            className="absolute -top-2 -right-2 bg-neon-gold rounded-full p-1 shadow-[0_0_10px_var(--accent-gold)]"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <span className="text-xs">⚔️</span>
          </motion.div>
        )}
      </div>

      {/* Pokemon Name & Level */}
      <div className="text-center mb-3 relative z-10" style={{ transform: "translateZ(10px)" }}>
        <h4 className="text-lg font-display font-bold capitalize tracking-wide text-glow" style={{ color: borderColor }}>
          {poke.name}
        </h4>
        {poke.level && (
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-white/80 font-mono">Lv. {poke.level}</div>
            {/* XP Bar */}
            {!poke.isEnemy && poke.xp !== undefined && (
              <div className="w-full max-w-[100px] relative h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-gold to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${getLevelDisplayInfo(poke).progress * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Type Badges */}
      {poke.types && poke.types.length > 0 && (
        <div className="flex justify-center gap-1.5 mb-3 relative z-10" style={{ transform: "translateZ(5px)" }}>
          {poke.types.map((type, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-sm"
              style={{
                backgroundColor: `${typeColors[type.toLowerCase()] || '#999'}80`, // 50% opacity
                color: 'white',
                backdropFilter: 'blur(4px)',
              }}
            >
              {type}
            </span>
          ))}
        </div>
      )}

      {/* Health Bar */}
      <div className="relative z-10 mb-3" style={{ transform: "translateZ(5px)" }}>
        <HealthBar current={poke.stats.hp} max={poke.stats.hp_max} />
      </div>

      {/* Stats Grid - Redesigned */}
      <div className={`grid grid-cols-3 gap-2 ${mode === 'starter' ? 'text-xs' : 'text-[10px]'} flex-grow relative z-10`} style={{ transform: "translateZ(5px)" }}>
        {/* Stat Item Helper */}
        {['attack', 'defense', 'speed', 'special_attack', 'special_defense'].map((stat) => {
          const icons = {
            attack: '⚔️', defense: '🛡️', speed: '⚡',
            special_attack: '✨', special_defense: '🔮'
          };
          const colors = {
            attack: 'text-red-400', defense: 'text-blue-400', speed: 'text-yellow-400',
            special_attack: 'text-purple-400', special_defense: 'text-cyan-400'
          };
          
          return (
            <div 
              key={stat}
              className={`flex flex-col items-center justify-center p-1.5 rounded bg-black/20 border border-white/5 ${
                highlight?.index === poke.id && highlight?.stat === stat ? "ring-1 ring-white shadow-[0_0_10px_white]" : ""
              }`}
            >
              <span className={`${colors[stat]} mb-0.5`}>{icons[stat]}</span>
              <span className="font-mono font-bold text-white">{poke.stats[stat]}</span>
            </div>
          );
        })}
        
        {/* Total Stats */}
        <div className="flex flex-col items-center justify-center p-1.5 rounded bg-white/5 border border-white/10">
          <span className="text-white/40 text-[8px] uppercase">Total</span>
          <span className="font-mono font-bold text-white/60">
            {poke.stats.attack + poke.stats.defense + poke.stats.speed + poke.stats.special_attack + poke.stats.special_defense}
          </span>
        </div>
      </div>

      {/* Enemy Intent Display (NvM mode) */}
      {mode === "nvm_combat" && enemyIntent && !isFainted && (
        <motion.div
          className="mt-2 p-1.5 bg-red-900/40 rounded border border-red-500/30 text-center relative z-10"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] text-red-300 font-mono">
            <span className="font-bold text-red-200">{enemyIntent.moveName}</span>
            {enemyIntent.targetName && (
              <span className="text-red-400"> ➜ {enemyIntent.targetName}</span>
            )}
          </p>
        </motion.div>
      )}

      {/* Switch Button */}
      {mode !== "nvm_combat" && (
        <div className="mt-2 relative z-20" style={{ minHeight: mode === 'starter' ? '40px' : '32px' }}>
          {poke.stats.hp > 0 && !poke.isActive && onSwitch && mode !== "starter" && (
            <motion.button
              className="btn-neon w-full text-xs py-1.5"
              onClick={(e) => {
                e.stopPropagation();
                onSwitch();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SWITCH
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default memo(PokemonCard);
