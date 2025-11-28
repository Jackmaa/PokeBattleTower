import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Full-screen modal component with glassmorphism effect
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.borderColor - Border color (e.g., 'purple-500', 'blue-500')
 * @param {boolean} props.closeOnBackdrop - Close when clicking backdrop (default: true)
 * @param {boolean} props.showCloseButton - Show close button (default: true)
 * @param {string} props.maxWidth - Modal max width: 'sm', 'md', 'lg', 'xl', '2xl', '4xl', '6xl' (default: '4xl')
 */
export default function FullScreenModal({
  isOpen,
  onClose,
  title,
  children,
  borderColor = 'purple-500',
  closeOnBackdrop = true,
  showCloseButton = true,
  maxWidth = '4xl',
}) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Extract color name from borderColor (e.g., 'purple-500' -> 'purple')
  const colorName = borderColor.split('-')[0];
  const titleColorClass = `text-${colorName}-400`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOnBackdrop ? onClose : undefined}
        >
          <motion.div
            className={`max-w-${maxWidth} w-full max-h-[80vh] overflow-y-auto`}
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`glass-card p-6 border-2 border-${borderColor}`}>
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between mb-4">
                  {title && (
                    <h2 className={`text-2xl font-bold ${titleColorClass}`}>
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <button
                      className="text-white/60 hover:text-white text-2xl ml-auto transition-colors"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
