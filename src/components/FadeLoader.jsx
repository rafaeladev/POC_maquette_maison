import React from "react";
// Loader
import { FadeLoader } from "react-spinners";

function FadeLoaderComponent() {
  return (
    <div className="loading-spinner">
      <FadeLoader color="#ffffff" />
      Loading ...
    </div>
  );
}

export default FadeLoaderComponent;
