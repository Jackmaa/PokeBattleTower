import React from "react";
import StarterScreen from "./pages/StarterScreen";
import FloorScreen from "./pages/FloorScreen";
import TowerMapScreen from "./pages/TowerMapScreen";
import RestScreen from "./pages/RestScreen";
import ShopScreen from "./pages/ShopScreen";
import { useRecoilState } from "recoil";
import { gameStartedState, gameViewState } from "./recoil/atoms/game";
import { towerMapState, currentNodeState } from "./recoil/atoms/towerMap";
import { updateMapAvailability } from "./utils/towerMap";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/ui";

function App() {
  const [started, setStarted] = useRecoilState(gameStartedState);
  const [gameView, setGameView] = useRecoilState(gameViewState);
  const [towerMap, setTowerMap] = useRecoilState(towerMapState);
  const [currentNodeId, setCurrentNodeId] = useRecoilState(currentNodeState);

  const handleStartGame = () => {
    setStarted(true);
    setGameView("map"); // Show tower map first after starting
  };

  const handleNodeConfirm = (node) => {
    console.log('[App] handleNodeConfirm called with node:', node.id, 'Type:', node.type);

    // Update current node and mark it as visited
    setCurrentNodeId(node.id);

    // Update map to mark this node as visited and unlock next nodes
    const updatedMap = updateMapAvailability(towerMap, node.id);
    console.log('[App] Setting updated map to state');
    setTowerMap(updatedMap);

    // When a node is selected, transition to the appropriate screen
    if (node.type === 'combat' || node.type === 'elite' || node.type === 'boss') {
      setGameView('floor');
    } else if (node.type === 'shop') {
      setGameView('shop');
    } else if (node.type === 'heal') {
      setGameView('rest');
    } else if (node.type === 'event') {
      // TODO: Navigate to event screen
      console.log('Event not implemented yet');
      setGameView('map'); // Return to map for now
    }
  };

  const handleFloorComplete = () => {
    // After completing a floor, return to map
    setGameView('map');
  };

  const handleRestComplete = () => {
    // After resting, return to map
    setGameView('map');
  };

  const handleShopComplete = () => {
    // After shopping, return to map
    setGameView('map');
  };

  return (
    <div className="App min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />

        {/* Animated Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {!started ? (
          <PageTransition key="starter" variant="fade">
            <StarterScreen onStart={handleStartGame} />
          </PageTransition>
        ) : gameView === 'map' ? (
          <PageTransition key="map" variant="fade">
            <TowerMapScreen onNodeConfirm={handleNodeConfirm} />
          </PageTransition>
        ) : gameView === 'floor' ? (
          <PageTransition key="floor" variant="fade">
            <FloorScreen onFloorComplete={handleFloorComplete} />
          </PageTransition>
        ) : gameView === 'rest' ? (
          <PageTransition key="rest" variant="fade">
            <RestScreen onComplete={handleRestComplete} />
          </PageTransition>
        ) : gameView === 'shop' ? (
          <PageTransition key="shop" variant="fade">
            <ShopScreen onComplete={handleShopComplete} />
          </PageTransition>
        ) : (
          <div key="unknown" className="min-h-screen flex items-center justify-center text-white text-2xl">
            Unknown view: {gameView}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
