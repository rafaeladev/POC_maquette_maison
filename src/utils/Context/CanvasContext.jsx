import { createContext, useContext, useRef } from "react";

const CanvasContext = createContext();

export const CanvasProvider = ({ children }) => {
  const canvasRef = useRef();

  return (
    <CanvasContext.Provider value={canvasRef}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => useContext(CanvasContext);
