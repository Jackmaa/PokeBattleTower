import { motion } from 'framer-motion';

/**
 * Card component with glassmorphism effect
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.hover - Enable hover effect (default: false)
 * @param {boolean} props.clickable - Make card clickable (default: false)
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {'default'|'glow'} props.variant - Card variant
 */
export default function Card({
  children,
  hover = false,
  clickable = false,
  onClick,
  className = '',
  variant = 'default',
  ...props
}) {
  const variantClasses = {
    default: 'glass-card',
    glow: 'glass-card shadow-glow',
  };

  const MotionWrapper = clickable || hover ? motion.div : 'div';
  const motionProps =
    clickable || hover
      ? {
          whileHover: { scale: 1.02, y: -2 },
          whileTap: clickable ? { scale: 0.98 } : {},
        }
      : {};

  return (
    <MotionWrapper
      className={`${variantClasses[variant]} p-6 rounded-xl ${
        clickable ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={clickable ? onClick : undefined}
      {...motionProps}
      {...props}
    >
      {children}
    </MotionWrapper>
  );
}
