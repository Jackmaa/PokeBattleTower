// useTimedSequence.js
// Custom hook for managing timed state sequences

import { useState, useEffect, useRef } from 'react';

/**
 * Hook for managing state that transitions through a sequence of values over time
 * Useful for animations, multi-step processes, or any timed state transitions
 *
 * @param {*} initialState - The initial state value
 * @param {Array} sequence - Array of { newState, delay } objects defining the sequence
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoStart - Whether to start sequence automatically (default: true)
 * @param {Function} options.onComplete - Callback fired when sequence completes
 *
 * @returns {Object} - { currentState, startSequence, resetSequence, isRunning }
 *
 * @example
 * const { currentState } = useTimedSequence('idle', [
 *   { newState: 'hurt', delay: 0 },
 *   { newState: 'idle', delay: 300 }
 * ]);
 */
export function useTimedSequence(initialState, sequence = [], options = {}) {
  const {
    autoStart = true,
    onComplete = () => {}
  } = options;

  const [currentState, setCurrentState] = useState(initialState);
  const [isRunning, setIsRunning] = useState(false);
  const timeoutsRef = useRef([]);

  // Start the sequence
  const startSequence = () => {
    if (sequence.length === 0) return;

    setIsRunning(true);
    let accumulatedTime = 0;

    sequence.forEach(({ newState, delay }) => {
      accumulatedTime += delay;
      const timeout = setTimeout(() => {
        setCurrentState(newState);
      }, accumulatedTime);
      timeoutsRef.current.push(timeout);
    });

    // Set timeout for completion callback
    const completeTimeout = setTimeout(() => {
      setIsRunning(false);
      onComplete();
      timeoutsRef.current = [];
    }, accumulatedTime);
    timeoutsRef.current.push(completeTimeout);
  };

  // Reset to initial state and clear timeouts
  const resetSequence = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setCurrentState(initialState);
    setIsRunning(false);
  };

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && sequence.length > 0) {
      startSequence();
    }

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentState,
    startSequence,
    resetSequence,
    isRunning,
  };
}
