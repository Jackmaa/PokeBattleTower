import { motion } from 'framer-motion';
import { STACKABLE_STATUSES, MAX_STATUS_STACKS } from '../../utils/statusEffects';

/**
 * StatusIndicator component for displaying battle status effects
 * Now supports STACKABLE statuses (burn, poison, freeze)!
 *
 * @param {Object} props
 * @param {'poison'|'poisoned'|'paralysis'|'paralyzed'|'burn'|'burned'|'freeze'|'frozen'|'sleep'|'asleep'|'confused'} props.status - Status type
 * @param {number} props.stacks - Number of stacks (for stackable statuses)
 * @param {boolean} props.showLabel - Whether to show label text (default: true)
 * @param {'sm'|'md'|'lg'} props.size - Size of the indicator
 */
export default function StatusIndicator({ status, stacks = 1, showLabel = true, size = 'md' }) {
  if (!status) return null;

  // Normalize status names
  const normalizedStatus = status.replace('ed', '').replace('en', '');
  const statusKey = {
    poison: 'poison',
    poisoned: 'poison',
    paralysis: 'paralysis',
    paralyzed: 'paralysis',
    burn: 'burn',
    burned: 'burn',
    freeze: 'freeze',
    frozen: 'freeze',
    sleep: 'sleep',
    asleep: 'sleep',
    confused: 'confused',
    badly_poisoned: 'badly_poisoned',
  }[status] || normalizedStatus;

  const statusConfig = {
    poison: {
      label: 'PSN',
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.2)',
      emoji: '☠️',
      stackable: true,
    },
    badly_poisoned: {
      label: 'TOX',
      color: '#7c3aed',
      bgColor: 'rgba(124, 58, 237, 0.2)',
      emoji: '💀',
      stackable: false,
    },
    paralysis: {
      label: 'PAR',
      color: '#eab308',
      bgColor: 'rgba(234, 179, 8, 0.2)',
      emoji: '⚡',
      stackable: false,
    },
    burn: {
      label: 'BRN',
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.2)',
      emoji: '🔥',
      stackable: true,
    },
    freeze: {
      label: 'FRZ',
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.2)',
      emoji: '❄️',
      stackable: true,
    },
    sleep: {
      label: 'SLP',
      color: '#64748b',
      bgColor: 'rgba(100, 116, 139, 0.2)',
      emoji: '💤',
      stackable: false,
    },
    confused: {
      label: 'CNF',
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.2)',
      emoji: '😵',
      stackable: false,
    },
  };

  const config = statusConfig[statusKey];
  if (!config) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  // Intensity increases with stacks
  const stackIntensity = config.stackable && stacks > 1 ? Math.min(stacks / MAX_STATUS_STACKS, 1) : 0;
  const pulseAnimation = config.stackable && stacks >= 3 ? {
    scale: [1, 1.1, 1],
    boxShadow: [
      `0 0 0px ${config.color}`,
      `0 0 ${stacks * 3}px ${config.color}`,
      `0 0 0px ${config.color}`,
    ],
  } : {};

  return (
    <motion.div
      className={`inline-flex items-center gap-1 rounded-full font-bold ${sizeClasses[size]}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: `2px solid ${config.color}`,
        boxShadow: stackIntensity > 0 ? `0 0 ${stackIntensity * 8}px ${config.color}` : 'none',
      }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{
        scale: 1,
        rotate: 0,
        ...pulseAnimation,
      }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{
        type: 'spring',
        duration: 0.5,
        scale: config.stackable && stacks >= 3 ? { repeat: Infinity, duration: 1 } : {},
        boxShadow: config.stackable && stacks >= 3 ? { repeat: Infinity, duration: 1 } : {},
      }}
    >
      <span>{config.emoji}</span>
      {showLabel && (
        <span>
          {config.label}
          {config.stackable && stacks > 1 && (
            <span className="ml-0.5 text-white/90">x{stacks}</span>
          )}
        </span>
      )}
    </motion.div>
  );
}

/**
 * StatusBadgeGroup component for displaying multiple status effects
 */
export function StatusBadgeGroup({ statuses = [], size = 'md' }) {
  if (!statuses || statuses.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {statuses.map((status, index) => (
        <StatusIndicator key={index} status={status} size={size} />
      ))}
    </div>
  );
}
