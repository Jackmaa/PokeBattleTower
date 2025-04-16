import "./RewardScreen.css";

export default function RewardScreen({ setPendingReward, onApplyReward }) {
  return (
    <div className="reward-screen">
      <h3>🎉 Choose your reward:</h3>
      <div className="reward-options">
        <button
          className="reward-btn heal"
          onClick={() => setPendingReward("heal")}
        >
          💉 Heal a team member
        </button>
        <button
          className="reward-btn catch"
          onClick={() => onApplyReward("catch")}
        >
          🎁 Catch a new Pokémon
        </button>
        <button
          className="reward-btn buff"
          onClick={() => setPendingReward("buff")}
        >
          💪 Buff a team member's attack
        </button>
      </div>
    </div>
  );
}
