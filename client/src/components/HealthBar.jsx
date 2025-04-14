import React from "react";
import "./HealthBar.css"; // ou module CSS si tu préfères

export default function HealthBar({ current, max }) {
  const ratio = Math.max(0, Math.min(current / max, 1));
  const percent = Math.floor(ratio * 100);

  let color = "#4CAF50"; // vert
  if (percent <= 50) color = "#FF9800"; // orange
  if (percent <= 25) color = "#f44336"; // rouge

  return (
    <div className="healthbar-container">
      <div
        className="healthbar-bar"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
      <span className="healthbar-text">
        {current}/{max}
      </span>
    </div>
  );
}
