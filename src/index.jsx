import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App.jsx";
import "./styles/style.css";
import { CanvasProvider } from "./utils/Context/CanvasContext.jsx";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <React.StrictMode>
    <CanvasProvider>
      <App />
    </CanvasProvider>
  </React.StrictMode>
);
