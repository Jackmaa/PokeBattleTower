import React, { useState } from "react";
import StarterScreen from "./pages/StarterScreen";
import FloorScreen from "./pages/FloorScreen";
import { useRecoilState } from "recoil";
import { gameStartedState } from "./recoil/atoms/game";

function App() {
  const [started, setStarted] = useRecoilState(gameStartedState);

  return (
    <div className="App">
      {started ? (
        <FloorScreen />
      ) : (
        <StarterScreen onStart={() => setStarted(true)} />
      )}
    </div>
  );
}

export default App;
