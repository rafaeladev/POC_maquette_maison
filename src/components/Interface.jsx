import React, { useEffect } from "react";

function Interface(props) {
  const handleButtonClick = () => {
    // Check if the button is supposed to say "Reset"
    /*     console.log("Before click");
    console.log("Is water mooving : ", props.isWaterMoving);
    console.log("Is water mooving up : ", props.isWaterMovingUp);
    console.log("Is scenario changed : ", props.isScenarioChanged); */
    if (
      props.isScenarioChanged &&
      !props.isWaterMovingUp &&
      !props.isWaterMoving
    ) {
      // Call a different function when the button says "Reset"
      props.handleReset();
    } else {
      props.toggleWaterMoving(true);
      /*  props.toggleReset(false); */
      if (props.isScenarioChanged) {
        props.toggleWaterMovingUp(false);
      } else if (!props.isScenarioChanged) {
        props.toggleWaterMovingUp(true);
      }
    }
  };

  /* useEffect(() => {
    console.log("After click");
    console.log("Is water mooving : ", props.isWaterMoving);
    console.log("Is water mooving up : ", props.isWaterMovingUp);
    console.log("Is scenario changed : ", props.isScenarioChanged);
  }, [props.isWaterMoving, props.isWaterMovingUp, props.isScenarioChanged]); */
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
