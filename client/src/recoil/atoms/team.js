import { atom } from "recoil";

export const teamState = atom({
  key: "teamState",
  default: [], // will store [{name, stats, moves, sprite, etc}]
});
