import React, { useState } from "react";
import Menu from "../components/Menu.jsx";
import "../styles/Innondation.css";
import MenuButton from "../components/MenuButton.jsx";

function Innondation() {
  const [selectedButton, setSelectedButton] = useState("Vue innondation");
  const handleButtonClick = (buttonName) => {
    /*  setSelectedButton(buttonName); */
  };
  return (
    <div className="innondation_container">
      <MenuButton>Explorer</MenuButton>
      <Menu />
    </div>
  );
}

export default Innondation;
