import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { teamState } from "../recoil/atoms/team";
import { getRandomPokemon } from "../utils/getRandomPokemon";
import { activePokemonIndexState } from "../recoil/atoms/active";
import PokemonCard from "../components/PokemonCard";

export default function StarterScreen({ onStart }) {
  const setTeam = useSetRecoilState(teamState);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const setActiveIndex = useSetRecoilState(activePokemonIndexState);

  useEffect(() => {
    const loadStarters = async () => {
      const starters = await Promise.all([
        getRandomPokemon(),
        getRandomPokemon(),
        getRandomPokemon(),
      ]);
      setOptions(starters);
      setIsLoading(false); // Set loading to false when data is ready
    };
    loadStarters();
  }, []);

  const selectStarter = (pokemon) => {
    setTeam([pokemon]);
    setActiveIndex(0);
    onStart();
  };

  if (isLoading) {
    return <div>Loading Starters...</div>; // Show loading state while fetching data
  }

  return (
    <div className="starter-screen">
      <h2>Choose your Starter Pokemon</h2>
      <div className="starter-options">
        {options.map((poke) => (
          <PokemonCard
            key={poke.id}
            poke={poke}
            onSwitch={() => selectStarter(poke)}
          />
        ))}
      </div>
    </div>
  );
}
