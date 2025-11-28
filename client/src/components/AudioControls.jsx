// 📁 AudioControls.jsx
// Audio settings component with volume sliders and toggles

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../hooks/useAudio';
import { Card } from './ui';

export default function AudioControls() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isMusicEnabled,
    isSFXEnabled,
    musicVolume,
    sfxVolume,
    toggleMusic,
    toggleSFX,
    setMusicVolume,
    setSFXVolume,
    playButtonClick,
  } = useAudio();

  const handleTogglePanel = () => {
    playButtonClick();
    setIsOpen(!isOpen);
  };

  const handleToggleMusic = () => {
    playButtonClick();
    toggleMusic();
  };

  const handleToggleSFX = () => {
    playButtonClick();
    toggleSFX();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <motion.button
        onClick={handleTogglePanel}
        className="bg-gaming-primary hover:bg-gaming-primary/80 text-white rounded-full p-4 shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl">🎵</span>
      </motion.button>

      {/* Audio Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="absolute bottom-20 right-0 w-80"
          >
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 text-gaming-accent">
                🎵 Audio Settings
              </h3>

              {/* Music Controls */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-white/90">
                    Music
                  </label>
                  <button
                    onClick={handleToggleMusic}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                      isMusicEnabled
                        ? 'bg-gaming-success text-white'
                        : 'bg-white/20 text-white/50'
                    }`}
                  >
                    {isMusicEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/70">🔇</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume * 100}
                    onChange={(e) => setMusicVolume(e.target.value / 100)}
                    disabled={!isMusicEnabled}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-white/70">🔊</span>
                  <span className="text-sm font-mono text-white/90 w-12 text-right">
                    {Math.round(musicVolume * 100)}%
                  </span>
                </div>
              </div>

              {/* SFX Controls */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-white/90">
                    Sound Effects
                  </label>
                  <button
                    onClick={handleToggleSFX}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                      isSFXEnabled
                        ? 'bg-gaming-success text-white'
                        : 'bg-white/20 text-white/50'
                    }`}
                  >
                    {isSFXEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/70">🔇</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sfxVolume * 100}
                    onChange={(e) => setSFXVolume(e.target.value / 100)}
                    disabled={!isSFXEnabled}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm text-white/70">🔊</span>
                  <span className="text-sm font-mono text-white/90 w-12 text-right">
                    {Math.round(sfxVolume * 100)}%
                  </span>
                </div>
              </div>

              <div className="text-xs text-white/50 text-center mt-4">
                Settings are saved automatically
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Slider Styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #6366f1;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #6366f1;
          cursor: pointer;
          border-radius: 50%;
          border: none;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
        }

        .slider:disabled::-webkit-slider-thumb {
          background: #666;
          box-shadow: none;
        }

        .slider:disabled::-moz-range-thumb {
          background: #666;
          box-shadow: none;
        }

        .slider::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
