import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRAINER_SKILLS } from '../utils/playerProgression';

export default function TrainerSkillsBar({ 
  unlockedSkills, 
  cooldowns, 
  onUseSkill, 
  isPlayerTurn,
  activeEffects 
}) {
  if (!unlockedSkills || unlockedSkills.length === 0) return null;

  return (
    <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
      {unlockedSkills.map(skillId => {
        const skill = TRAINER_SKILLS[skillId];
        if (!skill) return null;

        const cooldown = cooldowns[skillId] || 0;
        const isReady = cooldown === 0;
        const isActive = activeEffects && activeEffects[skillId];

        return (
          <div key={skillId} className="relative group">
            <motion.button
              onClick={() => isReady && isPlayerTurn && onUseSkill(skillId)}
              className={`
                w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl
                transition-all duration-200 shadow-lg
                ${isReady && isPlayerTurn 
                  ? 'bg-gray-900 border-white hover:scale-110 hover:border-yellow-400 cursor-pointer' 
                  : 'bg-gray-800 border-gray-600 opacity-60 cursor-not-allowed grayscale'}
                ${isActive ? 'ring-4 ring-blue-500 ring-opacity-70' : ''}
              `}
              whileHover={isReady && isPlayerTurn ? { y: -5 } : {}}
              whileTap={isReady && isPlayerTurn ? { scale: 0.9 } : {}}
            >
              {skill.icon}
              
              {/* Cooldown Overlay */}
              {!isReady && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{cooldown}</span>
                </div>
              )}
            </motion.button>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
              <div className="bg-gray-900/90 backdrop-blur border border-gray-600 rounded-lg p-2 text-center text-sm shadow-xl">
                <div className="font-bold text-white mb-1">{skill.name}</div>
                <div className="text-gray-300 text-xs mb-1">{skill.description}</div>
                <div className="text-blue-400 text-xs font-bold">Cooldown: {skill.cooldown} turns</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
