import { World, Position, TileType } from '@/lib/types';
import { getTileEmoji, getBiomeExploredColor } from '@/lib/worldGenerator';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WorldMapProps {
  world: World;
  playerPosition: Position;
  onMove: (direction: Position) => void;
  onInteract: (position: Position) => void;
  onCheat?: (cheatCode: string) => void;
}

export function WorldMap({ world, playerPosition, onMove, onInteract, onCheat }: WorldMapProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case 'w':
        onMove({ x: 0, y: -1 });
        break;
      case 's':
        onMove({ x: 0, y: 1 });
        break;
      case 'a':
        onMove({ x: -1, y: 0 });
        break;
      case 'd':
        onMove({ x: 1, y: 0 });
        break;
      case 'e':
      case ' ':
        onInteract(playerPosition);
        break;
      case '=':
        onCheat?.('unlock_world');
        break;
      case '-':
        onCheat?.('collect_zpm');
        break;
    }
  };

  const getTileColor = (type: TileType, discovered: boolean, position: Position): string => {
    // Check if this tile should be initially visible (near starting position)
    const distanceFromStart = Math.abs(position.x - world.playerPosition.x) + Math.abs(position.y - world.playerPosition.y);
    const shouldShowBiomeColor = discovered || distanceFromStart <= 2;
    
    switch (type) {
      case 'empty': return shouldShowBiomeColor ? getBiomeExploredColor(world.biome) : 'bg-muted/30';
      case 'wall': return 'bg-secondary';
      case 'ruins': return 'bg-amber-900/80';
      case 'hazard': return 'bg-destructive/80';
      case 'enemy': return 'bg-red-800';
      case 'artifact': return 'bg-accent/80';
      case 'gate': return 'bg-primary/80';
      case 'gate_fragment': return 'bg-blue-600/80';
      case 'supplies': return 'bg-blue-500/80';
      case 'zpm': return 'bg-yellow-500/80';
      default: return shouldShowBiomeColor ? getBiomeExploredColor(world.biome) : 'bg-muted/30';
    }
  };

  const isPlayerPosition = (x: number, y: number) => {
    return playerPosition.x === x && playerPosition.y === y;
  };

  const isNearPlayer = (x: number, y: number) => {
    const distance = Math.abs(playerPosition.x - x) + Math.abs(playerPosition.y - y);
    return distance <= 2; // Vision radius
  };

  return (
    <Card className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg">{world.name}</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          Use WASD to move, E to interact
        </div>
      </div>
      
      <div 
        className="relative bg-background border border-border rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-primary"
        tabIndex={0}
        onKeyDown={handleKeyPress}
      >
        <div className="grid gap-px" style={{ 
          gridTemplateColumns: `repeat(${world.size.width}, 1fr)`,
          gridTemplateRows: `repeat(${world.size.height}, 1fr)`
        }}>
          {world.tiles.flat().map((tile) => {
            const isVisible = isNearPlayer(tile.position.x, tile.position.y) || tile.discovered;
            const hasPlayer = isPlayerPosition(tile.position.x, tile.position.y);
            
            return (
              <div
                key={`${tile.position.x}-${tile.position.y}`}
                className={cn(
                  "aspect-square flex items-center justify-center text-xs cursor-pointer transition-all hover:brightness-110",
                  isVisible ? getTileColor(tile.type, tile.discovered, tile.position) : 'bg-black/80',
                  hasPlayer && "ring-2 ring-primary",
                  "min-w-6 min-h-6"
                )}
                onClick={() => {
                  const dx = tile.position.x - playerPosition.x;
                  const dy = tile.position.y - playerPosition.y;
                  
                  // Only allow orthogonal movement (no diagonals), and only to adjacent tiles
                  if (Math.abs(dx) + Math.abs(dy) === 1) {
                    onMove({ x: dx, y: dy });
                  } else if (dx === 0 && dy === 0) {
                    onInteract(tile.position);
                  }
                }}
              >
                {isVisible && (
                  <span className="select-none">
                    {hasPlayer ? '👤' : getTileEmoji(tile.type)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-5 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <span>👤</span> Player
        </div>
        <div className="flex items-center gap-1">
          <span>⭕</span> Gate
        </div>
        <div className="flex items-center gap-1">
          <span>💎</span> Artifact
        </div>
        <div className="flex items-center gap-1">
          <span>📜</span> Fragment
        </div>
        <div className="flex items-center gap-1">
          <span>📦</span> Supplies
        </div>
        <div className="flex items-center gap-1">
          <span>⚡</span> ZPM
        </div>
        <div className="flex items-center gap-1">
          <span>🏛️</span> Ruins
        </div>
        <div className="flex items-center gap-1">
          <span>⚠️</span> Hazard
        </div>
        <div className="flex items-center gap-1">
          <span>👾</span> Enemy
        </div>
        <div className="flex items-center gap-1">
          <span>⬛</span> Wall
        </div>
      </div>
    </Card>
  );
}