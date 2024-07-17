import React from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import useStore from "../utils/store.js";

function TitleBar({ sceneName }, props) {
  const navigate = useNavigate();
  const scenario = useStore((state) => state.scenario);

  const handleWindowClose = () => {
    console.log("Window close button clicked");

    navigate("/"); // Navigate to a specific path instead of "."
  };

  return (
    <div className="title_bar">
      <div className="title_bar_scenario">{scenario}</div>
      <div className="title_bar_sceneName">{sceneName}</div>
      {/*    <button className="title_bar_closeIcon" onClick={handleWindowClose}>
        <IoClose />
      </button> */}
    </div>
  );
}

export default TitleBar;
