import React from "react";
import { IoClose } from "react-icons/io5";
import { IoIosInformation } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import useStore from "../utils/store.js";

function TitleBar({ sceneName, buttonFunction }) {
  const navigate = useNavigate();
  const scenario = useStore((state) => state.scenario);
  const setIsClose = useStore((state) => state.setIsClose);

  const handleWindowClose = () => {
    console.log("Window close button clicked");
    setIsClose(true);
    /* navigate("/");  */ // Navigate to a specific path instead of "."
  };

  const showInfo = () => {};
  return (
    <div className="title_bar">
      <div className="title_bar_scenario">{scenario}</div>
      {sceneName && <div className="title_bar_sceneName">{sceneName}</div>}
      <button
        className="title_bar_closeIcon"
        onClick={buttonFunction === "close" ? handleWindowClose : showInfo}
      >
        {buttonFunction === "close" ? <IoClose /> : <IoIosInformation />}
      </button>
    </div>
  );
}

export default TitleBar;
