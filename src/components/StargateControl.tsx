import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GateAddress, Player, World } from '@/lib/types';

interface StargateControlProps {
  addresses: GateAddress[];
  player: Player;
  currentWorld: string | null;
  currentWorldData: World | null;
  onTravel: (worldId: string) => void;
}

export function StargateControl({ 
  addresses, 
  player, 
  currentWorld,
  currentWorldData,
  onTravel 
}: StargateControlProps) {
  const suppliesPercentage = (player.supplies / player.maxSupplies) * 100;
  
  // Check if player is at the gate position
  const isAtGate = currentWorldData ? 
    (player.position.x === currentWorldData.gatePosition.x && 
     player.position.y === currentWorldData.gatePosition.y) : false;
  
  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Stargate Control</h2>
        <div className="text-sm text-muted-foreground">
          {isAtGate ? 'Ready to dial' : 'Move to the Stargate to dial'}
        </div>
      </div>
      
      {/* Player Status */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm">📦 Supplies</div>
            <Progress 
              value={suppliesPercentage} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground text-center">
              {player.supplies}/{player.maxSupplies}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">💎 Artifacts</div>
            <div className="text-center">
              <Badge variant="secondary" className="text-accent">
                {player.artifacts.length}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm">📜 Fragments</div>
            <div className="text-center">
              <Badge variant="secondary" className="text-accent">
                {player.gateFragments}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">⚡ ZPM</div>
            <div className="text-center">
              <Badge variant={player.hasZPM ? "default" : "secondary"} className={player.hasZPM ? "bg-accent text-accent-foreground" : ""}>
                {player.hasZPM ? "Ready" : "Missing"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gate Addresses */}
      <div className="space-y-3">
        <div className="space-y-2">
          {addresses.map((address) => {
            const canDial = address.id === 'atlantis' ? 
              (currentWorld === 'earth' && player.hasZPM && isAtGate) : 
              isAtGate;
            
            return (
              <div key={address.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{address.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground stargate-symbols flex gap-1">
                      {address.symbols.map((symbol, index) => (
                        <span key={index} className="inline-block w-6 text-center">
                          {symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                  {currentWorld !== address.id && (
                    <Button
                      size="sm"
                      disabled={!canDial}
                      onClick={() => onTravel(address.id)}
                      className="bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                      Dial
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}