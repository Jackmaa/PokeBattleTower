import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  STARTER_SHOP,
  loadProgression,
  canBuyStarter,
  buyStarter,
  getPlayerTitle,
} from '../utils/playerProgression';
import { getStarterInfo } from '../utils/getStarterPokemon';
import typeColors from '../utils/typeColors';

// Extended starter data with Pokedex IDs for new starters
const EXTENDED_STARTERS = {
  charizard: { id: 6, name: 'Charizard', icon: '🔥', types: ['fire', 'flying'] },
  blastoise: { id: 9, name: 'Blastoise', icon: '💧', types: ['water'] },
  venusaur: { id: 3, name: 'Venusaur', icon: '🌿', types: ['grass', 'poison'] },
  pikachu: { id: 25, name: 'Pikachu', icon: '⚡', types: ['electric'] },
  gengar: { id: 94, name: 'Gengar', icon: '👻', types: ['ghost', 'poison'] },
  dragonite: { id: 149, name: 'Dragonite', icon: '🐉', types: ['dragon', 'flying'] },
  tyranitar: { id: 248, name: 'Tyranitar', icon: '🪨', types: ['rock', 'dark'] },
  metagross: { id: 376, name: 'Metagross', icon: '🤖', types: ['steel', 'psychic'] },
  garchomp: { id: 445, name: 'Garchomp', icon: '🦈', types: ['dragon', 'ground'] },
  lucario: { id: 448, name: 'Lucario', icon: '🥊', types: ['fighting', 'steel'] },
  salamence: { id: 373, name: 'Salamence', icon: '🐲', types: ['dragon', 'flying'] },
  mewtwo: { id: 150, name: 'Mewtwo', icon: '🧬', types: ['psychic'] },
};

function StarterCard({ starterId, shopConfig, starterInfo, isOwned, progression, onBuy, sprite }) {
  const [showDetails, setShowDetails] = useState(false);

  const { canBuy, reason, price } = canBuyStarter(progression, starterId);
  const isLocked = shopConfig.levelRequired && progression.level < shopConfig.levelRequired;

  const types = starterInfo?.types || [];

  return (
    <motion.div
      className={`
        relative bg-gray-800/50 rounded-xl border-2 overflow-hidden
        transition-all duration-300
        ${isOwned ? 'border-green-500/50' : isLocked ? 'border-gray-600' : 'border-gray-600 hover:border-amber-500/50'}
      `}
      whileHover={{ scale: isOwned ? 1 : 1.02 }}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Owned badge */}
      {isOwned && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          OWNED
        </div>
      )}

      {/* Locked overlay */}
      {isLocked && !isOwned && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <div className="text-center">
            <span className="text-4xl">🔒</span>
            <div className="text-gray-400 text-sm mt-2">
              Requires Lv.{shopConfig.levelRequired}
            </div>
          </div>
        </div>
      )}

      {/* Sprite Section */}
      <div
        className="h-32 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${typeColors[types[0]] || '#374151'}33, ${typeColors[types[1] || types[0]] || '#374151'}33)`
        }}
      >
        {sprite ? (
          <img
            src={sprite}
            alt={starterInfo?.name}
            className="w-24 h-24 pixelated"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <span className="text-6xl">{starterInfo?.icon}</span>
        )}

        {/* Type badges */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {types.map(type => (
            <span
              key={type}
              className="text-xs px-2 py-0.5 rounded-full text-white capitalize"
              style={{ backgroundColor: typeColors[type] || '#6b7280' }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3">
        <div className="font-bold text-white capitalize text-lg">
          {starterInfo?.name || starterId}
        </div>

        {shopConfig.description && (
          <div className="text-gray-400 text-xs mt-1 line-clamp-2">
            {shopConfig.description}
          </div>
        )}

        {/* Price / Buy Button */}
        {!isOwned && (
          <div className="mt-3">
            {isLocked ? (
              <div className="text-gray-500 text-sm text-center py-2">
                Level {shopConfig.levelRequired} required
              </div>
            ) : (
              <button
                onClick={() => canBuy && onBuy(starterId)}
                disabled={!canBuy}
                className={`
                  w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2
                  transition-all duration-200
                  ${canBuy
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <span className="text-lg">🪙</span>
                <span>{shopConfig.price}</span>
              </button>
            )}

            {!canBuy && !isLocked && reason && (
              <div className="text-red-400 text-xs text-center mt-1">
                {reason}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function StarterShop({ onClose }) {
  const [progression, setProgression] = useState(loadProgression());
  const [sprites, setSprites] = useState({});
  const [loading, setLoading] = useState(true);
  const [purchaseAnimation, setPurchaseAnimation] = useState(null);

  const title = getPlayerTitle(progression.level);

  // Fetch sprites for all starters
  useEffect(() => {
    async function fetchSprites() {
      const spriteMap = {};
      for (const [starterId, info] of Object.entries(EXTENDED_STARTERS)) {
        try {
          const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${info.id}`);
          spriteMap[starterId] = res.data.sprites.front_default;
        } catch (err) {
          console.error(`Failed to fetch sprite for ${starterId}`);
        }
      }
      setSprites(spriteMap);
      setLoading(false);
    }
    fetchSprites();
  }, []);

  const handleBuy = (starterId) => {
    const result = buyStarter(progression, starterId);
    if (result.success) {
      setProgression(result.progression);
      setPurchaseAnimation(starterId);
      setTimeout(() => setPurchaseAnimation(null), 1500);
    }
  };

  const ownedCount = progression.unlockedStarters.length;
  const totalCount = Object.keys(STARTER_SHOP).length;

  // Categorize starters
  const defaultStarters = ['charizard', 'blastoise', 'venusaur'];
  const premiumStarters = Object.keys(STARTER_SHOP).filter(
    id => !defaultStarters.includes(id)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl border border-gray-700 max-w-5xl w-full max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🏪</span>
                <span>Starter Shop</span>
              </h2>
              <div className="text-amber-200 text-sm">
                Collect powerful Pokémon with Tower Tokens
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white font-bold flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <span className="text-xl">{progression.towerTokens}</span>
                </div>
                <div className="text-amber-200 text-xs">
                  Tower Tokens
                </div>
              </div>

              <div className="text-right">
                <div className="text-white font-bold">
                  {ownedCount}/{totalCount}
                </div>
                <div className="text-amber-200 text-xs">
                  Collected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Default Starters */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span>🌟</span> Classic Starters
                  <span className="text-xs text-gray-400 font-normal">(Free)</span>
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                  {defaultStarters.map(starterId => (
                    <StarterCard
                      key={starterId}
                      starterId={starterId}
                      shopConfig={STARTER_SHOP[starterId]}
                      starterInfo={EXTENDED_STARTERS[starterId]}
                      isOwned={progression.unlockedStarters.includes(starterId)}
                      progression={progression}
                      onBuy={handleBuy}
                      sprite={sprites[starterId]}
                    />
                  ))}
                </div>
              </div>

              {/* Premium Starters */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span>👑</span> Premium Starters
                  <span className="text-xs text-gray-400 font-normal">(Requires Tokens)</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {premiumStarters.map(starterId => (
                    <StarterCard
                      key={starterId}
                      starterId={starterId}
                      shopConfig={STARTER_SHOP[starterId]}
                      starterInfo={EXTENDED_STARTERS[starterId]}
                      isOwned={progression.unlockedStarters.includes(starterId)}
                      progression={progression}
                      onBuy={handleBuy}
                      sprite={sprites[starterId]}
                    />
                  ))}
                </div>
              </div>

              {/* How to earn tokens */}
              <div className="mt-6 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                  <span>💡</span> How to earn Tower Tokens
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-gray-300">
                    <span className="text-amber-400">+5</span> Complete a run
                  </div>
                  <div className="text-gray-300">
                    <span className="text-amber-400">+20</span> Win a run
                  </div>
                  <div className="text-gray-300">
                    <span className="text-amber-400">+3</span> Defeat a boss
                  </div>
                  <div className="text-gray-300">
                    <span className="text-amber-400">+2</span> Daily login
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 flex justify-between items-center">
          <div className="text-gray-400 text-sm">
            {title.icon} {title.title} • Level {progression.level}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>

        {/* Purchase Animation */}
        <AnimatePresence>
          {purchaseAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 rounded-2xl">
                <div className="text-4xl text-center mb-2">🎉</div>
                <div className="text-white text-xl font-bold">
                  {EXTENDED_STARTERS[purchaseAnimation]?.name} Unlocked!
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
