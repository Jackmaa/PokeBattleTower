import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { teamState } from "../recoil/atoms/team";
import { getRandomPokemon } from "../utils/getRandomPokemon";
import { activePokemonIndexState } from "../recoil/atoms/active";

export default function StarterScreen({ onStart }) {
  const setTeam = useSetRecoilState(teamState);
  const [options, setOptions] = useState([]);
  const setActiveIndex = useSetRecoilState(activePokemonIndexState);

  useEffect(() => {
    const loadStarters = async () => {
      const starters = await Promise.all([
        getRandomPokemon(),
        getRandomPokemon(),
        getRandomPokemon(),
      ]);
      setOptions(starters);
    };
    loadStarters();
  }, []);
  const selectStarter = (pokemon) => {
    setTeam([pokemon]);
    setActiveIndex(0);
    onStart();
  };

  return (
    <div className="starter-screen">
      <h2>Choose your Starter Pokemon</h2>
      <div className="starter-options">
        {options.map((poke) => (
          <div
            key={poke.id}
            className="pokemon-card"
            onClick={() => selectStarter(poke)}
          >
            <img src={poke.sprite} alt={poke.name} />
            <h3>{poke.name.toUpperCase()}</h3>
            <span>HP: {poke.stats.hp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
