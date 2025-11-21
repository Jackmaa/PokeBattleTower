// 📁 SettingsMenu.jsx
// Comprehensive settings menu with multiple sections

import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card } from './ui';
import { settingsState, showSettingsMenuState } from '../recoil/atoms/settings';
import AudioControls from './AudioControls';
import { clearAllSaves, getSaveSystemStats } from '../utils/saveManager';
import { useAudio } from '../hooks/useAudio';
import { THEMES as THEME_DATA, applyTheme, getAvailableThemes } from '../utils/themeManager';

// Get themes from theme manager for display
const THEMES = getAvailableThemes().map(theme => ({
  ...theme,
  colors: theme.id === 'dark' ? ['from-purple-900', 'to-slate-900']
    : theme.id === 'light' ? ['from-blue-100', 'to-purple-100']
    : theme.id === 'retro' ? ['from-green-900', 'to-yellow-900']
    : theme.id === 'fire' ? ['from-orange-600', 'to-red-900']
    : theme.id === 'ocean' ? ['from-blue-600', 'to-cyan-900']
    : ['from-gray-900', 'to-gray-900']
}));

const TABS = [
  { id: 'appearance', name: 'Appearance', icon: '🎨' },
  { id: 'animations', name: 'Animations', icon: '🎬' },
  { id: 'audio', name: 'Audio', icon: '🔊' },
  { id: 'accessibility', name: 'Accessibility', icon: '♿' },
  { id: 'data', name: 'Data', icon: '💾' },
];

export default function SettingsMenu() {
  const [settings, setSettings] = useRecoilState(settingsState);
  const [showMenu, setShowMenu] = useRecoilState(showSettingsMenuState);
  const [activeTab, setActiveTab] = useState('appearance');
  const [saveStats, setSaveStats] = useState(getSaveSystemStats());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const { playMenuSelect } = useAudio();

  if (!showMenu) return null;

  const handleClose = () => {
    playMenuSelect();
    setShowMenu(false);
  };

  const updateSetting = (key, value) => {
    playMenuSelect();
    setSettings(prev => ({ ...prev, [key]: value }));

    // Apply theme immediately when changed
    if (key === 'theme') {
      applyTheme(value);
    }
  };

  const handleClearAllData = () => {
    clearAllSaves();
    setSaveStats(getSaveSystemStats());
    setShowClearConfirm(false);
    playMenuSelect();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-5xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <Card className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">⚙️ Settings</h2>
            <Button variant="secondary" onClick={handleClose}>
              ✕ Close
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  playMenuSelect();
                  setActiveTab(tab.id);
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gaming-accent text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* APPEARANCE TAB */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Theme</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {THEMES.map(theme => (
                          <motion.button
                            key={theme.id}
                            onClick={() => updateSetting('theme', theme.id)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              settings.theme === theme.id
                                ? 'border-gaming-accent bg-gaming-accent/20'
                                : 'border-white/20 bg-white/5 hover:bg-white/10'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.colors.join(' ')} mb-2`} />
                            <div className="text-white font-bold">
                              {theme.icon} {theme.name}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Particle Effects</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {['off', 'low', 'normal', 'high'].map(density => (
                          <button
                            key={density}
                            onClick={() => updateSetting('particleDensity', density)}
                            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                              settings.particleDensity === density
                                ? 'bg-gaming-accent text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            {density}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-bold">Custom Cursor</div>
                        <div className="text-white/60 text-sm">Animated Pokéball cursor</div>
                      </div>
                      <button
                        onClick={() => updateSetting('customCursor', !settings.customCursor)}
                        className={`w-14 h-8 rounded-full transition-all ${
                          settings.customCursor ? 'bg-gaming-accent' : 'bg-white/20'
                        }`}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full m-1"
                          animate={{ x: settings.customCursor ? 20 : 0 }}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* ANIMATIONS TAB */}
                {activeTab === 'animations' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Animation Speed</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-white/70">0.5x</span>
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.1"
                          value={settings.animationSpeed}
                          onChange={(e) => updateSetting('animationSpeed', parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-white/70">2.0x</span>
                        <span className="text-white font-bold w-12 text-center">
                          {settings.animationSpeed.toFixed(1)}x
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-bold">Skip Animations</div>
                        <div className="text-white/60 text-sm">Skip battle animations for faster gameplay</div>
                      </div>
                      <button
                        onClick={() => updateSetting('skipAnimations', !settings.skipAnimations)}
                        className={`w-14 h-8 rounded-full transition-all ${
                          settings.skipAnimations ? 'bg-gaming-accent' : 'bg-white/20'
                        }`}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full m-1"
                          animate={{ x: settings.skipAnimations ? 20 : 0 }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-bold">Reduced Motion</div>
                        <div className="text-white/60 text-sm">Minimize animations for accessibility</div>
                      </div>
                      <button
                        onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                        className={`w-14 h-8 rounded-full transition-all ${
                          settings.reducedMotion ? 'bg-gaming-accent' : 'bg-white/20'
                        }`}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full m-1"
                          animate={{ x: settings.reducedMotion ? 20 : 0 }}
                        />
                      </button>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Battle Speed</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {['slow', 'normal', 'fast'].map(speed => (
                          <button
                            key={speed}
                            onClick={() => updateSetting('battleSpeed', speed)}
                            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                              settings.battleSpeed === speed
                                ? 'bg-gaming-accent text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* AUDIO TAB */}
                {activeTab === 'audio' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4">Audio Controls</h3>
                    <AudioControls />
                  </div>
                )}

                {/* ACCESSIBILITY TAB */}
                {activeTab === 'accessibility' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Text Size</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {['small', 'medium', 'large'].map(size => (
                          <button
                            key={size}
                            onClick={() => updateSetting('textSize', size)}
                            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                              settings.textSize === size
                                ? 'bg-gaming-accent text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Color Blind Mode</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'none', name: 'None' },
                          { id: 'protanopia', name: 'Protanopia (Red-blind)' },
                          { id: 'deuteranopia', name: 'Deuteranopia (Green-blind)' },
                          { id: 'tritanopia', name: 'Tritanopia (Blue-blind)' },
                        ].map(mode => (
                          <button
                            key={mode.id}
                            onClick={() => updateSetting('colorBlindMode', mode.id)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              settings.colorBlindMode === mode.id
                                ? 'bg-gaming-accent text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            {mode.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-bold">High Contrast</div>
                        <div className="text-white/60 text-sm">Increase contrast for better visibility</div>
                      </div>
                      <button
                        onClick={() => updateSetting('highContrast', !settings.highContrast)}
                        className={`w-14 h-8 rounded-full transition-all ${
                          settings.highContrast ? 'bg-gaming-accent' : 'bg-white/20'
                        }`}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full m-1"
                          animate={{ x: settings.highContrast ? 20 : 0 }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-bold">Show Damage Numbers</div>
                        <div className="text-white/60 text-sm">Display damage values during battle</div>
                      </div>
                      <button
                        onClick={() => updateSetting('showDamageNumbers', !settings.showDamageNumbers)}
                        className={`w-14 h-8 rounded-full transition-all ${
                          settings.showDamageNumbers ? 'bg-gaming-accent' : 'bg-white/20'
                        }`}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full m-1"
                          animate={{ x: settings.showDamageNumbers ? 20 : 0 }}
                        />
                      </button>
                    </div>

                    <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                      <h4 className="text-white font-bold mb-2">⌨️ Keyboard Shortcuts</h4>
                      <div className="space-y-1 text-sm text-white/80">
                        <div><kbd className="px-2 py-1 bg-white/10 rounded">1-4</kbd> Select move</div>
                        <div><kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> Confirm</div>
                        <div><kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> Cancel/Menu</div>
                        <div><kbd className="px-2 py-1 bg-white/10 rounded">I</kbd> Inventory</div>
                        <div><kbd className="px-2 py-1 bg-white/10 rounded">S</kbd> Settings</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DATA TAB */}
                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-bold">Auto-Save</div>
                        <div className="text-white/60 text-sm">Automatically save every 30 seconds</div>
                      </div>
                      <button
                        onClick={() => updateSetting('autosaveEnabled', !settings.autosaveEnabled)}
                        className={`w-14 h-8 rounded-full transition-all ${
                          settings.autosaveEnabled ? 'bg-gaming-accent' : 'bg-white/20'
                        }`}
                      >
                        <motion.div
                          className="w-6 h-6 bg-white rounded-full m-1"
                          animate={{ x: settings.autosaveEnabled ? 20 : 0 }}
                        />
                      </button>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="text-xl font-bold text-white mb-2">Save Data</h3>
                      <div className="text-white/70 text-sm space-y-1">
                        <div>Slots used: {saveStats.usedSlots}/{saveStats.totalSlots}</div>
                        <div>Storage used: {saveStats.storageUsedKB} KB</div>
                        {saveStats.hasAutoSave && <div>✅ Auto-save available</div>}
                      </div>
                    </div>

                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <h3 className="text-xl font-bold text-red-400 mb-2">⚠️ Danger Zone</h3>
                      <p className="text-white/70 text-sm mb-4">
                        This will delete ALL save data including auto-saves. This action cannot be undone!
                      </p>
                      {!showClearConfirm ? (
                        <Button
                          variant="danger"
                          onClick={() => setShowClearConfirm(true)}
                        >
                          🗑️ Clear All Data
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="danger"
                            onClick={handleClearAllData}
                            className="flex-1"
                          >
                            ⚠️ Confirm Delete
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setShowClearConfirm(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-center text-white/50 text-sm">
              PokéBattle Tower v2.0 • Built with React + Vite
            </p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
