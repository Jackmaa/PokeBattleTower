// useTooltip.js
// Custom hook for managing tooltip state and interactions

import { useState, useRef, useCallback } from 'react';

/**
 * Hook for managing tooltip visibility and positioning
 *
 * @param {Object} options - Configuration options
 * @param {number} options.delay - Delay in ms before showing tooltip (default: 0)
 * @param {string} options.defaultPosition - Default position ('top', 'bottom', 'left', 'right')
 * @param {boolean} options.disabled - Whether tooltip is disabled
 *
 * @returns {Object} - { isVisible, setIsVisible, position, setPosition, bind, elementRef }
 *
 * @example
 * const { isVisible, bind, elementRef } = useTooltip();
 *
 * <div {...bind} ref={elementRef}>
 *   Hover me
 *   {isVisible && <Tooltip content="Hello!" />}
 * </div>
 */
export function useTooltip(options = {}) {
  const {
    delay = 0,
    defaultPosition = 'top',
    disabled = false
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const elementRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  }, [delay, disabled]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);

  // Props to spread on the target element
  const bind = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return {
    isVisible,
    setIsVisible,
    position,
    setPosition,
    bind,
    elementRef,
  };
}
