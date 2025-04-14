import { atom } from "recoil";

export const battleState = atom({
  key: "battleState",
  default: {
    playerHP: null,
    enemyHP: null,
    result: null, // 'win' | 'lose' | null
  },
});
