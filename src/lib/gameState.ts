import { GameState, GateAddress } from './types';
import { generateWorld } from './worldGenerator';

export function createInitialGameState(): GameState {
  const earthWorld = generateWorld('earth', 'Earth (P3X-774)', 'earth', 1);
  
  const initialAddresses: GateAddress[] = [
    {
      id: 'earth',
      name: 'Earth (P3X-774)',
      symbols: ['🌍', '🌊', '🌱', '🌤️', '🏔️', '🌋'],
      unlocked: true,
      discovered: true
    },
    {
      id: 'abydos',
      name: 'Abydos (P8X-873)',
      symbols: ['🏜️', '🔺', '☀️', '💀', '🏛️', '⚱️'],
      unlocked: true,
      discovered: false
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
      gateFragments: 0
    },
    addresses: initialAddresses,
    gameOver: false,
    victory: false,
    currentLevel: 1
  };
}

export function generateNewWorld(level: number): { world: any; address: GateAddress } {
  const worldTemplates = [
    { biome: 'jungle' as const, name: 'Jungle World', symbols: ['🌿', '🐍', '🦋', '🌺', '🌳', '💧'] },
    { biome: 'desert' as const, name: 'Desert World', symbols: ['🏜️', '🦂', '🌵', '🔥', '💎', '🏺'] },
    { biome: 'arctic' as const, name: 'Ice World', symbols: ['❄️', '🐧', '⛄', '🧊', '🌨️', '🏔️'] },
    { biome: 'volcanic' as const, name: 'Volcanic World', symbols: ['🌋', '🔥', '💀', '⚡', '🌪️', '🗿'] },
    { biome: 'alien_city' as const, name: 'Ancient City', symbols: ['🏛️', '👽', '🛸', '🔮', '⚡', '🌌'] }
  ];
  
  const template = worldTemplates[Math.min(level - 2, worldTemplates.length - 1)];
  const worldId = `world_${level}_${Date.now()}`;
  
  const world = generateWorld(worldId, `${template.name} (Level ${level})`, template.biome, level);
  
  const address: GateAddress = {
    id: worldId,
    name: world.name,
    symbols: template.symbols,
    unlocked: false,
    discovered: false
  };
  
  return { world, address };
}