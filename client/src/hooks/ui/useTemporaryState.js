// useTemporaryState.js
// Custom hook for state that auto-resets after a duration

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook for managing temporary state that auto-resets to initial value
 * Useful for highlights, notifications, or any temporary UI state
 *
 * @param {*} initialValue - The initial/default value to reset to
 * @param {number} duration - Duration in milliseconds before reset (default: 3000)
 *
 * @returns {Array} - [value, setTemporary, clearNow] tuple
 *
 * @example
 * const [highlight, setTemporaryHighlight] = useTemporaryState(null, 3000);
 * setTemporaryHighlight({ index: 0, stat: 'attack' }); // Auto-resets after 3s
 */
export function useTemporaryState(initialValue = null, duration = 3000) {
  const [value, setValue] = useState(initialValue);
  const timeoutRef = useRef(null);

  // Set temporary value that will auto-reset
  const setTemporary = useCallback((newValue) => {
    setValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setValue(initialValue);
      timeoutRef.current = null;
    }, duration);
  }, [initialValue, duration]);

  // Immediately clear and reset to initial value
  const clearNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setValue(initialValue);
  }, [initialValue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, setTemporary, clearNow];
}
