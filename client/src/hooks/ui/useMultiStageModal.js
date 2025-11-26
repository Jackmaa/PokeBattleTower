// useMultiStageModal.js
// Custom hook for managing multi-stage modal flows with timing

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook for managing multi-stage modal workflows with automatic transitions
 *
 * @param {Object} config - Configuration object
 * @param {string[]} config.stages - Array of stage names (e.g., ['intro', 'evolving', 'evolved'])
 * @param {Object} config.timings - Object mapping stage names to milliseconds before auto-advance
 * @param {boolean} config.autoAdvance - Whether to automatically advance stages (default: true)
 * @param {Function} config.onStageChange - Callback fired when stage changes
 *
 * @returns {Object} - { currentStage, stageData, isTransitioning, advanceStage, setStage, resetStages }
 *
 * @example
 * const { currentStage, advanceStage, stageData } = useMultiStageModal({
 *   stages: ['intro', 'evolving', 'evolved'],
 *   timings: { intro: 2000, evolving: 3000 },
 *   onStageChange: (stage) => console.log('New stage:', stage)
 * });
 */
export function useMultiStageModal(config = {}) {{
  const {
    stages = ['intro', 'process', 'complete'],
    timings = {},
    autoAdvance = true,
    onStageChange = () => {}
  } = config;

  const [currentStage, setCurrentStage] = useState(stages[0]);
  const [stageData, setStageData] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  // Auto-advance to next stage if timing is configured
  useEffect(() => {
    if (!autoAdvance) return;

    const stageTiming = timings[currentStage];
    if (!stageTiming) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to advance stage
    timeoutRef.current = setTimeout(() => {
      const currentIndex = stages.indexOf(currentStage);
      if (currentIndex < stages.length - 1) {
        const nextStage = stages[currentIndex + 1];
        setCurrentStage(nextStage);
        onStageChange(nextStage);
      }
      timeoutRef.current = null;
    }, stageTiming);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [currentStage, stages, timings, autoAdvance, onStageChange]);

  // Manually advance to the next stage
  const advanceStage = useCallback((data = {}) => {
    const currentIndex = stages.indexOf(currentStage);

    if (currentIndex < stages.length - 1) {
      setIsTransitioning(true);

      // Update stage data if provided
      if (Object.keys(data).length > 0) {
        setStageData(prev => ({ ...prev, ...data }));
      }

      // Small delay for transition effect
      setTimeout(() => {
        const nextStage = stages[currentIndex + 1];
        setCurrentStage(nextStage);
        onStageChange(nextStage);
        setIsTransitioning(false);
      }, 100);
    }
  }, [currentStage, stages, onStageChange]);

  // Manually set stage (useful for non-linear flows)
  const setStage = useCallback((stageName, data = {}) => {
    if (stages.includes(stageName)) {
      setCurrentStage(stageName);
      onStageChange(stageName);

      if (Object.keys(data).length > 0) {
        setStageData(prev => ({ ...prev, ...data }));
      }
    } else {
      console.warn(`Stage "${stageName}" not found in stages array`);
    }
  }, [stages, onStageChange]);

  // Reset to first stage
  const resetStages = useCallback(() => {
    setCurrentStage(stages[0]);
    setStageData({});
    setIsTransitioning(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [stages]);

  // Get current stage index
  const currentStageIndex = stages.indexOf(currentStage);
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === stages.length - 1;

  return {
    currentStage,
    currentStageIndex,
    stageData,
    isTransitioning,
    isFirstStage,
    isLastStage,
    advanceStage,
    setStage,
    resetStages,
    setStageData,
  };
}
  const {
    stages = ['intro', 'process', 'complete'],
    timings = {},
    autoAdvance = true,
    onStageChange = () => {}
  } = config;

  const [currentStage, setCurrentStage] = useState(stages[0]);
  const [stageData, setStageData] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  // Auto-advance to next stage if timing is configured
  useEffect(() => {
    if (!autoAdvance) return;

    const stageTiming = timings[currentStage];
    if (!stageTiming) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to advance stage
    timeoutRef.current = setTimeout(() => {
      const currentIndex = stages.indexOf(currentStage);
      if (currentIndex < stages.length - 1) {
        const nextStage = stages[currentIndex + 1];
        setCurrentStage(nextStage);
        onStageChange(nextStage);
      }
      timeoutRef.current = null;
    }, stageTiming);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [currentStage, stages, timings, autoAdvance, onStageChange]);

  // Manually advance to the next stage
  const advanceStage = useCallback((data = {}) => {
    const currentIndex = stages.indexOf(currentStage);

    if (currentIndex < stages.length - 1) {
      setIsTransitioning(true);

      // Update stage data if provided
      if (Object.keys(data).length > 0) {
        setStageData(prev => ({ ...prev, ...data }));
      }

      // Small delay for transition effect
      setTimeout(() => {
        const nextStage = stages[currentIndex + 1];
        setCurrentStage(nextStage);
        onStageChange(nextStage);
        setIsTransitioning(false);
      }, 100);
    }
  }, [currentStage, stages, onStageChange]);

  // Manually set stage (useful for non-linear flows)
  const setStage = useCallback((stageName, data = {}) => {
    if (stages.includes(stageName)) {
      setCurrentStage(stageName);
      onStageChange(stageName);

      if (Object.keys(data).length > 0) {
        setStageData(prev => ({ ...prev, ...data }));
      }
    } else {
      console.warn(`Stage "${stageName}" not found in stages array`);
    }
  }, [stages, onStageChange]);

  // Reset to first stage
  const resetStages = useCallback(() => {
    setCurrentStage(stages[0]);
    setStageData({});
    setIsTransitioning(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [stages]);

  // Get current stage index
  const currentStageIndex = stages.indexOf(currentStage);
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === stages.length - 1;

  return {
    currentStage,
    currentStageIndex,
    stageData,
    isTransitioning,
    isFirstStage,
    isLastStage,
    advanceStage,
    setStage,
    resetStages,
    setStageData,
  };
}
