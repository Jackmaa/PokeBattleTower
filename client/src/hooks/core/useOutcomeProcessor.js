// useOutcomeProcessor.js
// Custom hook for processing event outcomes

import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { inventoryState, currencyState } from '../../recoil/atoms/inventory';
import { relicsState } from '../../recoil/atoms/relics';
import { getRandomRelic, RELIC_TIERS } from '../../utils/relics';
import { discoverRelic } from '../../utils/metaProgression';
import { useAudio } from '../useAudio';
import { usePokemonStateManager } from './usePokemonStateManager';

/**
 * Hook for processing event outcomes (heal, damage, stat boosts, items, etc.)
 * Centralizes outcome handling logic from EventScreen
 *
 * @param {Function} setTeam - State setter for team
 * @param {Function} setHighlight - State setter for highlight (optional)
 * @param {Function} setNewRelic - State setter for new relic display (optional)
 *
 * @returns {Object} - { applyOutcome }
 *
 * @example
 * const { applyOutcome } = useOutcomeProcessor(setTeam, setHighlight);
 * const messages = await applyOutcome({ type: 'heal_percent', value: 0.5, message: 'Healed!' });
 */
export function useOutcomeProcessor(setTeam, setHighlight = null, setNewRelic = null) {
  const [inventory, setInventory] = useRecoilState(inventoryState);
  const [currency, setCurrency] = useRecoilState(currencyState);
  const [relics, setRelics] = useRecoilState(relicsState);

  const { playHealSound, playDefeatSound, playLevelUpSound, playCatchSound } = useAudio();

  const {
    healAllPokemon,
    damageAllPokemon,
    boostStat,
    boostAllStats,
    decreaseStat,
  } = usePokemonStateManager(setTeam);

  const applyOutcome = useCallback(async (outcome, team = null) => {
    const messages = [];

    switch (outcome.type) {
      case 'heal_percent': {
        healAllPokemon(outcome.value);
        playHealSound();
        messages.push(outcome.message);
        break;
      }

      case 'damage_percent': {
        damageAllPokemon(outcome.value);
        playDefeatSound();
        messages.push(outcome.message);
        break;
      }

      case 'stat_boost': {
        if (!team) {
          console.warn('useOutcomeProcessor: team array required for stat_boost outcome');
          break;
        }

        const stats = ['attack', 'defense', 'special_attack', 'special_defense', 'speed'];
        const stat = outcome.stat === 'random' ? stats[Math.floor(Math.random() * stats.length)] : outcome.stat;
        const randomIndex = Math.floor(Math.random() * team.length);

        boostStat(randomIndex, stat, outcome.value);

        if (setHighlight) {
          setHighlight({ index: randomIndex, stat });
          playLevelUpSound();
          setTimeout(() => setHighlight(null), 3000);
        }

        messages.push(outcome.message);
        break;
      }

      case 'stat_boost_all': {
        if (!team) {
          console.warn('useOutcomeProcessor: team array required for stat_boost_all outcome');
          break;
        }

        const randomIndex = Math.floor(Math.random() * team.length);
        boostAllStats(randomIndex, outcome.value);

        if (setHighlight) {
          setHighlight({ index: randomIndex, stat: 'all' });
          playLevelUpSound();
          setTimeout(() => setHighlight(null), 3000);
        }

        messages.push(outcome.message);
        break;
      }

      case 'stat_decrease': {
        if (!team) {
          console.warn('useOutcomeProcessor: team array required for stat_decrease outcome');
          break;
        }

        const stats = ['attack', 'defense', 'special_attack', 'special_defense', 'speed'];
        const stat = outcome.stat === 'random' ? stats[Math.floor(Math.random() * stats.length)] : outcome.stat;
        const randomIndex = Math.floor(Math.random() * team.length);

        decreaseStat(randomIndex, stat, outcome.value);
        playDefeatSound();
        messages.push(outcome.message);
        break;
      }

      case 'gain_gold': {
        setCurrency(prev => prev + outcome.value);
        playCatchSound();
        messages.push(outcome.message);
        break;
      }

      case 'gain_relic': {
        const tier = outcome.tier === 'common' ? RELIC_TIERS.COMMON :
                     outcome.tier === 'uncommon' ? RELIC_TIERS.UNCOMMON :
                     outcome.tier === 'rare' ? RELIC_TIERS.RARE :
                     RELIC_TIERS.LEGENDARY;

        const relic = getRandomRelic(tier);
        if (relic) {
          setRelics(prev => [...prev, relic]);

          if (setNewRelic) {
            setNewRelic(relic);
          }

          playLevelUpSound();

          // Persist relic discovery to localStorage
          discoverRelic(relic.id);
        }
        messages.push(outcome.message);
        break;
      }

      case 'gain_item': {
        // Map item IDs to actual items
        let itemId = outcome.itemId;

        if (itemId === 'random_common') {
          const commonItems = ['potion', 'ether', 'antidote'];
          itemId = commonItems[Math.floor(Math.random() * commonItems.length)];
        } else if (itemId === 'random_rare') {
          const rareItems = ['max_potion', 'full_restore', 'rare_candy'];
          itemId = rareItems[Math.floor(Math.random() * rareItems.length)];
        } else if (itemId === 'random_berry') {
          const berries = ['oran_berry', 'sitrus_berry', 'lum_berry'];
          itemId = berries[Math.floor(Math.random() * berries.length)];
        }

        setInventory(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        playCatchSound();
        messages.push(outcome.message);
        break;
      }

      case 'nothing':
      default:
        messages.push(outcome.message);
        break;
    }

    return messages;
  }, [
    healAllPokemon,
    damageAllPokemon,
    boostStat,
    boostAllStats,
    decreaseStat,
    setInventory,
    setCurrency,
    setRelics,
    setHighlight,
    setNewRelic,
    playHealSound,
    playDefeatSound,
    playLevelUpSound,
    playCatchSound,
  ]);

  return { applyOutcome };
}
