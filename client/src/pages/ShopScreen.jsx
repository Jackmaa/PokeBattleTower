// 📁 ShopScreen.jsx
// Shop screen - Purchase items with currency

import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import { currencyState, inventoryState } from '../recoil/atoms/inventory';
import { Button, Card } from '../components/ui';
import {
  getAvailableShopItems,
  getItemsByCategory,
  getCategoryDisplayName,
  getRarityColor,
  getRarityGlow,
  ITEM_CATEGORIES,
} from '../utils/items';

export default function ShopScreen({ onComplete }) {
  const [currency, setCurrency] = useRecoilState(currencyState);
  const [inventory, setInventory] = useRecoilState(inventoryState);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [purchaseAnimation, setPurchaseAnimation] = useState(null);

  // Get available shop items
  const availableItems = getAvailableShopItems();

  // Filter by category
  const displayedItems = selectedCategory === 'all'
    ? availableItems
    : availableItems.filter(item => item.category === selectedCategory);

  // Get unique categories from available items
  const availableCategories = [...new Set(availableItems.map(item => item.category))];

  const handlePurchase = (item) => {
    if (currency >= item.price) {
      // Deduct currency
      setCurrency(prev => prev - item.price);

      // Add to inventory
      setInventory(prev => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + 1,
      }));

      // Trigger purchase animation
      setPurchaseAnimation(item.id);
      setTimeout(() => setPurchaseAnimation(null), 1000);

      console.log(`[Shop] Purchased ${item.name} for ${item.price} gold`);
    }
  };

  const canAfford = (price) => currency >= price;

  const getItemQuantity = (itemId) => inventory[itemId] || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gaming-darker via-gaming-dark to-gaming-darker p-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🏪
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
            Item Shop
          </h1>
          <div className="flex items-center justify-center gap-2 text-2xl">
            <span className="text-white/70">Your Gold:</span>
            <motion.span
              key={currency}
              className="text-yellow-400 font-bold"
              initial={{ scale: 1.3, color: '#fbbf24' }}
              animate={{ scale: 1, color: '#fbbf24' }}
            >
              💰 {currency}
            </motion.span>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex justify-center gap-2 mb-8 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            onClick={() => setSelectedCategory('all')}
          >
            All Items
          </Button>
          {availableCategories.map(category => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryDisplayName(category)}
            </Button>
          ))}
        </motion.div>

        {/* Items Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            {displayedItems.length === 0 ? (
              <div className="text-center py-12 text-white/50">
                <p className="text-xl">No items available in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedItems.map((item, index) => {
                  const quantity = getItemQuantity(item.id);
                  const affordable = canAfford(item.price);
                  const isPurchasing = purchaseAnimation === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="relative"
                    >
                      <div
                        className={`bg-gradient-to-br ${getRarityColor(item.rarity)} rounded-xl p-4 border-2 border-white/20 relative overflow-hidden transition-all duration-300 ${
                          affordable ? 'hover:scale-105 hover:border-white/40' : 'opacity-60'
                        }`}
                        style={{
                          boxShadow: affordable ? `0 0 20px ${getRarityGlow(item.rarity)}` : 'none',
                        }}
                      >
                        {/* Rarity Badge */}
                        <div className="absolute top-2 right-2">
                          <span className="text-xs px-2 py-1 bg-black/40 rounded-full font-bold uppercase">
                            {item.rarity}
                          </span>
                        </div>

                        {/* Quantity Badge */}
                        {quantity > 0 && (
                          <div className="absolute top-2 left-2">
                            <span className="text-xs px-2 py-1 bg-green-600/80 rounded-full font-bold">
                              Owned: {quantity}
                            </span>
                          </div>
                        )}

                        {/* Item Icon */}
                        <div className="text-6xl mb-3 text-center">{item.icon}</div>

                        {/* Item Name */}
                        <h3 className="text-xl font-bold mb-2 text-white text-center">
                          {item.name}
                        </h3>

                        {/* Item Description */}
                        <p className="text-white/80 text-sm mb-4 text-center min-h-[40px]">
                          {item.description}
                        </p>

                        {/* Price and Buy Button */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-xl">💰</span>
                            <span className={`text-lg font-bold ${affordable ? 'text-yellow-400' : 'text-red-400'}`}>
                              {item.price}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handlePurchase(item)}
                            disabled={!affordable || isPurchasing}
                            className={`${
                              affordable
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                                : 'bg-gray-600 cursor-not-allowed'
                            }`}
                          >
                            {isPurchasing ? (
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                              >
                                ✨
                              </motion.span>
                            ) : affordable ? (
                              '🛒 Buy'
                            ) : (
                              '🚫 Too Expensive'
                            )}
                          </Button>
                        </div>

                        {/* Purchase Animation */}
                        <AnimatePresence>
                          {isPurchasing && (
                            <motion.div
                              className="absolute inset-0 bg-green-500/30 rounded-xl flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <motion.div
                                className="text-6xl"
                                initial={{ scale: 0.5, rotate: -180 }}
                                animate={{ scale: 1.5, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                              >
                                ✅
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Leave Shop Button */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={onComplete}
            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
          >
            ⬅️ Leave Shop
          </Button>
        </motion.div>

        {/* Shop Tip */}
        <motion.p
          className="text-center text-white/50 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          💡 Tip: Items can be used between battles or during combat to give you an edge!
        </motion.p>
      </div>
    </div>
  );
}
