import React from "react";
import { render } from "react-dom";
import Canvas from "./components/Canvas";

const rootElement = document.getElementById("root");

function App() {
  return (
    <div>
      <Canvas />
    </div>
  );
}

render(<App />, rootElement);
