import React from "react";

function Interface(props) {
  const handleButtonClick = () => {
    props.toggleWaterMoving();
    props.toggleWaterMovingUp();
  };

  return (
    <div className="pointList">
      <button
        onClick={() => {
          handleButtonClick();
        }}
        disabled={props.isWaterMoving || props.isReset}
      >
        {props.isWaterMoving
          ? "En mouvement ..."
          : props.isWaterMovingUp
          ? "Descente"
          : "Montée"}
        {` ${props.isWaterMoving ? `` : "Eau"} `}
      </button>

      <button
        onClick={() => {
          props.handleReset();
        }}
        disabled={!props.isReset}
      >
        Reset
      </button>
    </div>
  );
}

export default Interface;
