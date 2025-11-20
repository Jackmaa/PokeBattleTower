// 📁 AudioManager.js
// Centralized audio management system using Howler.js

import { Howl } from 'howler';

class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.currentMusicTrack = null;
    this.isMusicEnabled = true;
    this.isSFXEnabled = true;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;

    // Load settings from localStorage
    this.loadSettings();
  }

  // ============================================
  // SETTINGS MANAGEMENT
  // ============================================

  loadSettings() {
    try {
      const settings = JSON.parse(localStorage.getItem('audioSettings') || '{}');
      this.isMusicEnabled = settings.musicEnabled ?? true;
      this.isSFXEnabled = settings.sfxEnabled ?? true;
      this.musicVolume = settings.musicVolume ?? 0.5;
      this.sfxVolume = settings.sfxVolume ?? 0.7;
    } catch (error) {
      console.error('Failed to load audio settings:', error);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('audioSettings', JSON.stringify({
        musicEnabled: this.isMusicEnabled,
        sfxEnabled: this.isSFXEnabled,
        musicVolume: this.musicVolume,
        sfxVolume: this.sfxVolume,
      }));
    } catch (error) {
      console.error('Failed to save audio settings:', error);
    }
  }

  toggleMusic() {
    this.isMusicEnabled = !this.isMusicEnabled;
    if (this.music) {
      if (this.isMusicEnabled) {
        this.music.play();
      } else {
        this.music.pause();
      }
    }
    this.saveSettings();
    return this.isMusicEnabled;
  }

  toggleSFX() {
    this.isSFXEnabled = !this.isSFXEnabled;
    this.saveSettings();
    return this.isSFXEnabled;
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.volume(this.musicVolume);
    }
    this.saveSettings();
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  // ============================================
  // SOUND EFFECT PRELOADING
  // ============================================

  preloadSFX(soundName, path) {
    if (!this.sounds[soundName]) {
      this.sounds[soundName] = new Howl({
        src: [path],
        volume: this.sfxVolume,
        preload: true,
        onloaderror: (id, error) => {
          console.warn(`Failed to load sound: ${soundName}`, error);
        }
      });
    }
  }

  preloadAllSFX() {
    // Type-based attack sounds
    const types = [
      'fire', 'water', 'grass', 'electric', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic',
      'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal'
    ];

    types.forEach(type => {
      this.preloadSFX(`attack_${type}`, `/audio/sfx/attack_${type}.mp3`);
    });

    // Combat sounds
    this.preloadSFX('hit_normal', '/audio/sfx/hit_normal.mp3');
    this.preloadSFX('hit_critical', '/audio/sfx/hit_critical.mp3');
    this.preloadSFX('hit_super_effective', '/audio/sfx/hit_super_effective.mp3');
    this.preloadSFX('hit_not_very_effective', '/audio/sfx/hit_not_very_effective.mp3');
    this.preloadSFX('pokemon_faint', '/audio/sfx/pokemon_faint.mp3');
    this.preloadSFX('pokemon_switch', '/audio/sfx/pokemon_switch.mp3');

    // UI sounds
    this.preloadSFX('victory', '/audio/sfx/victory.mp3');
    this.preloadSFX('defeat', '/audio/sfx/defeat.mp3');
    this.preloadSFX('level_up', '/audio/sfx/level_up.mp3');
    this.preloadSFX('heal', '/audio/sfx/heal.mp3');
    this.preloadSFX('catch', '/audio/sfx/catch.mp3');
    this.preloadSFX('button_click', '/audio/sfx/button_click.mp3');
    this.preloadSFX('menu_select', '/audio/sfx/menu_select.mp3');
  }

  // ============================================
  // PLAY SOUND EFFECTS
  // ============================================

  playSFX(soundName, options = {}) {
    if (!this.isSFXEnabled) return;

    const sound = this.sounds[soundName];
    if (sound) {
      sound.volume(options.volume ?? this.sfxVolume);
      sound.rate(options.rate ?? 1);
      sound.play();
    } else {
      console.warn(`Sound not preloaded: ${soundName}`);
    }
  }

  // Type-specific attack sounds
  playAttackSound(pokemonType) {
    this.playSFX(`attack_${pokemonType?.toLowerCase() || 'normal'}`);
  }

  // Hit sounds based on effectiveness
  playHitSound(isCritical, effectiveness) {
    if (isCritical) {
      this.playSFX('hit_critical');
    } else if (effectiveness > 1) {
      this.playSFX('hit_super_effective');
    } else if (effectiveness < 1) {
      this.playSFX('hit_not_very_effective');
    } else {
      this.playSFX('hit_normal');
    }
  }

  // Combat event sounds
  playFaintSound() {
    this.playSFX('pokemon_faint');
  }

  playSwitchSound() {
    this.playSFX('pokemon_switch');
  }

  playVictorySound() {
    this.playSFX('victory');
  }

  playDefeatSound() {
    this.playSFX('defeat');
  }

  playHealSound() {
    this.playSFX('heal');
  }

  playCatchSound() {
    this.playSFX('catch');
  }

  playLevelUpSound() {
    this.playSFX('level_up');
  }

  // UI sounds
  playButtonClick() {
    this.playSFX('button_click', { volume: 0.3 });
  }

  playMenuSelect() {
    this.playSFX('menu_select', { volume: 0.4 });
  }

  // ============================================
  // BACKGROUND MUSIC
  // ============================================

  playMusic(trackName, options = {}) {
    if (!this.isMusicEnabled) return;

    const path = `/audio/music/${trackName}.mp3`;

    // If same track is already playing, don't restart
    if (this.currentMusicTrack === trackName && this.music && this.music.playing()) {
      return;
    }

    // Stop current music with fade out
    if (this.music) {
      this.music.fade(this.music.volume(), 0, options.fadeOut ?? 1000);
      setTimeout(() => {
        if (this.music) {
          this.music.stop();
          this.music.unload();
        }
      }, options.fadeOut ?? 1000);
    }

    // Load and play new music
    this.music = new Howl({
      src: [path],
      loop: options.loop ?? true,
      volume: 0,
      preload: true,
      onload: () => {
        if (this.isMusicEnabled) {
          this.music.play();
          this.music.fade(0, this.musicVolume, options.fadeIn ?? 1000);
        }
      },
      onloaderror: (id, error) => {
        console.warn(`Failed to load music: ${trackName}`, error);
      }
    });

    this.currentMusicTrack = trackName;
  }

  stopMusic(fadeOutDuration = 1000) {
    if (this.music) {
      this.music.fade(this.music.volume(), 0, fadeOutDuration);
      setTimeout(() => {
        if (this.music) {
          this.music.stop();
          this.music.unload();
          this.music = null;
        }
        this.currentMusicTrack = null;
      }, fadeOutDuration);
    }
  }

  pauseMusic() {
    if (this.music && this.music.playing()) {
      this.music.pause();
    }
  }

  resumeMusic() {
    if (this.music && !this.music.playing() && this.isMusicEnabled) {
      this.music.play();
    }
  }

  // ============================================
  // DYNAMIC MUSIC BASED ON GAME STATE
  // ============================================

  playMusicForFloor(floor) {
    if (floor <= 5) {
      this.playMusic('battle_1');
    } else if (floor <= 10) {
      this.playMusic('battle_2');
    } else if (floor <= 15) {
      this.playMusic('battle_3');
    } else if (floor <= 19) {
      this.playMusic('battle_4');
    } else if (floor === 20) {
      this.playMusic('boss_battle');
    }
  }

  playMenuMusic() {
    this.playMusic('menu');
  }

  playVictoryMusic() {
    this.playMusic('victory', { loop: false, fadeIn: 500 });
  }

  playDefeatMusic() {
    this.playMusic('defeat', { loop: false, fadeIn: 500 });
  }

  // ============================================
  // CLEANUP
  // ============================================

  cleanup() {
    // Unload all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.unload();
    });
    this.sounds = {};

    // Stop and unload music
    if (this.music) {
      this.music.stop();
      this.music.unload();
      this.music = null;
    }

    this.currentMusicTrack = null;
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;
