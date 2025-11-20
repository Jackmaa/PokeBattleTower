// 📁 useAudio.js
// React hook for easy audio management in components

import { useEffect, useState, useCallback } from 'react';
import audioManager from '../services/AudioManager';

export function useAudio() {
  const [isMusicEnabled, setIsMusicEnabled] = useState(audioManager.isMusicEnabled);
  const [isSFXEnabled, setIsSFXEnabled] = useState(audioManager.isSFXEnabled);
  const [musicVolume, setMusicVolumeState] = useState(audioManager.musicVolume);
  const [sfxVolume, setSFXVolumeState] = useState(audioManager.sfxVolume);

  // Preload all sounds on mount
  useEffect(() => {
    audioManager.preloadAllSFX();

    // Cleanup on unmount
    return () => {
      audioManager.cleanup();
    };
  }, []);

  // Toggle functions
  const toggleMusic = useCallback(() => {
    const newState = audioManager.toggleMusic();
    setIsMusicEnabled(newState);
    return newState;
  }, []);

  const toggleSFX = useCallback(() => {
    const newState = audioManager.toggleSFX();
    setIsSFXEnabled(newState);
    return newState;
  }, []);

  // Volume controls
  const setMusicVolume = useCallback((volume) => {
    audioManager.setMusicVolume(volume);
    setMusicVolumeState(volume);
  }, []);

  const setSFXVolume = useCallback((volume) => {
    audioManager.setSFXVolume(volume);
    setSFXVolumeState(volume);
  }, []);

  // SFX playback
  const playSFX = useCallback((soundName, options) => {
    audioManager.playSFX(soundName, options);
  }, []);

  const playAttackSound = useCallback((pokemonType) => {
    audioManager.playAttackSound(pokemonType);
  }, []);

  const playHitSound = useCallback((isCritical, effectiveness) => {
    audioManager.playHitSound(isCritical, effectiveness);
  }, []);

  const playFaintSound = useCallback(() => {
    audioManager.playFaintSound();
  }, []);

  const playSwitchSound = useCallback(() => {
    audioManager.playSwitchSound();
  }, []);

  const playVictorySound = useCallback(() => {
    audioManager.playVictorySound();
  }, []);

  const playDefeatSound = useCallback(() => {
    audioManager.playDefeatSound();
  }, []);

  const playHealSound = useCallback(() => {
    audioManager.playHealSound();
  }, []);

  const playCatchSound = useCallback(() => {
    audioManager.playCatchSound();
  }, []);

  const playLevelUpSound = useCallback(() => {
    audioManager.playLevelUpSound();
  }, []);

  const playButtonClick = useCallback(() => {
    audioManager.playButtonClick();
  }, []);

  const playMenuSelect = useCallback(() => {
    audioManager.playMenuSelect();
  }, []);

  // Music controls
  const playMusic = useCallback((trackName, options) => {
    audioManager.playMusic(trackName, options);
  }, []);

  const stopMusic = useCallback((fadeOutDuration) => {
    audioManager.stopMusic(fadeOutDuration);
  }, []);

  const pauseMusic = useCallback(() => {
    audioManager.pauseMusic();
  }, []);

  const resumeMusic = useCallback(() => {
    audioManager.resumeMusic();
  }, []);

  const playMusicForFloor = useCallback((floor) => {
    audioManager.playMusicForFloor(floor);
  }, []);

  const playMenuMusic = useCallback(() => {
    audioManager.playMenuMusic();
  }, []);

  const playVictoryMusic = useCallback(() => {
    audioManager.playVictoryMusic();
  }, []);

  const playDefeatMusic = useCallback(() => {
    audioManager.playDefeatMusic();
  }, []);

  return {
    // State
    isMusicEnabled,
    isSFXEnabled,
    musicVolume,
    sfxVolume,

    // Settings
    toggleMusic,
    toggleSFX,
    setMusicVolume,
    setSFXVolume,

    // SFX
    playSFX,
    playAttackSound,
    playHitSound,
    playFaintSound,
    playSwitchSound,
    playVictorySound,
    playDefeatSound,
    playHealSound,
    playCatchSound,
    playLevelUpSound,
    playButtonClick,
    playMenuSelect,

    // Music
    playMusic,
    stopMusic,
    pauseMusic,
    resumeMusic,
    playMusicForFloor,
    playMenuMusic,
    playVictoryMusic,
    playDefeatMusic,
  };
}
