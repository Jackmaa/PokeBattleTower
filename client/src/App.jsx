import React, { useEffect, useState } from "react";
import StarterScreen from "./pages/StarterScreen";
import FloorScreen from "./pages/FloorScreen";
import TowerMapScreen from "./pages/TowerMapScreen";
import RestScreen from "./pages/RestScreen";
import ShopScreen from "./pages/ShopScreen";
import EquipScreen from "./pages/EquipScreen";
import EventScreen from "./pages/EventScreen";
import { GameOverScreen } from "./components/screens";
import BattleTransition from "./components/BattleTransition";
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

  // Battle transition state
  const [battleTransition, setBattleTransition] = useState({
    isActive: false,
    battleType: 'combat',
    enemySprites: [],
    pendingNode: null,
  });

  // Initialize theme on app load
  useEffect(() => {
    initializeTheme();
  }, []);

  const handleStartGame = () => {
    setStarted(true);
    setGameView("map"); // Show tower map first after starting
  };

  const handleBattleTransitionComplete = () => {
    // Transition is done, now show the floor screen
    setBattleTransition(prev => ({ ...prev, isActive: false }));
    setGameView("floor");
  };

  const handleNodeConfirm = (node) => {
    console.log(
      "[App] handleNodeConfirm called with node:",
      node.id,
      "Type:",
      node.type
    );

    // Update current node and mark it as visited
    setCurrentNodeId(node.id);

    // Update map to mark this node as visited and unlock next nodes
    const updatedMap = updateMapAvailability(towerMap, node.id);
    console.log("[App] Setting updated map to state");
    setTowerMap(updatedMap);

    // When a node is selected, transition to the appropriate screen
    if (
      node.type === "combat" ||
      node.type === "elite" ||
      node.type === "boss"
    ) {
      // Start battle transition animation!
      setBattleTransition({
        isActive: true,
        battleType: node.type,
        enemySprites: [], // Will be populated by the node if available
        pendingNode: node,
      });
    } else if (node.type === "shop") {
      setGameView("shop");
    } else if (node.type === "heal") {
      setGameView("rest");
    } else if (node.type === "event") {
      setGameView("event");
    }
  };

  const handleFloorComplete = () => {
    // Check if this was the final boss (floor 19 = TOTAL_FLOORS - 1)
    const currentNode = getNodeById(towerMap, currentNodeId);
    const isFinalBoss =
      currentNode &&
      currentNode.type === "boss" &&
      currentNode.floor >= TOTAL_FLOORS - 1;

    if (isFinalBoss) {
      // Player beat the final boss - show victory screen!
      console.log("[App] Final boss defeated! Showing victory screen");
      setGameView("victory");
    } else {
      // After completing a floor, return to map
      setGameView("map");
    }
  };

  const handleRestComplete = () => {
    // After resting, return to map
    setGameView("map");
  };

  const handleShopComplete = () => {
    // After shopping, return to map
    setGameView("map");
  };

  const handleEquipComplete = () => {
    // After equipping items, return to map
    setGameView("map");
  };

  const handleEventComplete = () => {
    // After event, return to map
    setGameView("map");
  };

  return (
    <div className="App min-h-screen relative">
      {/* Animated Background - Uses CSS variables from theme */}
      {/* Animated Background - Neon Verse Theme */}
      <div className="fixed inset-0 -z-10 bg-[var(--bg-deep)] overflow-hidden">
        {/* Deep Space Gradient */}
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `radial-gradient(circle at 50% 0%, var(--bg-tertiary) 0%, var(--bg-deep) 70%)`,
          }}
        />

        {/* Animated Orbs/Nebulas */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] animate-pulse-slow"
          style={{
            background:
              "radial-gradient(circle, var(--accent-violet) 0%, transparent 70%)",
            opacity: 0.15,
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] animate-pulse-slow"
          style={{
            background:
              "radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%)",
            opacity: 0.15,
            animationDelay: "2s",
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 bg-[size:60px_60px] opacity-10"
          style={{
            backgroundImage: `linear-gradient(var(--accent-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--accent-cyan) 1px, transparent 1px)`,
            maskImage:
              "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        />

        {/* Stars/Particles (CSS only for performance) */}
        <div
          className="absolute inset-0 animate-float"
          style={{ animationDuration: "20s" }}
        >
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]" />
          <div className="absolute top-3/4 left-1/3 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_5px_blue]" />
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-300 rounded-full shadow-[0_0_5px_purple]" />
        </div>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {!started ? (
          <PageTransition key="starter" variant="fade">
            <StarterScreen onStart={handleStartGame} />
          </PageTransition>
        ) : gameView === "map" ? (
          <PageTransition key="map" variant="fade">
            <TowerMapScreen onNodeConfirm={handleNodeConfirm} />
          </PageTransition>
        ) : gameView === "floor" ? (
          <PageTransition key="floor" variant="fade">
            <FloorScreen onFloorComplete={handleFloorComplete} />
          </PageTransition>
        ) : gameView === "rest" ? (
          <PageTransition key="rest" variant="fade">
            <RestScreen onComplete={handleRestComplete} />
          </PageTransition>
        ) : gameView === "shop" ? (
          <PageTransition key="shop" variant="fade">
            <ShopScreen onComplete={handleShopComplete} />
          </PageTransition>
        ) : gameView === "equip" ? (
          <PageTransition key="equip" variant="fade">
            <EquipScreen onComplete={handleEquipComplete} />
          </PageTransition>
        ) : gameView === "event" ? (
          <PageTransition key="event" variant="fade">
            <EventScreen onComplete={handleEventComplete} />
          </PageTransition>
        ) : gameView === "victory" ? (
          <PageTransition key="victory" variant="fade">
            <GameOverScreen isVictory={true} />
          </PageTransition>
        ) : (
          <div
            key="unknown"
            className="min-h-screen flex items-center justify-center text-white text-2xl"
          >
            Unknown view: {gameView}
          </div>
        )}
      </AnimatePresence>

      {/* Battle Transition Overlay */}
      <BattleTransition
        isActive={battleTransition.isActive}
        battleType={battleTransition.battleType}
        enemySprites={battleTransition.enemySprites}
        onComplete={handleBattleTransitionComplete}
      />
    </div>
  );
}

export default App;
