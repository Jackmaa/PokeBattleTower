import HealthBar from "./HealthBar";

function PokemonCard({ poke, highlight, activeIndex, onSwitch }) {
  return (
    <div className={`pokemon-card ${poke.isEnemy ? "enemy" : ""}`}>
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
      {onSwitch && poke.stats.hp > 0 && !poke.isActive && (
        <button onClick={() => onSwitch(poke.id)}>Switch</button>
      )}
    </div>
  );
}

export default PokemonCard;
