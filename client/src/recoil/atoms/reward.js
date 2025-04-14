import { atom } from "recoil";

export const rewardState = atom({
  key: "rewardState",
  default: null, // 'heal' | 'catch' | 'buff' | null
});
