// MoveCard.jsx
// Unified move card component with multiple variants

import { motion } from 'framer-motion';
import typeColors from '../../utils/typeColors';
import { useMoveDisplay } from '../../hooks/ui/useMoveDisplay';

/**
 * Unified MoveCard component
 *
 * Variants:
 * - 'default': Standard move display with full details
 * - 'compact': Smaller card with minimal info
 * - 'selectable': Interactive card for move selection
 * - 'upgrade': Card showing upgrade progression
 */
export default function MoveCard({
  move,
  variant = 'default',
  isSelected = false,
  onSelect,
  onClick,
  disabled = false,
  showNewBadge = false,
  showUpgradeInfo = false,
  className = '',
}) {
  const { typeColor, badges, styles, isAOE } = useMoveDisplay(move, {
    showEnhancedInfo: variant !== 'compact',
    showSkillLevel: true,
    showFused: true,
    showPP: variant !== 'compact',
  });

  const handleClick = () => {
    if (disabled) return;
    if (onSelect) onSelect();
    if (onClick) onClick();
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.button
        className={`w-full p-3 rounded-lg text-left transition-all ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        } ${
          isSelected
            ? 'ring-2 ring-purple-500 bg-purple-500/20'
            : 'bg-white/5 hover:bg-white/10'
        } ${className}`}
        onClick={handleClick}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        disabled={disabled}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="px-2 py-0.5 rounded text-xs font-bold uppercase"
            style={{ backgroundColor: typeColor, color: 'white' }}
          >
            {move.type}
          </div>
          <span className="font-bold text-white">{move.name}</span>
          {move.isFused && (
            <span className="text-xs px-1.5 py-0.5 bg-purple-500/30 text-purple-300 rounded">
              FUSED
            </span>
          )}
        </div>
        <div className="text-xs text-white/50">
          Power: {move.power || '-'} | Acc: {move.accuracy}% | {move.category}
        </div>
      </motion.button>
    );
  }

  // Default and selectable variants
  return (
    <motion.div
      onClick={handleClick}
      className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${
        isSelected ? 'ring-2 ring-gaming-accent ring-offset-2 ring-offset-black' : ''
      } ${className}`}
      style={{
        borderColor: isSelected ? '#3b82f6' : typeColor,
        backgroundColor: `${typeColor}20`,
      }}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* New Move Badge */}
      {showNewBadge && (
        <motion.div
          className="absolute -top-3 -right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          NEW!
        </motion.div>
      )}

      {/* Move Name */}
      <div className="mb-2">
        <h4 className="font-bold text-lg" style={{ color: typeColor }}>
          {move.name}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold uppercase"
            style={{ backgroundColor: typeColor, color: '#fff' }}
          >
            {move.type}
          </span>
          <span className="text-xs text-white/70 capitalize">
            {move.category}
          </span>
          {move.priority > 0 && (
            <span className="text-xs px-1.5 py-0.5 bg-yellow-500/30 border border-yellow-400/50 text-yellow-300 rounded font-bold">
              +{move.priority} Priority
            </span>
          )}
        </div>
      </div>

      {/* Effect Badges */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        {badges.map((badge, index) => (
          <span
            key={`${badge.type}-${index}`}
            className="px-1.5 py-0.5 text-[10px] font-bold rounded border"
            style={{
              backgroundColor: badge.color,
              borderColor: badge.border,
              color: badge.text,
            }}
          >
            {badge.label}
            {badge.type === 'effect' && move.effect?.percent && ` ${move.effect.percent}%`}
            {badge.type === 'status' && ` ${move.effect?.chance || 100}%`}
          </span>
        ))}
      </div>

      {/* Move Stats */}
      <div className="flex gap-3 text-sm">
        <span className="text-white/80">
          💥 <span className="font-bold">{move.power || '-'}</span>
        </span>
        <span className="text-white/80">
          🎯 <span className="font-bold">{move.accuracy}%</span>
        </span>
        <span className="text-white/80">
          PP: <span className="font-bold">{move.maxPP || move.pp}</span>
        </span>
      </div>

      {/* Description */}
      {move.description && (
        <p className="text-xs text-white/60 mt-2 line-clamp-2">
          {move.description}
        </p>
      )}

      {/* Upgrade Info */}
      {showUpgradeInfo && move.skillLevel > 0 && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="text-xs text-green-400">
            Level {move.skillLevel} bonuses active
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * MoveCard for displaying new moves in level up screen
 */
export function NewMoveCard({ move }) {
  return <MoveCard move={move} showNewBadge={true} variant="default" />;
}

/**
 * Compact MoveCard for move selection
 */
export function CompactMoveCard({ move, isSelected, onClick, disabled }) {
  return (
    <MoveCard
      move={move}
      variant="compact"
      isSelected={isSelected}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

/**
 * Selectable MoveCard for move learning/fusion
 */
export function SelectableMoveCard({ move, isSelected, onSelect, showNewBadge = false }) {
  return (
    <MoveCard
      move={move}
      variant="selectable"
      isSelected={isSelected}
      onSelect={onSelect}
      showNewBadge={showNewBadge}
    />
  );
}
