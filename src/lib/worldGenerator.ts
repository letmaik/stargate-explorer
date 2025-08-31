import { World, Tile, TileType, Position } from './types';

export function generateWorld(
  id: string, 
  name: string, 
  biome: World['biome'], 
  level: number = 1
): World {
  const size = { width: 20, height: 15 };
  const tiles: Tile[][] = [];
  
  // Initialize empty grid
  for (let y = 0; y < size.height; y++) {
    tiles[y] = [];
    for (let x = 0; x < size.width; x++) {
      tiles[y][x] = {
        type: 'empty',
        position: { x, y },
        discovered: false
      };
    }
  }
  
  // Place walls around perimeter
  for (let x = 0; x < size.width; x++) {
    tiles[0][x].type = 'wall';
    tiles[size.height - 1][x].type = 'wall';
  }
  for (let y = 0; y < size.height; y++) {
    tiles[y][0].type = 'wall';
    tiles[y][size.width - 1].type = 'wall';
  }
  
  // Place random walls/obstacles
  const wallCount = Math.floor((size.width * size.height) * 0.15);
  for (let i = 0; i < wallCount; i++) {
    const x = Math.floor(Math.random() * (size.width - 2)) + 1;
    const y = Math.floor(Math.random() * (size.height - 2)) + 1;
    if (tiles[y][x].type === 'empty') {
      tiles[y][x].type = 'wall';
    }
  }
  
  // Place ruins with artifacts
  const ruinCount = 3 + level;
  for (let i = 0; i < ruinCount; i++) {
    const pos = findEmptyPosition(tiles, size);
    if (pos) {
      tiles[pos.y][pos.x].type = 'ruins';
      // 70% chance of artifact in ruins
      if (Math.random() < 0.7) {
        const artifactPos = findNearbyEmpty(tiles, size, pos);
        if (artifactPos) {
          tiles[artifactPos.y][artifactPos.x].type = 'artifact';
          tiles[artifactPos.y][artifactPos.x].id = `artifact_${Date.now()}_${i}`;
        }
      }
    }
  }
  
  // Place gate fragments
  const fragmentCount = 2 + Math.floor(level / 2);
  for (let i = 0; i < fragmentCount; i++) {
    const pos = findEmptyPosition(tiles, size);
    if (pos) {
      tiles[pos.y][pos.x].type = 'gate_fragment';
      tiles[pos.y][pos.x].id = `fragment_${Date.now()}_${i}`;
    }
  }
  
  // Place hazards based on biome
  const hazardCount = Math.floor(level * 1.5) + 2;
  for (let i = 0; i < hazardCount; i++) {
    const pos = findEmptyPosition(tiles, size);
    if (pos) {
      tiles[pos.y][pos.x].type = 'hazard';
    }
  }
  
  // Place enemies
  const enemyCount = level + 1;
  for (let i = 0; i < enemyCount; i++) {
    const pos = findEmptyPosition(tiles, size);
    if (pos) {
      tiles[pos.y][pos.x].type = 'enemy';
      tiles[pos.y][pos.x].enemyDirection = getRandomDirection();
    }
  }
  
  // Place exit gate
  const gatePosition = findEmptyPosition(tiles, size, { x: size.width - 3, y: size.height - 3 });
  if (gatePosition) {
    tiles[gatePosition.y][gatePosition.x].type = 'gate';
  }
  
  // Player starts at top-left area
  const playerPosition = findEmptyPosition(tiles, size, { x: 2, y: 2 });
  
  return {
    id,
    name,
    biome,
    size,
    tiles,
    playerPosition: playerPosition || { x: 1, y: 1 },
    gatePosition: gatePosition || { x: size.width - 2, y: size.height - 2 },
    discovered: false
  };
}

function findEmptyPosition(
  tiles: Tile[][], 
  size: { width: number; height: number },
  preferredArea?: Position
): Position | null {
  const attempts = 100;
  
  for (let i = 0; i < attempts; i++) {
    let x, y;
    
    if (preferredArea) {
      // Search within 3 tiles of preferred position
      x = Math.max(1, Math.min(size.width - 2, 
        preferredArea.x + (Math.random() - 0.5) * 6));
      y = Math.max(1, Math.min(size.height - 2, 
        preferredArea.y + (Math.random() - 0.5) * 6));
    } else {
      x = Math.floor(Math.random() * (size.width - 2)) + 1;
      y = Math.floor(Math.random() * (size.height - 2)) + 1;
    }
    
    x = Math.floor(x);
    y = Math.floor(y);
    
    if (tiles[y] && tiles[y][x] && tiles[y][x].type === 'empty') {
      return { x, y };
    }
  }
  
  return null;
}

function findNearbyEmpty(
  tiles: Tile[][], 
  size: { width: number; height: number },
  center: Position
): Position | null {
  const directions = [
    { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 },
    { x: 1, y: -1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
  ];
  
  for (const dir of directions) {
    const newX = center.x + dir.x;
    const newY = center.y + dir.y;
    
    if (newX >= 0 && newX < size.width && newY >= 0 && newY < size.height) {
      if (tiles[newY][newX].type === 'empty') {
        return { x: newX, y: newY };
      }
    }
  }
  
  return null;
}

function getRandomDirection(): Position {
  const directions = [
    { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
  ];
  return directions[Math.floor(Math.random() * directions.length)];
}

export function getBiomeColor(biome: World['biome']): string {
  switch (biome) {
    case 'earth': return 'bg-green-900';
    case 'jungle': return 'bg-green-800';
    case 'desert': return 'bg-yellow-800';
    case 'arctic': return 'bg-blue-200';
    case 'volcanic': return 'bg-red-900';
    case 'alien_city': return 'bg-purple-900';
    default: return 'bg-gray-800';
  }
}

export function getTileEmoji(type: TileType): string {
  switch (type) {
    case 'empty': return '';
    case 'wall': return '⬛';
    case 'ruins': return '🏛️';
    case 'hazard': return '⚠️';
    case 'enemy': return '👾';
    case 'artifact': return '💎';
    case 'gate': return '⭕';
    case 'gate_fragment': return '📜';
    case 'player': return '👤';
    default: return '';
  }
}