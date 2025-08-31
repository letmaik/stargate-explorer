import { useState, useCallback, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { GameState, Position, World } from '@/lib/types';
import { createInitialGameState, generateNewWorld } from '@/lib/gameState';
import { generateWorld } from '@/lib/worldGenerator';
import { toast } from 'sonner';

export function useGameState() {
  const [gameState, setGameState, deleteGameState] = useKV<GameState>('stargate-game', createInitialGameState());
  const [lastMoveTime, setLastMoveTime] = useState(0);

  // Mark initial tiles as discovered when entering a world
  useEffect(() => {
    if (gameState.currentWorld) {
      const world = gameState.worlds[gameState.currentWorld];
      if (world) {
        const playerPos = world.playerPosition;
        
        // Check if any tiles around starting position need to be discovered
        const needsDiscovery = world.tiles.some(row => 
          row.some(tile => {
            const distance = Math.abs(tile.position.x - playerPos.x) + Math.abs(tile.position.y - playerPos.y);
            return distance <= 2 && !tile.discovered;
          })
        );
        
        if (needsDiscovery) {
          setGameState((current) => {
            const currentWorld = current.worlds[current.currentWorld!];
            if (!currentWorld) return current;
            
            const updatedTiles = currentWorld.tiles.map(row => 
              row.map(tile => {
                const distance = Math.abs(tile.position.x - playerPos.x) + Math.abs(tile.position.y - playerPos.y);
                if (distance <= 2) {
                  return { ...tile, discovered: true };
                }
                return tile;
              })
            );
            
            return {
              ...current,
              worlds: {
                ...current.worlds,
                [current.currentWorld!]: {
                  ...currentWorld,
                  tiles: updatedTiles
                }
              }
            };
          });
        }
      }
    }
  }, [gameState.currentWorld, setGameState]);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    toast.success('New mission started');
  }, [setGameState]);

  const movePlayer = useCallback((direction: Position) => {
    const now = Date.now();
    if (now - lastMoveTime < 150) return; // Prevent rapid movement
    setLastMoveTime(now);

    setGameState((current) => {
      if (!current.currentWorld || current.gameOver) return current;
      
      const world = current.worlds[current.currentWorld];
      if (!world) return current;
      
      const newPos = {
        x: world.playerPosition.x + direction.x,
        y: world.playerPosition.y + direction.y
      };
      
      // Check bounds
      if (newPos.x < 0 || newPos.x >= world.size.width || 
          newPos.y < 0 || newPos.y >= world.size.height) {
        return current;
      }
      
      const targetTile = world.tiles[newPos.y][newPos.x];
      
      // Check for walls
      if (targetTile.type === 'wall') {
        return current;
      }
      
      let newSupplies = current.player.supplies - 1;
      let gameOver = false;
      let newArtifacts = [...current.player.artifacts];
      let newFragments = current.player.gateFragments;
      let newAddresses = [...current.addresses];
      let levelUp = false;
      
      // Handle tile interactions
      switch (targetTile.type) {
        case 'hazard':
          newSupplies -= 5;
          toast.error('Hazard encountered! Lost 5 supplies');
          break;
          
        case 'enemy':
          newSupplies -= 10;
          toast.error('Enemy encounter! Lost 10 supplies');
          break;
          
        case 'supplies':
          if (targetTile.id && newSupplies < current.player.maxSupplies) {
            const suppliesGained = Math.min(10, current.player.maxSupplies - newSupplies);
            newSupplies += suppliesGained;
            toast.success(`Supplies collected! Gained ${suppliesGained} supplies`);
            targetTile.type = 'empty'; // Remove supplies from world
          }
          break;
          
        case 'artifact':
          if (targetTile.id && !newArtifacts.includes(targetTile.id)) {
            newArtifacts.push(targetTile.id);
            toast.success('Artifact collected!');
            targetTile.type = 'empty'; // Remove artifact from world
          }
          break;
          
        case 'gate_fragment':
          newFragments += 1;
          toast.success('Gate fragment collected!');
          targetTile.type = 'empty'; // Remove fragment from world
          
          // Check if we can generate a new address
          if (newFragments >= 3) {
            const nextLevel = Object.keys(current.worlds).length + 1;
            const { world: newWorld, address: newAddress } = generateNewWorld(nextLevel);
            
            // Add the new address and world
            newAddresses = [...newAddresses, newAddress];
            current.worlds[newAddress.id] = newWorld;
            newFragments = 0; // Reset fragments
            levelUp = true;
            toast.success(`New address discovered: ${newAddress.name}`);
          }
          break;
          
        case 'gate':
          toast.info('Stargate activated! Use controls to travel.');
          break;
      }
      
      // Check for game over conditions
      if (newSupplies <= 0) {
        gameOver = true;
        toast.error('Out of supplies! Mission failed.');
      }
      
      // Mark tiles as discovered
      const updatedTiles = world.tiles.map(row => 
        row.map(tile => {
          const distance = Math.abs(tile.position.x - newPos.x) + Math.abs(tile.position.y - newPos.y);
          if (distance <= 2) {
            return { ...tile, discovered: true };
          }
          return tile;
        })
      );
      
      return {
        ...current,
        worlds: {
          ...current.worlds,
          [current.currentWorld]: {
            ...world,
            playerPosition: newPos,
            tiles: updatedTiles
          }
        },
        player: {
          ...current.player,
          position: newPos,
          supplies: Math.max(0, newSupplies),
          artifacts: newArtifacts,
          gateFragments: newFragments
        },
        addresses: newAddresses,
        currentLevel: levelUp ? current.currentLevel + 1 : current.currentLevel,
        gameOver
      };
    });
  }, [setGameState, lastMoveTime]);

  const travelToWorld = useCallback((worldId: string) => {
    setGameState((current) => {
      const targetAddress = current.addresses.find(addr => addr.id === worldId);
      if (!targetAddress) {
        toast.error('Cannot find destination');
        return current;
      }
      
      // Check if player is at the gate position
      if (current.currentWorld) {
        const currentWorldData = current.worlds[current.currentWorld];
        if (currentWorldData) {
          const playerPos = current.player.position;
          const gatePos = currentWorldData.gatePosition;
          
          if (playerPos.x !== gatePos.x || playerPos.y !== gatePos.y) {
            toast.error('You must be at the Stargate to dial out!');
            return current;
          }
        }
      }
      
      let targetWorld = current.worlds[worldId];
      
      // Generate world if it doesn't exist
      if (!targetWorld && worldId !== 'earth') {
        const level = Object.keys(current.worlds).length;
        const biomeMap: Record<string, any> = {
          'abydos': 'desert'
        };
        
        targetWorld = generateWorld(
          worldId, 
          targetAddress.name, 
          biomeMap[worldId] || 'jungle', 
          level
        );
      }
      
      if (!targetWorld) {
        toast.error('Cannot generate destination world');
        return current;
      }
      
      toast.success(`Traveled to ${targetAddress.name}`);
      
      return {
        ...current,
        currentWorld: worldId,
        worlds: {
          ...current.worlds,
          [worldId]: targetWorld
        },
        player: {
          ...current.player,
          position: targetWorld.playerPosition
        },
        addresses: current.addresses.map(addr => 
          addr.id === worldId ? { ...addr, discovered: true } : addr
        )
      };
    });
  }, [setGameState]);

  const interactWithTile = useCallback((position: Position) => {
    setGameState((current) => {
      if (!current.currentWorld) return current;
      
      const world = current.worlds[current.currentWorld];
      const tile = world.tiles[position.y][position.x];
      
      switch (tile.type) {
        case 'ruins':
          toast.info('Ancient ruins. Search nearby for artifacts.');
          break;
        case 'gate':
          toast.info('Stargate is active. Use the control panel to travel.');
          break;
        default:
          toast.info('Nothing special here.');
      }
      
      return current;
    });
  }, [setGameState]);

  return {
    gameState,
    movePlayer,
    travelToWorld,
    interactWithTile,
    resetGame
  };
}