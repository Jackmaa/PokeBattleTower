// 📁 InventoryPanel.jsx
// Inventory display panel for use in combat

import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { inventoryState } from '../recoil/atoms/inventory';
import { getItemById } from '../utils/items';
import { Card } from './ui';
import RelicsPanel from './RelicsPanel';

export default function InventoryPanel({ onUseItem, disabled = false }) {
  const inventory = useRecoilValue(inventoryState);
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'relics'
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Get items from inventory with their details
  const inventoryItems = Object.entries(inventory)
    .filter(([itemId, quantity]) => quantity > 0)
    .map(([itemId, quantity]) => ({
      ...getItemById(itemId),
      quantity,
    }))
    .filter(item => item.id); // Filter out items that don't exist

  // Group items by category
  const itemsByCategory = inventoryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleUseItem = (item) => {
    if (!disabled && onUseItem) {
      onUseItem(item);
    }
  };

  if (inventoryItems.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-2">🎒 Inventory</h3>
          <p className="text-white/50 text-sm">No items</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 pb-2 text-center font-bold transition-colors relative ${
            activeTab === 'items' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Items
          {activeTab === 'items' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-blue-500"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('relics')}
          className={`flex-1 pb-2 text-center font-bold transition-colors relative ${
            activeTab === 'relics' ? 'text-white' : 'text-white/40 hover:text-white/60'
          }`}
        >
          Relics
          {activeTab === 'relics' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-purple-500"
            />
          )}
        </button>
      </div>

      {activeTab === 'items' ? (
        <>
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            🎒 Inventory
            <span className="text-sm text-white/50">({inventoryItems.length} types)</span>
          </h3>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {inventoryItems.length === 0 ? (
              <div className="text-center py-8 text-white/30 italic">
                No items in bag
              </div>
            ) : (
              inventoryItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleUseItem(item)}
                  disabled={disabled}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    disabled
                      ? 'bg-white/5 cursor-not-allowed opacity-50'
                      : 'bg-white/10 hover:bg-white/20 cursor-pointer'
                  }`}
                  whileHover={disabled ? {} : { scale: 1.02 }}
                  whileTap={disabled ? {} : { scale: 0.98 }}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Item info */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm truncate">
                          {item.name}
                        </div>
                        <div className="text-white/60 text-xs truncate">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {/* Quantity badge */}
                    <div className="flex-shrink-0">
                      <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          <RelicsPanel compact={false} />
        </div>
      )}

      {disabled && (
        <p className="text-white/40 text-xs text-center mt-2">
          ⏸️ Wait for your turn
        </p>
      )}
    </Card>
  );
}
