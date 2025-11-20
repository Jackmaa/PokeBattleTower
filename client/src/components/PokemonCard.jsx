import HealthBar from "./HealthBar";
import typeColors from "../utils/typeColors";
import StatusEffectOverlay from "./effects/StatusEffectOverlay";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function PokemonCard({
  poke,
  isEnemy,
  highlight,
  onSwitch,
  onRewardClick,
  mode = "default",
  isAttacking = false,
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
        {poke.isActive && (
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
          <div className="text-xs text-white/60">Lv. {poke.level}</div>
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

      {/* Stats Grid */}
      <div className={`grid grid-cols-2 gap-1 mt-2 ${mode === 'starter' ? 'text-sm' : 'text-xs'} flex-grow`}>
        <p className={`${
          highlight?.index === poke.id && highlight?.stat === "attack"
            ? "highlight"
            : ""
        }`}>
          <span className="text-white/60">ATK:</span> <span className="font-semibold">{poke.stats.attack}</span>
        </p>
        <p>
          <span className="text-white/60">DEF:</span> <span className="font-semibold">{poke.stats.defense}</span>
        </p>
        <p>
          <span className="text-white/60">SPD:</span> <span className="font-semibold">{poke.stats.speed}</span>
        </p>
        <p>
          <span className="text-white/60">SPA:</span> <span className="font-semibold">{poke.stats.special_attack}</span>
        </p>
        <p className="col-span-2 text-center">
          <span className="text-white/60">SPD:</span> <span className="font-semibold">{poke.stats.special_defense}</span>
        </p>
      </div>

      {/* Switch Button - Fixed height to maintain card size */}
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
    </motion.div>
  );
}

export default PokemonCard;
