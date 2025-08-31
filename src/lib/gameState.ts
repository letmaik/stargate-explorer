import { GameState, GateAddress } from './types';
import { generateWorld } from './worldGenerator';

export function createInitialGameState(): GameState {
  const earthWorld = generateWorld('earth', 'Earth', 'earth', 1);
  
  const initialAddresses: GateAddress[] = [
    {
      id: 'earth',
      name: 'Earth',
      symbols: ['b','Z','E','j','K','c'],
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
    { biome: 'jungle' as const, name: 'Chulak', symbols: ['I','B','W','O','k','T'] },
    { biome: 'desert' as const, name: 'Abydos', symbols: ['a','G','O','f','L','d'] },
    { biome: 'arctic' as const, name: 'Kallana', symbols: ['F','P','H','C','Z','Y'] },
    { biome: 'volcanic' as const, name: 'Tartarus', symbols: ['g','b','W','Z','P','e'] },
    { biome: 'alien_city' as const, name: 'Tollana', symbols: ['D','h','H','V','R','Y'] }
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