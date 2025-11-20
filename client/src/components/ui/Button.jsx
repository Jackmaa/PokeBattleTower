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
  const baseClasses = "font-semibold rounded-lg transition-all duration-200 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-gaming-accent hover:bg-gaming-accent-light text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20",
    danger: "bg-gaming-danger hover:bg-red-600 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]",
    success: "bg-gaming-success hover:bg-emerald-600 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
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
