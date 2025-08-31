import { useGameState } from '@/hooks/useGameState';
import { StargateControl } from '@/components/StargateControl';
import { WorldMap } from '@/components/WorldMap';
import { GameOverModal } from '@/components/GameOverModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const {
    gameState,
    movePlayer,
    travelToWorld,
    interactWithTile,
    resetGame,
    handleCheat
  } = useGameState();

  const currentWorld = gameState.currentWorld ? gameState.worlds[gameState.currentWorld] : null;
  const currentAddress = gameState.currentWorld ? gameState.addresses.find(addr => addr.id === gameState.currentWorld) : null;

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Stargate Explorer</h1>
              <p className="text-muted-foreground">
                Navigate alien worlds, collect artifacts, and uncover new gate addresses
              </p>
            </div>
            <Button variant="outline" onClick={resetGame}>
              New Mission
            </Button>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Stargate Control Panel */}
          <div className="lg:col-span-1">
            <StargateControl
              addresses={gameState.addresses}
              player={gameState.player}
              currentWorld={gameState.currentWorld}
              currentWorldData={currentWorld}
              onTravel={travelToWorld}
            />
          </div>

          {/* World Map */}
          <div className="lg:col-span-2">
            {currentWorld ? (
              <WorldMap
                world={currentWorld}
                address={currentAddress}
                playerPosition={gameState.player.position}
                onMove={movePlayer}
                onInteract={interactWithTile}
                onCheat={handleCheat}
              />
            ) : (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <div className="text-6xl">⭕</div>
                  <h3 className="text-xl font-semibold">No Active Connection</h3>
                  <p className="text-muted-foreground">
                    Select a destination from the Stargate control panel to begin exploration
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Game Over Modal */}
        <GameOverModal
          isOpen={gameState.gameOver || gameState.victory}
          victory={gameState.victory}
          onRestart={resetGame}
        />
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;