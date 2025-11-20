import { motion } from 'framer-motion';

/**
 * StatusIndicator component for displaying battle status effects
 *
 * @param {Object} props
 * @param {'poison'|'paralysis'|'burn'|'freeze'|'sleep'|'confused'} props.status - Status type
 * @param {boolean} props.showLabel - Whether to show label text (default: true)
 * @param {'sm'|'md'|'lg'} props.size - Size of the indicator
 */
export default function StatusIndicator({ status, showLabel = true, size = 'md' }) {
  if (!status) return null;

  const statusConfig = {
    poison: {
      label: 'PSN',
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.2)',
      emoji: '☠️',
    },
    paralysis: {
      label: 'PAR',
      color: '#eab308',
      bgColor: 'rgba(234, 179, 8, 0.2)',
      emoji: '⚡',
    },
    burn: {
      label: 'BRN',
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.2)',
      emoji: '🔥',
    },
    freeze: {
      label: 'FRZ',
      color: '#06b6d4',
      bgColor: 'rgba(6, 182, 212, 0.2)',
      emoji: '❄️',
    },
    sleep: {
      label: 'SLP',
      color: '#64748b',
      bgColor: 'rgba(100, 116, 139, 0.2)',
      emoji: '💤',
    },
    confused: {
      label: 'CNF',
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.2)',
      emoji: '😵',
    },
  };

  const config = statusConfig[status];
  if (!config) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <motion.div
      className={`inline-flex items-center gap-1 rounded-full font-bold ${sizeClasses[size]}`}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}`,
      }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ type: 'spring', duration: 0.5 }}
    >
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
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
