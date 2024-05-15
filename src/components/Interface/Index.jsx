import React from "react";
import "./style.css";

function Interface(props) {
  return (
    <div
      className="point"
      onClick={() => {
        props.toggleAnimation(true);
      }}
    >
      <div className="label">Click</div>
      <div className="text">Pour animer la monter d'eau</div>
    </div>
  );
}

export default Interface;
