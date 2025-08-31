import { GameState, GateAddress } from './types';
import { generateWorld } from './worldGenerator';

export function createInitialGameState(): GameState {
  const earthWorld = generateWorld('earth', 'Earth', 'earth', 1);
  
  const initialAddresses: GateAddress[] = [
    {
      id: 'earth',
      name: 'Earth',
      symbols: ['a', 'b', 'c', 'd', 'e', 'f'],
      discovered: true
    }
  ];
  
  return {
    currentWorld: 'earth', // Start on Earth automatically
    worlds: {
      earth: earthWorld
    },
    player: {
      position: earthWorld.playerPosition, // Start at the gate position
      supplies: 50,
      maxSupplies: 50,
      artifacts: [],
      gateFragments: 0,
      hasZPM: false
    },
    addresses: initialAddresses,
    gameOver: false,
    victory: false,
    currentLevel: 1
  };
}

export function generateNewWorld(level: number): { world: any; address: GateAddress } {
  const worldTemplates = [
    { biome: 'jungle' as const, name: 'Chulak', symbols: ['g', 'h', 'i', 'j', 'k', 'l'] },
    { biome: 'desert' as const, name: 'Abydos', symbols: ['m', 'n', 'o', 'p', 'q', 'r'] },
    { biome: 'arctic' as const, name: 'Kallana', symbols: ['s', 't', 'u', 'v', 'w', 'x'] },
    { biome: 'volcanic' as const, name: 'Aschen', symbols: ['y', 'z', '1', '2', '3', '4'] },
    { biome: 'alien_city' as const, name: 'P3X-888', symbols: ['5', '6', '7', '8', '9', '0'] }
  ];
  
  const template = worldTemplates[Math.min(level - 2, worldTemplates.length - 1)];
  const worldId = `world_${level}_${Date.now()}`;
  
  const world = generateWorld(worldId, template.name, template.biome, level);
  
  const address: GateAddress = {
    id: worldId,
    name: template.name,
    symbols: template.symbols,
    discovered: false
  };
  
  return { world, address };
}