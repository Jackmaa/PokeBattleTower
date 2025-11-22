// RelicShopPage.jsx
// Permanent relic collection shop - Buy, sell, and equip relics with permanent gold
// 100% localStorage - no backend required

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RELICS,
  RELIC_TIERS,
  getRelicById,
  getRelicTierColor,
} from '../utils/relics';
import {
  RELIC_PRICES,
  getRelicBuyPrice,
  getRelicSellPrice,
  getNextSlotPrice,
  MAX_SLOTS,
  getCollectionStats,
} from '../utils/relicCollection';
import {
  getMetaProgress,
  getRelicCollection,
  purchaseRelic,
  sellRelic,
  equipRelic,
  unequipRelic,
  purchaseSlot,
} from '../utils/metaProgression';

// Tab definitions
const TABS = {
  SHOP: 'shop',
  COLLECTION: 'collection',
  EQUIPPED: 'equipped',
};

// Relic Card Component
function RelicCard({
  relic,
  action,
  actionLabel,
  actionDisabled,
  actionColor = 'blue',
  showPrice,
  price,
  isEquipped,
  onAction,
}) {
  const tierColor = getRelicTierColor(relic.tier);

  return (
    <motion.div
      className={`relative p-3 rounded-lg border-2 transition-all ${
        isEquipped ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-gray-900' : ''
      }`}
      style={{
        borderColor: tierColor,
        backgroundColor: `${tierColor}15`,
      }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      {/* Tier Badge */}
      <div
        className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase"
        style={{ backgroundColor: tierColor, color: '#fff' }}
      >
        {relic.tier}
      </div>

      {/* Equipped Badge */}
      {isEquipped && (
        <div className="absolute -top-2 -left-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          ✓
        </div>
      )}

      {/* Icon */}
      <div className="text-3xl mb-1 text-center">{relic.icon}</div>

      {/* Name */}
      <h3 className="font-bold text-white text-center text-sm mb-1">{relic.name}</h3>

      {/* Description */}
      <p className="text-xs text-white/60 text-center mb-2 line-clamp-2">
        {relic.description}
      </p>

      {/* Price */}
      {showPrice && (
        <div className="text-center mb-2">
          <span className="text-yellow-400 font-bold text-sm">
            {price}g
          </span>
        </div>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={() => onAction(relic)}
          disabled={actionDisabled}
          className={`w-full text-xs py-1.5 rounded font-bold transition-all ${
            actionDisabled
              ? 'bg-gray-600 cursor-not-allowed text-gray-400'
              : actionColor === 'green'
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : actionColor === 'red'
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : actionColor === 'yellow'
              ? 'bg-yellow-600 hover:bg-yellow-500 text-black'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

export default function RelicShopPage({ onClose }) {
  const [activeTab, setActiveTab] = useState(TABS.SHOP);
  const [collection, setCollection] = useState({
    discovered: [],
    owned: [],
    equipped: [],
    slots: 1,
  });
  const [permanentGold, setPermanentGold] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [selectedTier, setSelectedTier] = useState('all');

  // Load collection from localStorage on mount
  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = () => {
    const metaProgress = getMetaProgress();
    setPermanentGold(metaProgress.permanentGold || 0);
    setCollection(getRelicCollection());
    setLoading(false);
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Purchase a discovered relic
  const handlePurchase = (relic) => {
    const price = getRelicBuyPrice(relic.id);
    const result = purchaseRelic(relic.id, price);

    if (result.success) {
      setCollection(result.relicCollection);
      setPermanentGold(result.permanentGold);
      showMessage(`Purchased ${relic.name}!`, 'success');
    } else {
      showMessage(result.message || 'Purchase failed', 'error');
    }
  };

  // Sell an owned relic
  const handleSell = (relic) => {
    const price = getRelicSellPrice(relic.id);
    const result = sellRelic(relic.id, price);

    if (result.success) {
      setCollection(result.relicCollection);
      setPermanentGold(result.permanentGold);
      showMessage(`Sold ${relic.name} for ${price}g!`, 'success');
    } else {
      showMessage(result.message || 'Sell failed', 'error');
    }
  };

  // Equip a relic
  const handleEquip = (relic) => {
    const result = equipRelic(relic.id);

    if (result.success) {
      setCollection(result.relicCollection);
      showMessage(`Equipped ${relic.name}!`, 'success');
    } else {
      showMessage(result.message || 'Equip failed', 'error');
    }
  };

  // Unequip a relic
  const handleUnequip = (relic) => {
    const result = unequipRelic(relic.id);

    if (result.success) {
      setCollection(result.relicCollection);
      showMessage(`Unequipped ${relic.name}`, 'success');
    } else {
      showMessage(result.message || 'Unequip failed', 'error');
    }
  };

  // Purchase additional slot
  const handlePurchaseSlot = () => {
    const price = getNextSlotPrice(collection.slots);
    if (price < 0) {
      showMessage('Maximum slots reached!', 'error');
      return;
    }

    const result = purchaseSlot(price);

    if (result.success) {
      setCollection(result.relicCollection);
      setPermanentGold(result.permanentGold);
      showMessage(`Purchased slot ${result.relicCollection.slots}!`, 'success');
    } else {
      showMessage(result.message || 'Purchase failed', 'error');
    }
  };

  // Get relics available for purchase (discovered but not owned)
  const getShopRelics = () => {
    return collection.discovered
      .filter(id => !collection.owned.includes(id))
      .map(id => getRelicById(id))
      .filter(r => r)
      .filter(r => selectedTier === 'all' || r.tier === selectedTier);
  };

  // Get owned relics
  const getOwnedRelics = () => {
    return collection.owned
      .map(id => getRelicById(id))
      .filter(r => r)
      .filter(r => selectedTier === 'all' || r.tier === selectedTier);
  };

  // Get equipped relics
  const getEquippedRelics = () => {
    return collection.equipped
      .map(id => getRelicById(id))
      .filter(r => r);
  };

  const stats = getCollectionStats(collection);
  const nextSlotPrice = getNextSlotPrice(collection.slots);

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
        {/* Message Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              className={`absolute top-4 right-4 px-4 py-2 rounded-lg font-bold z-50 ${
                message.type === 'error' ? 'bg-red-500' : 'bg-green-500'
              } text-white`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span>💎</span>
                <span>Relic Collection</span>
              </h2>
              <div className="text-emerald-200 mt-1">
                Equip relics to start runs with bonuses
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-300 flex items-center gap-2">
                <span>💰</span>
                {permanentGold}
              </div>
              <div className="text-emerald-200 text-sm">
                Permanent Gold
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-4 flex gap-6 text-sm">
            <div className="bg-black/20 px-3 py-1 rounded-lg">
              <span className="text-emerald-200">Discovered:</span>{' '}
              <span className="text-white font-bold">{stats.discoveredCount}/{stats.totalRelics}</span>
            </div>
            <div className="bg-black/20 px-3 py-1 rounded-lg">
              <span className="text-emerald-200">Owned:</span>{' '}
              <span className="text-white font-bold">{stats.ownedCount}</span>
            </div>
            <div className="bg-black/20 px-3 py-1 rounded-lg">
              <span className="text-emerald-200">Equipped:</span>{' '}
              <span className="text-white font-bold">{stats.equippedCount}/{collection.slots}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-4 border-b border-gray-700 flex gap-2">
          {Object.entries(TABS).map(([key, value]) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                activeTab === value
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {key === 'SHOP' && '🛒 '}
              {key === 'COLLECTION' && '📚 '}
              {key === 'EQUIPPED' && '⚔️ '}
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </button>
          ))}

          {/* Tier Filter */}
          {activeTab !== TABS.EQUIPPED && (
            <div className="ml-auto flex gap-1">
              <button
                onClick={() => setSelectedTier('all')}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  selectedTier === 'all' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-500'
                }`}
              >
                All
              </button>
              {Object.values(RELIC_TIERS).map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className="px-3 py-1 rounded text-xs font-bold"
                  style={{
                    backgroundColor: selectedTier === tier ? getRelicTierColor(tier) : '#1f2937',
                    color: selectedTier === tier ? '#fff' : '#6b7280',
                  }}
                >
                  {tier.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[55vh]">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : (
            <>
              {/* Shop Tab */}
              {activeTab === TABS.SHOP && (
                <div>
                  {getShopRelics().length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">🔍</div>
                      <p>No relics available for purchase.</p>
                      <p className="text-sm mt-2">Discover more relics during your runs!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {getShopRelics().map(relic => (
                        <RelicCard
                          key={relic.id}
                          relic={relic}
                          action="purchase"
                          actionLabel={`Buy ${getRelicBuyPrice(relic.id)}g`}
                          actionDisabled={permanentGold < getRelicBuyPrice(relic.id)}
                          actionColor="green"
                          showPrice
                          price={getRelicBuyPrice(relic.id)}
                          onAction={handlePurchase}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Collection Tab */}
              {activeTab === TABS.COLLECTION && (
                <div>
                  {getOwnedRelics().length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📦</div>
                      <p>You don't own any relics yet.</p>
                      <p className="text-sm mt-2">Purchase discovered relics from the shop!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {getOwnedRelics().map(relic => {
                        const isEquipped = collection.equipped.includes(relic.id);
                        return (
                          <RelicCard
                            key={relic.id}
                            relic={relic}
                            action={isEquipped ? 'unequip' : 'equip'}
                            actionLabel={isEquipped ? 'Unequip' : 'Equip'}
                            actionDisabled={!isEquipped && collection.equipped.length >= collection.slots}
                            actionColor={isEquipped ? 'yellow' : 'blue'}
                            isEquipped={isEquipped}
                            onAction={isEquipped ? handleUnequip : handleEquip}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Equipped Tab */}
              {activeTab === TABS.EQUIPPED && (
                <div>
                  {/* Slot Grid */}
                  <div className="flex gap-3 mb-6 justify-center">
                    {Array.from({ length: MAX_SLOTS }).map((_, index) => {
                      const relic = getEquippedRelics()[index];
                      const isUnlocked = index < collection.slots;

                      return (
                        <div
                          key={index}
                          className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center ${
                            isUnlocked
                              ? relic
                                ? 'border-green-500 bg-green-500/10'
                                : 'border-gray-600 bg-gray-800/50 border-dashed'
                              : 'border-gray-700 bg-gray-900/50'
                          }`}
                        >
                          {isUnlocked ? (
                            relic ? (
                              <div className="text-center">
                                <div className="text-2xl">{relic.icon}</div>
                                <div className="text-[10px] text-white truncate px-1">{relic.name}</div>
                              </div>
                            ) : (
                              <div className="text-gray-600 text-xs">Empty</div>
                            )
                          ) : (
                            <div className="text-gray-600">🔒</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Buy Slot Button */}
                  {collection.slots < MAX_SLOTS && (
                    <div className="text-center mb-6">
                      <button
                        onClick={handlePurchaseSlot}
                        disabled={permanentGold < nextSlotPrice}
                        className={`px-6 py-2 rounded-lg font-bold ${
                          permanentGold < nextSlotPrice
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        Buy Slot ({nextSlotPrice}g)
                      </button>
                    </div>
                  )}

                  {/* Equipped Relics */}
                  {getEquippedRelics().length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {getEquippedRelics().map(relic => (
                        <RelicCard
                          key={relic.id}
                          relic={relic}
                          action="unequip"
                          actionLabel="Unequip"
                          actionColor="yellow"
                          isEquipped
                          onAction={handleUnequip}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No relics equipped.</p>
                      <p className="text-sm mt-2">Equip relics from your collection!</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {activeTab === TABS.SHOP && 'Relics you\'ve found can be purchased here'}
            {activeTab === TABS.COLLECTION && 'Equip relics or sell for 50% value'}
            {activeTab === TABS.EQUIPPED && 'Equipped relics activate at run start'}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
