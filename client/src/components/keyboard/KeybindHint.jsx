import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getKeybindHelp, formatKey } from '../../utils/keybindConfig';

/**
 * Composant d'overlay d'aide pour afficher les keybinds disponibles
 * Activé avec la touche '?' ou 'h'
 */
const KeybindHint = ({ context = 'universal', enabled = true }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event) => {
      if (event.key === '?' || event.key === 'h') {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [enabled]);

  if (!enabled) return null;

  const helpData = getKeybindHelp(context);

  return (
    <>
      {/* Indicateur permanent (petit badge) */}
      {!isVisible && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.6, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 text-xs text-white/70">
            Press <span className="font-bold text-white">?</span> for help
          </div>
        </motion.div>
      )}

      {/* Overlay d'aide complet */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Contenu */}
            <motion.div
              className="relative max-w-2xl w-full glass-card p-6 border-2 border-blue-500/50"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-400">⌨️ Keyboard Controls</h2>
                  <p className="text-sm text-white/60 mt-1">{helpData.title}</p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* Liste des keybinds */}
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {helpData.keys.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-black/30 border border-white/10 hover:border-blue-500/30 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Touches */}
                    <div className="flex gap-2 min-w-[120px]">
                      {Array.isArray(item.keys) ? (
                        item.keys.map((key, keyIndex) => (
                          <span key={keyIndex}>
                            <kbd className="px-2 py-1 text-sm font-mono font-bold bg-gray-700 text-white rounded border border-gray-600 shadow-sm">
                              {formatKey(key)}
                            </kbd>
                            {keyIndex < item.keys.length - 1 && (
                              <span className="text-white/40 mx-1">or</span>
                            )}
                          </span>
                        ))
                      ) : (
                        <kbd className="px-2 py-1 text-sm font-mono font-bold bg-gray-700 text-white rounded border border-gray-600 shadow-sm">
                          {formatKey(item.keys)}
                        </kbd>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/80 flex-1">{item.action}</p>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-center text-white/50">
                  Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-700 rounded">?</kbd> or{' '}
                  <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-700 rounded">Esc</kbd> to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeybindHint;
