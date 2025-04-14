import { atom } from "recoil";

export const activePokemonIndexState = atom({
  key: "activePokemonIndexState",
  default: 0, // premier de l'équipe par défaut
});
