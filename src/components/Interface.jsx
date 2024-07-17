import { useState } from "react";
import { GrPowerReset } from "react-icons/gr";
import TitleBar from "./TitleBar";

import waterDown from "/icones/water_down.svg";
import waterUp from "/icones/water_up.svg";
import reset from "/icones/reset.svg";
import chevron16px from "/icones/chevron16px.svg";

import React from "react";

import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

function Interface(props) {
  const handleButtonClick = () => {
    props.toggleWaterMoving();
    props.toggleWaterMovingUp();
  };

  return (
    <div className="scenario_list">
      <TitleBar sceneName={props.titleScenario} buttonFunction="close" />
      <div className="scenario_container">
        <button
          className="button_look_around"
          onClick={() => props.handleCameraPositionChange(-1)}
          style={{ paddingRight: "0.2rem" }}
        >
          <IoIosArrowBack />
        </button>

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
        <button
          className="button_look_around"
          onClick={() => props.handleCameraPositionChange(1)}
        >
          {/*  <ChevronIcon /> */}

          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
}

export default Interface;
