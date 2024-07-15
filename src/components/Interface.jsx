import { useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import TitleBar from "./TitleBar";

import waterDown from "/icones/water_down.svg";
import waterUp from "/icones/water_up.svg";
import reset from "/icones/reset.svg";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

function Interface(props) {
  const handleButtonClick = () => {
    props.toggleWaterMoving();
    props.toggleWaterMovingUp();
  };

  const handleButtonStateChange = (button) => {};

  return (
    <div className="scenario_list">
      <TitleBar scenario="A" sceneName={props.titleScenario} />
      {/* <div className='scenario_correction'>
                <button
                    className=''
                    onClick={() => {
                        props.handleCameraPosition('cuisine');
                        handleButtonStateChange('cuisine');
                    }}
                    disabled={buttonsClicked.cuisine}
                >
                    Cuisine
                </button>
                <button
                    className=''
                    onClick={() => {
                        props.handleCameraPosition('salon');
                        handleButtonStateChange('salon');
                    }}
                    disabled={buttonsClicked.salon}
                >
                    Salon
                </button>
                <button
                    className=''
                    onClick={() => {
                        props.handleCameraPosition('sdb');
                        handleButtonStateChange('sdb');
                    }}
                    disabled={buttonsClicked.sdb}
                >
                    Salle de Bains
                </button>
                <button
                    className=''
                    onClick={() => {
                        props.handleCameraPosition('jardin');
                        handleButtonStateChange('jardin');
                    }}
                    disabled={buttonsClicked.jardin}
                >
                    Jardin
                </button>
            </div> */}

      <div className="scenario_container">
        <button
          className="button_look_around"
          onClick={() => props.handleCameraPositionChange(-1)}
        >
          <IoIosArrowBack />
        </button>
        <button
          className="button_look_around"
          onClick={() => props.handleCameraPositionChange(1)}
        >
          <IoIosArrowForward />
        </button>
      </div>
      <div className="scenario_list_buttons">
        <button
          className="button_animation_menu"
          onClick={() => {
            handleButtonClick();
          }}
          disabled={props.isWaterMoving || props.isReset}
        >
          {props.isWaterMoving
            ? "Animation en cours ..."
            : props.isWaterMovingUp
            ? `Lancer la décrue`
            : `Lancer la crue`}
          <img
            src={!props.isScenarioChanged ? waterUp : waterDown}
            alt="water icon"
          />
        </button>

        <button
          className="button_reset_menu"
          onClick={() => {
            props.handleReset();
          }}
          disabled={
            !props.isScenarioChanged &&
            !props.isWaterMoving &&
            !props.isWaterMovingUp
          }
        >
          <img src={reset} alt="reset icon" />
        </button>
      </div>
    </div>
  );
}

export default Interface;
