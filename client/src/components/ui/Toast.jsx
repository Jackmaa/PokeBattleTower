import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Toast notification component
 *
 * @param {Object} props
 * @param {boolean} props.isVisible - Whether toast is visible
 * @param {Function} props.onClose - Close handler
 * @param {string} props.message - Toast message
 * @param {'success'|'error'|'warning'|'info'} props.type - Toast type
 * @param {number} props.duration - Auto-close duration in ms (default: 3000)
 */
export default function Toast({
  isVisible,
  onClose,
  message,
  type = 'info',
  duration = 3000,
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-gaming-success',
      icon: '✓',
      shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
    },
    error: {
      bg: 'bg-gaming-danger',
      icon: '✕',
      shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
    },
    warning: {
      bg: 'bg-gaming-warning',
      icon: '⚠',
      shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    },
    info: {
      bg: 'bg-gaming-accent',
      icon: 'ℹ',
      shadow: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]',
    },
  };

  const config = typeConfig[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, y: -50, x: 100 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div
            className={`${config.bg} ${config.shadow} text-white px-6 py-3 rounded-lg flex items-center gap-3 min-w-[300px]`}
          >
            <div className="text-2xl font-bold">{config.icon}</div>
            <div className="flex-1 font-semibold">{message}</div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * DamagePopup component for showing damage numbers in battle
 */
export function DamagePopup({ damage, isCritical, position = { x: 0, y: 0 } }) {
  return (
    <motion.div
      className={`absolute pointer-events-none font-bold text-2xl ${
        isCritical ? 'text-gaming-warning' : 'text-white'
      }`}
      style={{
        left: position.x,
        top: position.y,
        textShadow: '0 0 10px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.5)',
      }}
      initial={{ opacity: 1, y: 0, scale: isCritical ? 1.5 : 1 }}
      animate={{ opacity: 0, y: -50, scale: isCritical ? 2 : 1.2 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {isCritical && '⚡ '}
      {damage}
      {isCritical && ' CRITICAL!'}
    </motion.div>
  );
}
