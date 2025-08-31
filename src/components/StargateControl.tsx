import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GateAddress, Player } from '@/lib/types';
import { Zap, Package, Gem, Scroll } from '@phosphor-icons/react';

interface StargateControlProps {
  addresses: GateAddress[];
  player: Player;
  currentWorld: string | null;
  onTravel: (worldId: string) => void;
  onReturnToEarth: () => void;
}

export function StargateControl({ 
  addresses, 
  player, 
  currentWorld, 
  onTravel, 
  onReturnToEarth 
}: StargateControlProps) {
  const unlockedAddresses = addresses.filter(addr => addr.unlocked);
  const suppliesPercentage = (player.supplies / player.maxSupplies) * 100;
  
  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Stargate Control</h2>
        <div className="text-sm text-muted-foreground">
          Select destination coordinates
        </div>
      </div>
      
      {/* Player Status */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Package size={16} />
              <span>Supplies</span>
            </div>
            <Progress 
              value={suppliesPercentage} 
              className="h-2"
            />
            <div className="text-xs text-muted-foreground text-center">
              {player.supplies}/{player.maxSupplies}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Gem size={16} />
              <span>Artifacts</span>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="text-accent">
                {player.artifacts.length}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Scroll size={16} />
          <span className="text-sm">Gate Fragments: {player.gateFragments}</span>
        </div>
      </div>
      
      {/* Gate Addresses */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Zap size={16} />
          Available Destinations
        </h3>
        
        <div className="space-y-2">
          {unlockedAddresses.map((address) => (
            <div key={address.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{address.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {address.symbols.join(' ')}
                  </div>
                </div>
                {currentWorld !== address.id && (
                  <Button
                    size="sm"
                    onClick={() => onTravel(address.id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Dial
                  </Button>
                )}
              </div>
              
              {currentWorld === address.id && (
                <Badge variant="outline" className="w-full justify-center">
                  Current Location
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Emergency Return */}
      {currentWorld && currentWorld !== 'earth' && (
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={onReturnToEarth}
            className="w-full"
          >
            Emergency Return to Earth
          </Button>
        </div>
      )}
    </Card>
  );
}