import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../utils/store.js";
import { useInView } from "react-intersection-observer";

import Home from "./Home.jsx";

import { IoClose } from "react-icons/io5";

function Intro() {
  const navigate = useNavigate();

  const setScenario = useStore((state) => state.setScenario);

  const sendToScene = (selectedScenario) => {
    setScenario(selectedScenario);
    /*  navigate("/home"); */
    setClick(true);
  };

  const [isClick, setClick] = React.useState(false);

  const handleWindowClose = () => {
    console.log("Window close button clicked");
    setClick(false);
    /*   window.setTimeout(() => {
      navigate("/");
    }, 100); */
    /* navigate("/"); // Navigate to a specific path instead of "." */
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "2rem",
        color: "white",
        backgroundColor: "#01a9af",
      }}
    >
      <h1
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          margin: "0",
          color: "white",
        }}
      >
        Choisir le scénario
      </h1>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button className="title_bar_scenario" onClick={() => sendToScene("A")}>
          A
        </button>
        <button className="title_bar_scenario" onClick={() => sendToScene("B")}>
          B
        </button>
        <button className="title_bar_scenario" onClick={() => sendToScene("C")}>
          C
        </button>
      </div>

      <div
        style={{
          display: isClick ? "block" : "none",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "100",
        }}
      >
        <Home />
        <button className="title_bar_closeIcon" onClick={handleWindowClose}>
          <IoClose />
        </button>
      </div>
    </div>
  );
}

export default Intro;
