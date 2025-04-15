export default function RewardScreen({ setPendingReward, onApplyReward }) {
  return (
    <div className="reward-screen">
      <h3>🎉 Choose your reward:</h3>
      <div className="reward-options">
        <button onClick={() => setPendingReward("heal")}>
          💉 Heal a team member
        </button>
        <button onClick={() => onApplyReward("catch")}>
          🎁 Catch a new Pokémon
        </button>
        <button onClick={() => setPendingReward("buff")}>
          💪 Buff a team member's attack
        </button>
      </div>
    </div>
  );
}
