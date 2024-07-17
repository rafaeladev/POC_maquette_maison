import React, { useState } from "react";
import MenuBar from "../components/MenuBar.jsx";
import MenuButton from "../components/MenuButton.jsx";
import TitleBar from "../components/TitleBar.jsx";

function Menu() {
  const [selectedButton, setSelectedButton] = useState("Vue innondation");
  const handleButtonClick = (buttonName) => {
    /* setSelectedButton(buttonName); */
  };
  return (
    <>
      <TitleBar buttonFunction={"info"} />
      <MenuBar>
        <MenuButton
          buttonMode={"menu"}
          isSelected={selectedButton === "Mesures prises"}
          onClick={() => handleButtonClick("Mesures prises")}
        >
          Mesures prises
        </MenuButton>
        <MenuButton
          buttonMode={"menu"}
          isSelected={selectedButton === "Vue innondation"}
          onClick={() => handleButtonClick("Vue Innondation")}
        >
          Vue innondation
        </MenuButton>
        <MenuButton
          buttonMode={"menu"}
          isSelected={selectedButton === "Dégâts associés"}
          onClick={() => handleButtonClick("Dégâts associés")}
        >
          Dégâts associés
        </MenuButton>
      </MenuBar>
    </>
  );
}

export default Menu;
