import { atom } from "recoil";

export const gameStartedState = atom({
  key: "gameStartedState",
  default: false,
});

// Game view states: 'starter' | 'map' | 'floor'
export const gameViewState = atom({
  key: "gameViewState",
  default: "starter",
});
