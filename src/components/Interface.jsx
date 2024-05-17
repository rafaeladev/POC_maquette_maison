import React, { useEffect } from "react";

function Interface(props) {
  const handleButtonClick = () => {
    // Check if the button is supposed to say "Reset"
    if (
      props.isScenarioChanged &&
      !props.isWaterMovingUp &&
      !props.isWaterMoving
    ) {
      // Call a different function when the button says "Reset"
      props.handleReset(true); // Assuming `handleReset` is the function you want to call
    } else {
      props.toggleWaterMoving(true);

      if (props.isScenarioChanged) {
        props.toggleWaterMovingUp(false);
      } else if (!props.isScenarioChanged) {
        props.toggleWaterMovingUp(true);
      }
    }
  };
  return (
    <div className="pointList">
      <button
        onClick={() => {
          handleButtonClick();
        }}
        disabled={props.isWaterMoving}
      >{`${
        props.isScenarioChanged &&
        !props.isWaterMovingUp &&
        !props.isWaterMoving
          ? ``
          : "Water"
      } ${
        props.isWaterMoving
          ? "is mooving ..."
          : props.isWaterMovingUp
          ? "Down"
          : props.isScenarioChanged
          ? "Reset"
          : "Up"
      }`}</button>
    </div>
  );
}

export default Interface;
