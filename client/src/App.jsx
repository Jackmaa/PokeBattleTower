import React, { useEffect } from "react";
import StarterScreen from "./pages/StarterScreen";
import FloorScreen from "./pages/FloorScreen";
import TowerMapScreen from "./pages/TowerMapScreen";
import RestScreen from "./pages/RestScreen";
import ShopScreen from "./pages/ShopScreen";
import EquipScreen from "./pages/EquipScreen";
import EventScreen from "./pages/EventScreen";
import GameOverScreen from "./components/GameOverScreen";
import { useRecoilState } from "recoil";
import { gameStartedState, gameViewState } from "./recoil/atoms/game";
import { towerMapState, currentNodeState } from "./recoil/atoms/towerMap";
import { updateMapAvailability, getNodeById } from "./utils/towerMap";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./components/ui";
import { initializeTheme } from "./utils/themeManager";

// Total floors in the tower (final boss is at floor totalFloors - 1)
const TOTAL_FLOORS = 20;

function App() {
  const [started, setStarted] = useRecoilState(gameStartedState);
  const [gameView, setGameView] = useRecoilState(gameViewState);
  const [towerMap, setTowerMap] = useRecoilState(towerMapState);
  const [currentNodeId, setCurrentNodeId] = useRecoilState(currentNodeState);

  // Initialize theme on app load
  useEffect(() => {
    initializeTheme();
  }, []);

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
      setGameView('event');
    }
  };

  const handleFloorComplete = () => {
    // Check if this was the final boss (floor 19 = TOTAL_FLOORS - 1)
    const currentNode = getNodeById(towerMap, currentNodeId);
    const isFinalBoss = currentNode &&
      currentNode.type === 'boss' &&
      currentNode.floor >= TOTAL_FLOORS - 1;

    if (isFinalBoss) {
      // Player beat the final boss - show victory screen!
      console.log('[App] Final boss defeated! Showing victory screen');
      setGameView('victory');
    } else {
      // After completing a floor, return to map
      setGameView('map');
    }
  };

  const handleRestComplete = () => {
    // After resting, return to map
    setGameView('map');
  };

  const handleShopComplete = () => {
    // After shopping, return to map
    setGameView('map');
  };

  const handleEquipComplete = () => {
    // After equipping items, return to map
    setGameView('map');
  };

  const handleEventComplete = () => {
    // After event, return to map
    setGameView('map');
  };

  return (
    <div className="App min-h-screen relative">
      {/* Animated Background - Uses CSS variables from theme */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{
            background: `linear-gradient(to bottom right, var(--gradient-from), var(--gradient-via), var(--gradient-to))`
          }}
        />

        {/* Animated Orbs - Use theme colors */}
        <div
          className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse-slow transition-colors duration-500"
          style={{ backgroundColor: 'var(--orb-1)' }}
        />
        <div
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse-slow transition-colors duration-500"
          style={{ backgroundColor: 'var(--orb-2)', animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse-slow transition-colors duration-500"
          style={{ backgroundColor: 'var(--orb-3)', animationDelay: '2s' }}
        />

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 bg-[size:50px_50px]"
          style={{
            backgroundImage: `linear-gradient(var(--border-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--border-secondary) 1px, transparent 1px)`
          }}
        />

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
        ) : gameView === 'equip' ? (
          <PageTransition key="equip" variant="fade">
            <EquipScreen onComplete={handleEquipComplete} />
          </PageTransition>
        ) : gameView === 'event' ? (
          <PageTransition key="event" variant="fade">
            <EventScreen onComplete={handleEventComplete} />
          </PageTransition>
        ) : gameView === 'victory' ? (
          <PageTransition key="victory" variant="fade">
            <GameOverScreen isVictory={true} />
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
