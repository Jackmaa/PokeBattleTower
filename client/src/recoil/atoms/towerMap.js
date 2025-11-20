import { atom } from 'recoil';
import { generateTowerMap } from '../../utils/towerMap';

export const towerMapState = atom({
  key: 'towerMapState',
  default: generateTowerMap(20, 4), // 20 floors, 4 paths wide
});

export const currentNodeState = atom({
  key: 'currentNodeState',
  default: 'start', // Start at the start node
});
