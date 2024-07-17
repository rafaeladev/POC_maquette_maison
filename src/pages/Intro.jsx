import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../utils/store.js";
import { useInView } from "react-intersection-observer";

import Home from "./Home.jsx";

import { IoClose } from "react-icons/io5";
import TitleBar from "../components/TitleBar.jsx";

function Intro() {
  const setScenario = useStore((state) => state.setScenario);
  const setIsClose = useStore((state) => state.setIsClose);
  const isClose = useStore((state) => state.isClose);

  const sendToScene = (selectedScenario) => {
    setScenario(selectedScenario);
    setIsClose(false);
  };

  const [isClick, setClick] = React.useState(false);

  const handleWindowClose = () => {
    console.log("Window close button clicked");
    setIsClose(false);
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
          display: isClose ? "flex" : "none",
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
          display: isClose ? "flex" : "none",
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
          display: isClose ? "none" : "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "100",
        }}
      >
        <Home />
      </div>
    </div>
  );
}

export default Intro;
