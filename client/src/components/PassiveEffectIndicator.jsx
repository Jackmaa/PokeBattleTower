// 📁 PassiveEffectIndicator.jsx
// Visual indicator for passive item effects

import { motion, AnimatePresence } from 'framer-motion';
import { getItemById } from '../utils/items';
import { getPassiveEffectDescription } from '../utils/passiveEffects';

export default function PassiveEffectIndicator({ pokemon, showActivation, activationMessage }) {
  if (!pokemon?.heldItem) return null;

  const item = getItemById(pokemon.heldItem);
  if (!item) return null;

  const description = getPassiveEffectDescription(pokemon.heldItem);
  if (!description) return null;

  return (
    <div className="relative">
      {/* Passive Effect Badge */}
      <motion.div
        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/30 border border-purple-400/50 rounded-full text-xs text-purple-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        title={description}
      >
        <span>{item.icon}</span>
        <span className="font-bold">{item.name}</span>
      </motion.div>

      {/* Activation Animation */}
      <AnimatePresence>
        {showActivation && activationMessage && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-green-600/90 backdrop-blur-sm rounded-lg border-2 border-green-400 shadow-lg whitespace-nowrap z-50"
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
          >
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <motion.span
                className="text-lg"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2
                }}
              >
                ✨
              </motion.span>
              <span>{activationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Floating passive effect indicator that appears during battle
 */
export function FloatingPassiveIndicator({ message, icon, position = 'center' }) {
  return (
    <motion.div
      className={`fixed z-50 ${
        position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
        position === 'top' ? 'top-20 left-1/2 transform -translate-x-1/2' :
        'bottom-20 left-1/2 transform -translate-x-1/2'
      }`}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -20 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <div className="px-6 py-4 bg-purple-600/95 backdrop-blur-md rounded-2xl border-2 border-purple-400 shadow-2xl">
        <div className="flex items-center gap-3 text-white">
          <motion.span
            className="text-3xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            {icon || '✨'}
          </motion.span>
          <span className="text-lg font-bold">{message}</span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Compact indicator for showing active passive effects on Pokemon cards
 */
export function CompactPassiveIndicator({ itemId }) {
  if (!itemId) return null;

  const item = getItemById(itemId);
  if (!item) return null;

  const description = getPassiveEffectDescription(itemId);
  if (!description) return null;

  return (
    <motion.div
      className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-600/40 border border-purple-400/60 rounded text-xs text-purple-200"
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(147, 51, 234, 0.6)' }}
      title={description}
    >
      <span className="text-sm">{item.icon}</span>
      <span className="font-semibold text-[10px]">PASSIVE</span>
    </motion.div>
  );
}
