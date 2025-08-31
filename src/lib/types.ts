export type Position = {
  x: number;
  y: number;
};

export type TileType = 
  | 'empty' 
  | 'wall' 
  | 'ruins' 
  | 'hazard' 
  | 'enemy' 
  | 'artifact' 
  | 'gate' 
  | 'player'
  | 'gate_fragment';

export type Tile = {
  type: TileType;
  position: Position;
  id?: string;
  discovered?: boolean;
  enemyDirection?: Position;
};

export type World = {
  id: string;
  name: string;
  biome: 'earth' | 'jungle' | 'desert' | 'arctic' | 'volcanic' | 'alien_city';
  size: { width: number; height: number };
  tiles: Tile[][];
  playerPosition: Position;
  gatePosition: Position;
  discovered: boolean;
};

export type Player = {
  position: Position;
  supplies: number;
  maxSupplies: number;
  artifacts: string[];
  gateFragments: number;
};

export type GateAddress = {
  id: string;
  name: string;
  symbols: string[];
  unlocked: boolean;
  discovered?: boolean;
};

export type GameState = {
  currentWorld: string | null;
  worlds: Record<string, World>;
  player: Player;
  addresses: GateAddress[];
  gameOver: boolean;
  victory: boolean;
  currentLevel: number;
};

export type GameAction = 
  | { type: 'MOVE_PLAYER'; direction: Position }
  | { type: 'TRAVEL_TO_WORLD'; worldId: string }
  | { type: 'COLLECT_ARTIFACT'; artifactId: string }
  | { type: 'COLLECT_FRAGMENT' }
  | { type: 'TAKE_DAMAGE'; amount: number }
  | { type: 'RESET_GAME' }
  | { type: 'DISCOVER_ADDRESS'; address: GateAddress };