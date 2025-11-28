// 📁 EquipScreen.jsx
// Screen for equipping items to Pokemon

import { useRecoilState } from 'recoil';
import { motion } from 'framer-motion';
import { teamState } from '../recoil/atoms/team';
import { inventoryState } from '../recoil/atoms/inventory';
import { Button } from '../components/ui';
import { EquipItemPanel } from '../components/panels';

export default function EquipScreen({ onComplete }) {
  const [team, setTeam] = useRecoilState(teamState);
  const [inventory, setInventory] = useRecoilState(inventoryState);

  const handleEquipItem = (pokemonIndex, item) => {
    const updatedTeam = [...team];
    const pokemon = updatedTeam[pokemonIndex];

    // If Pokemon already has an item, return it to inventory
    if (pokemon.heldItem) {
      setInventory(prev => ({
        ...prev,
        [pokemon.heldItem]: (prev[pokemon.heldItem] || 0) + 1,
      }));
    }

    // Equip new item
    updatedTeam[pokemonIndex] = {
      ...pokemon,
      heldItem: item.id,
    };

    // Remove item from inventory (only if it's not already equipped)
    if (pokemon.heldItem !== item.id) {
      setInventory(prev => ({
        ...prev,
        [item.id]: Math.max((prev[item.id] || 0) - 1, 0),
      }));
    }

    setTeam(updatedTeam);
  };

  const handleUnequipItem = (pokemonIndex) => {
    const updatedTeam = [...team];
    const pokemon = updatedTeam[pokemonIndex];

    if (pokemon.heldItem) {
      // Return item to inventory
      setInventory(prev => ({
        ...prev,
        [pokemon.heldItem]: (prev[pokemon.heldItem] || 0) + 1,
      }));

      // Remove item from Pokemon
      updatedTeam[pokemonIndex] = {
        ...pokemon,
        heldItem: null,
      };

      setTeam(updatedTeam);
    }
  };

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    }
  };

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
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ⚙️
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Equipment Management
          </h1>
          <p className="text-xl text-white/70">
            Equip items to your Pokémon for battle advantages
          </p>
        </motion.div>

        {/* Equipment Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EquipItemPanel
            team={team}
            inventory={inventory}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            onClose={handleContinue}
          />
        </motion.div>

        {/* Continue Button */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleContinue}
            className="btn-primary px-8 py-4 text-xl font-bold"
          >
            Continue to Map →
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
