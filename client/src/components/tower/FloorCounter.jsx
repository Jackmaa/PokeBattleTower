import { motion } from "framer-motion";

/**
 * FloorCounter component - Animated floor number display
 *
 * @param {Object} props
 * @param {number} props.floor - Current floor number
 * @param {boolean} props.showProgress - Show progress bar (default: false)
 * @param {number} props.maxFloors - Maximum floors for progress (default: 10)
 */
export default function FloorCounter({ floor = 1, showProgress = false, maxFloors = 10 }) {
  const progress = (floor / maxFloors) * 100;

  return (
    <div className="relative">
      <motion.div
        className="glass-card p-4 rounded-xl inline-block"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        key={floor} // Re-animate on floor change
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="flex items-center gap-3">
          {/* Tower Icon */}
          <motion.div
            className="text-4xl"
            animate={{
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🏯
          </motion.div>

          {/* Floor Number */}
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Floor</div>
            <motion.div
              className="text-3xl font-bold text-glow"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              key={`floor-${floor}`}
            >
              {floor}
            </motion.div>
          </div>

          {/* Floor Type Badge */}
          {floor % 5 === 0 ? (
            <div className="px-3 py-1 bg-gaming-danger rounded-full text-xs font-bold">
              BOSS
            </div>
          ) : floor % 3 === 0 ? (
            <div className="px-3 py-1 bg-gaming-warning rounded-full text-xs font-bold">
              ELITE
            </div>
          ) : null}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gaming-accent to-gaming-accent-light"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Milestone indicator */}
      {(floor % 5 === 0 || floor % 10 === 0) && (
        <motion.div
          className="absolute -top-2 -right-2"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.3 }}
        >
          <div className="w-8 h-8 bg-gaming-success rounded-full flex items-center justify-center">
            <span className="text-lg">🌟</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
