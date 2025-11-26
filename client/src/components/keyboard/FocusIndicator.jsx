import { motion } from 'framer-motion';

/**
 * Composant pour afficher un indicateur visuel de focus clavier
 * S'affiche autour de l'élément sélectionné avec le clavier
 */
const FocusIndicator = ({
  isVisible = true,
  color = 'blue',
  thickness = 2,
  offset = 2,
  animated = true,
  children,
  className = '',
}) => {
  if (!isVisible) return children;

  const colorClasses = {
    blue: 'ring-blue-400 shadow-blue-400/50',
    yellow: 'ring-yellow-400 shadow-yellow-400/50',
    green: 'ring-green-400 shadow-green-400/50',
    red: 'ring-red-400 shadow-red-400/50',
    purple: 'ring-purple-400 shadow-purple-400/50',
  };

  const selectedColorClass = colorClasses[color] || colorClasses.blue;
  const ringClass = `ring-${thickness}`;
  const offsetClass = offset > 0 ? `-m-${offset}` : '';

  if (animated) {
    return (
      <motion.div
        className={`${ringClass} ${selectedColorClass} ${offsetClass} rounded-lg ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: [
            '0 0 0px rgba(59, 130, 246, 0)',
            '0 0 20px rgba(59, 130, 246, 0.5)',
            '0 0 0px rgba(59, 130, 246, 0)',
          ],
        }}
        transition={{
          duration: 0.2,
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${ringClass} ${selectedColorClass} ${offsetClass} rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default FocusIndicator;
