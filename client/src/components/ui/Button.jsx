import { motion } from 'framer-motion';

/**
 * Button component with gaming-style animations
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'success'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  className = '',
  ...props
}) {
  const baseClasses = "font-display rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "btn-neon-primary",
    secondary: "btn-neon",
    danger: "btn-neon border-neon-danger text-neon-danger hover:bg-neon-danger/10 hover:shadow-[0_0_20px_rgba(255,42,109,0.5)]",
    success: "btn-neon border-neon-emerald text-neon-emerald hover:bg-neon-emerald/10 hover:shadow-[0_0_20px_rgba(0,255,157,0.5)]"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const handleClick = (e) => {
    console.log('[Button] Clicked! Disabled:', disabled, 'Loading:', loading);
    if (onClick && !disabled && !loading) {
      onClick(e);
    }
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {children}
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
