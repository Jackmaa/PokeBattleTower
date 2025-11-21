// 📁 settings.js
// Settings state for game preferences

import { atom } from 'recoil';

export const settingsState = atom({
  key: 'settingsState',
  default: {
    // Appearance
    theme: 'dark', // 'dark', 'light', 'retro', 'fire', 'ocean'
    particleDensity: 'normal', // 'low', 'normal', 'high', 'off'
    customCursor: true,

    // Animations
    animationSpeed: 1.0, // 0.5x to 2.0x
    skipAnimations: false,
    reducedMotion: false,

    // Audio (managed by AudioManager but exposed here for UI)
    musicVolume: 0.5,
    sfxVolume: 0.7,

    // Accessibility
    textSize: 'medium', // 'small', 'medium', 'large'
    colorBlindMode: 'none', // 'none', 'protanopia', 'deuteranopia', 'tritanopia'
    highContrast: false,
    showDamageNumbers: true,

    // Gameplay
    battleSpeed: 'normal', // 'slow', 'normal', 'fast'
    autosaveEnabled: true,

    // Advanced
    showFPS: false,
    developerMode: false,
  },
});

export const showSettingsMenuState = atom({
  key: 'showSettingsMenuState',
  default: false,
});
