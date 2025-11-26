import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useKeyboardNavigation from "../hooks/useKeyboardNavigation";
import { keybindManager, getGridNumber } from "../utils/keybindConfig";
import FocusIndicator from "./keyboard/FocusIndicator";

const BattleMenu = ({ onSelectAction, disabled = false, currentFloor = 1, unlockedSkills = [] }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const menuOptions = [
    { id: "fight", label: "FIGHT", icon: "⚔️", color: "cyan" },
    { id: "skills", label: "SKILLS", icon: "✨", color: "violet" },
    { id: "bag", label: "BAG", icon: "🎒", color: "magenta" },
    { id: "run", label: "RUN", icon: "🏃", color: "red" },
  ];

  // Configuration de la navigation clavier
  const {
    selectedIndex,
    isKeyboardFocused,
    getItemProps,
  } = useKeyboardNavigation({
    items: menuOptions,
    enabled: !disabled && isExpanded && keybindManager.isEnabled(),
    layout: 'grid',
    columns: 2,
    onSelect: (option) => {
      if (!disabled) {
        onSelectAction(option.id);
      }
    },
    customKeys: keybindManager.getBattleMenuCustomKeys(),
    enableNumberKeys: true,
    loop: true,
  });

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="battle-menu pointer-events-none"
    >
      <div className="flex flex-col items-center pointer-events-auto">
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-2 w-12 h-8 flex items-center justify-center rounded-t-lg bg-black/60 backdrop-blur-md border-t-2 border-x-2 border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-all"
        >
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ^
          </motion.span>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="glass-card p-4 w-full">
                {/* Floor Indicator - Minimal and centered */}
                <div className="text-center mb-3 opacity-60">
                  <span className="text-xs font-display tracking-widest text-white/80">
                    FLOOR {currentFloor}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {menuOptions.map((option, index) => {
                    const isSelected = index === selectedIndex && isKeyboardFocused;
                    const keyNumber = getGridNumber(index);

                    return (
                      <FocusIndicator key={option.id} isVisible={isSelected} color="blue" animated>
                        <motion.button
                          {...getItemProps(index)}
                          onClick={() => !disabled && onSelectAction(option.id)}
                          disabled={disabled}
                          className={`battle-menu-btn battle-menu-btn-${option.color} relative`}
                          whileHover={{ scale: disabled ? 1 : 1.05 }}
                          whileTap={{ scale: disabled ? 1 : 0.95 }}
                        >
                          {/* Indicateur de touche numérique */}
                          <div className="absolute top-1 left-1 text-xs opacity-50 font-mono bg-black/30 px-1 rounded">
                            {keyNumber}
                          </div>
                          <span className="text-2xl mb-1">{option.icon}</span>
                          <span className="font-bold tracking-wider">
                            {option.label}
                          </span>
                        </motion.button>
                      </FocusIndicator>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BattleMenu;
