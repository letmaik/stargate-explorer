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
    { id: 'chulak', biome: 'jungle' as const, name: 'Chulak', symbols: ['I','B','W','O','k','T'] },
    { id: 'abydos', biome: 'desert' as const, name: 'Abydos', symbols: ['a','G','O','f','L','d'] },
    { id: 'kallana', biome: 'arctic' as const, name: 'Kallana', symbols: ['F','P','H','C','Z','Y'] },
    { id: 'tartarus', biome: 'volcanic' as const, name: 'Tartarus', symbols: ['g','b','W','Z','P','e'] },
    { id: 'tollana', biome: 'alien_city' as const, name: 'Tollana', symbols: ['D','h','H','V','R','Y'] },
    { id: 'atlantis', biome: 'atlantis' as const, name: 'Atlantis', symbols: ['S','U','B','P','O','H','T'], isEightChevron: true }
  ];
  
  const template = worldTemplates[Math.min(level - 2, worldTemplates.length - 1)];
  
  const world = generateWorld(template.id, template.name, template.biome, level);
  
  const address: GateAddress = {
    id: template.id,
    name: template.name,
    symbols: template.symbols,
    discovered: false,
    isEightChevron: template.isEightChevron || false
  };
  
  return { world, address };
}