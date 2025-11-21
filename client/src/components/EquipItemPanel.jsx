// 📁 EquipItemPanel.jsx
// Panel for equipping held items to Pokemon

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui';
import PokemonCard from './PokemonCard';
import { getItemById } from '../utils/items';

export default function EquipItemPanel({ team, inventory, onEquipItem, onUnequipItem, onClose }) {
  const [selectedPokemonIndex, setSelectedPokemonIndex] = useState(null);
  const [showItemList, setShowItemList] = useState(false);

  // Get equippable items from inventory (held items, mega stones, berries)
  const equippableItems = Object.entries(inventory)
    .filter(([itemId, quantity]) => quantity > 0)
    .map(([itemId, quantity]) => ({
      ...getItemById(itemId),
      quantity,
    }))
    .filter(item =>
      item && (
        item.category === 'held_items' ||
        item.category === 'mega_stones' ||
        item.category === 'berries'
      )
    );

  const handlePokemonClick = (index) => {
    setSelectedPokemonIndex(index);
    setShowItemList(true);
  };

  const handleEquipItem = (item) => {
    if (selectedPokemonIndex !== null) {
      onEquipItem(selectedPokemonIndex, item);
      setShowItemList(false);
      setSelectedPokemonIndex(null);
    }
  };

  const handleUnequip = (pokemonIndex) => {
    onUnequipItem(pokemonIndex);
  };

  if (equippableItems.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">⚙️ Equip Items</h3>
          <p className="text-white/60">
            No equippable items in inventory.
            <br />
            Buy Mega Stones, Held Items, or Berries from the shop!
          </p>
          <button
            onClick={onClose}
            className="mt-4 btn-primary px-6 py-2"
          >
            Close
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-purple-400">
            ⚙️ Equip Items to Pokémon
          </h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <p className="text-white/70 mb-4 text-center">
          Click on a Pokémon to equip an item
        </p>

        {/* Pokemon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {team.map((poke, i) => (
            <div key={poke.id} className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePokemonClick(i)}
                className="cursor-pointer"
              >
                <PokemonCard poke={poke} mode="default" />

                {/* Show equipped item */}
                {poke.heldItem && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <motion.button
                      className="bg-red-600 hover:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow-lg border-2 border-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnequip(i);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Unequip item"
                    >
                      ✕
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Display equipped item name */}
              {poke.heldItem && (
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/80 rounded-full">
                    <span className="text-sm">{getItemById(poke.heldItem)?.icon}</span>
                    <span className="text-xs text-white font-semibold">
                      {getItemById(poke.heldItem)?.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Item Selection Modal */}
      <AnimatePresence>
        {showItemList && selectedPokemonIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowItemList(false)}
          >
            <motion.div
              className="max-w-2xl w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Select Item for {team[selectedPokemonIndex].name}
                    </h3>
                    <p className="text-white/60 text-sm">
                      Choose an item to equip
                    </p>
                  </div>
                  <button
                    onClick={() => setShowItemList(false)}
                    className="text-white/60 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {equippableItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleEquipItem(item)}
                      className="w-full p-3 rounded-lg text-left bg-white/10 hover:bg-white/20 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-3xl">{item.icon}</span>
                          <div className="flex-1">
                            <div className="text-white font-semibold">
                              {item.name}
                            </div>
                            <div className="text-white/60 text-xs">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                          x{item.quantity}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
