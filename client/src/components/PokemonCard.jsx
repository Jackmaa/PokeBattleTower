import HealthBar from "./HealthBar";
import typeColors from "../utils/typeColors";
import { useEffect, useState } from "react";
import "./PokemonCard.css";

function PokemonCard({
  poke,
  isEnemy,
  highlight,
  onSwitch,
  onRewardClick,
  mode = "default",
}) {
  const [wasHit, setWasHit] = useState(false);
  const isFainted = poke.stats.hp <= 0;
  const primaryType = poke.types?.[0]?.toLowerCase();
  const borderColor = typeColors[primaryType] || "#ccc";
  const handleClick = () => {
    if (onRewardClick) onRewardClick();
    else if (mode === "starter" && onSwitch) onSwitch();
  };
  useEffect(() => {
    if (poke.stats.hp < (poke.stats.hp_prev || poke.stats.hp_max)) {
      setWasHit(true);
      const timeout = setTimeout(() => setWasHit(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [poke.stats.hp]);

  return (
    <div
      className={`pokemon-card ${isEnemy ? "enemy" : ""} 
      ${onRewardClick ? "reward-target" : ""}
      ${wasHit ? "shake" : ""}
      ${isFainted ? "fainted" : ""}`}
      onClick={onRewardClick || mode === "starter" ? handleClick : undefined}
      style={{
        borderColor: borderColor,
        boxShadow: poke.isActive ? `0 0 12px ${borderColor}` : undefined,
      }}
    >
      <img src={poke.sprite} alt={poke.name} />
      <h4>{poke.name}</h4>
      <HealthBar current={poke.stats.hp} max={poke.stats.hp_max} />
      <p
        className={
          highlight?.index === poke.id && highlight?.stat === "attack"
            ? "highlight"
            : ""
        }
      >
        ATK: {poke.stats.attack}
      </p>
      <p>DEF: {poke.stats.defense}</p>
      <p>SPD: {poke.stats.speed}</p>
      <p>SPA: {poke.stats.special_attack}</p>
      <p>SPD: {poke.stats.special_defense}</p>
      {poke.isActive && <strong>🟢 Active</strong>}

      {/* Show switch button only in switch mode */}
      {poke.stats.hp > 0 && !poke.isActive && onSwitch && (
        <button onClick={onSwitch}>Select</button>
      )}
    </div>
  );
}

export default PokemonCard;
