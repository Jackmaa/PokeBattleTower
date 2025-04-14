import { atom } from "recoil";

export const highlightedStatState = atom({
  key: "highlightedStatState",
  default: null, // ex: { index: 0, stat: "hp" }
});
