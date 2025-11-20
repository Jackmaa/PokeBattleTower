import { motion } from "framer-motion";

/**
 * StaggerContainer for animating lists with stagger effect
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - List items
 * @param {number} props.staggerDelay - Delay between each item (default: 0.1)
 * @param {string} props.className - Additional CSS classes
 */
export default function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem for individual items in a StaggerContainer
 */
export function StaggerItem({ children, className = "" }) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
