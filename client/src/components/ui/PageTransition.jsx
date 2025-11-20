import { motion } from "framer-motion";
import { forwardRef } from "react";

/**
 * PageTransition wrapper for smooth page transitions
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.variant - Transition variant: 'fade' | 'slide' | 'scale'
 */
const PageTransition = forwardRef(function PageTransition({ children, variant = "fade" }, ref) {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    slide: {
      initial: { opacity: 0, x: -100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 100 },
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.1 },
      transition: { duration: 0.3 },
    },
  };

  const config = variants[variant] || variants.fade;

  return (
    <motion.div
      ref={ref}
      initial={{
        ...config.initial,
        pointerEvents: "none",
      }}
      animate={{
        ...config.animate,
        pointerEvents: "auto",
      }}
      exit={{
        ...config.exit,
        pointerEvents: "none",
      }}
      transition={config.transition}
      className="w-full h-full absolute inset-0"
    >
      {children}
    </motion.div>
  );
});

export default PageTransition;
