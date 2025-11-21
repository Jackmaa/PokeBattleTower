import { atom } from 'recoil';

// Relics collected during the current run
export const relicsState = atom({
  key: 'relicsState',
  default: [],
});
