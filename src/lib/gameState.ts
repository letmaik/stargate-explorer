import { GameState, GateAddress } from './types';
import { generateWorld } from './worldGenerator';

export function createInitialGameState(): GameState {
  const earthWorld = generateWorld('earth', 'Earth (P3X-774)', 'earth', 1);
  
  const initialAddresses: GateAddress[] = [
    {
      id: 'earth',
      name: 'Earth (P3X-774)',
      symbols: ['🌍', '🌊', '🌱', '🌤️', '🏔️', '🌋'],
      discovered: true
    },
    {
      id: 'abydos',
      name: 'Abydos (P8X-873)',
      symbols: ['🏜️', '🔺', '☀️', '💀', '🏛️', '⚱️'],
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
    { biome: 'jungle' as const, name: 'Chulak', symbols: ['🌿', '🐍', '🦋', '🌺', '🌳', '💧'] },
    { biome: 'desert' as const, name: 'Abydos', symbols: ['🏜️', '🦂', '🌵', '🔥', '💎', '🏺'] },
    { biome: 'arctic' as const, name: 'Kallana', symbols: ['❄️', '🐧', '⛄', '🧊', '🌨️', '🏔️'] },
    { biome: 'volcanic' as const, name: 'Aschen', symbols: ['🌋', '🔥', '💀', '⚡', '🌪️', '🗿'] },
    { biome: 'alien_city' as const, name: 'Atlantis', symbols: ['🏛️', '👽', '🛸', '🔮', '⚡', '🌌'] }
  ];
  
  const template = worldTemplates[Math.min(level - 2, worldTemplates.length - 1)];
  const worldId = `world_${level}_${Date.now()}`;
  
  // Generate random gate address in P8X-XXX format
  const generateGateAddress = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const digit = numbers[Math.floor(Math.random() * numbers.length)];
    const threeDigits = Array.from({ length: 3 }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
    return `P${digit}${letter}-${threeDigits}`;
  };
  
  const gateAddress = generateGateAddress();
  const world = generateWorld(worldId, `${template.name} (${gateAddress})`, template.biome, level);
  
  const address: GateAddress = {
    id: worldId,
    name: world.name,
    symbols: template.symbols,
    discovered: false
  };
  
  return { world, address };
}