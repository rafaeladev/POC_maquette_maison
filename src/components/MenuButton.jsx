import React from "react";

function MenuButton({ children, isSelected, onClick, buttonMode }) {
  return (
    <button
      className={`button_menu_bar ${isSelected ? "selected" : ""}`}
      style={{
        width: buttonMode === "menu" ? "11.42rem" : "10rem",
        position: buttonMode === "menu" ? "relative" : "absolute",
        right: buttonMode === "menu" ? "0" : "1.42rem",
        height: buttonMode === "menu" ? "auto" : "2.85rem",
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default MenuButton;
