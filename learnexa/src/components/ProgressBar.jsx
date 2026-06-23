import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ progress = 0 }) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, Number(progress) || 0));

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
