import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface GameOverModalProps {
  isOpen: boolean;
  victory: boolean;
  onRestart: () => void;
}

export function GameOverModal({ isOpen, victory, onRestart }: GameOverModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className={`sm:max-w-md ${victory ? '[&>button]:hidden' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {victory ? '🎉 Victory!' : '💀 Mission Failed'}
          </DialogTitle>
        </DialogHeader>
        
        <Card className="p-6 space-y-4">
          <div className="text-center space-y-2">
            {victory ? (
              <>
                <p className="text-lg font-semibold text-accent">
                  You successfully reached Atlantis!
                </p>
                <p className="text-sm text-muted-foreground">
                  Using the ZPM, you dialed the 8-chevron address and established a connection to the lost city of Atlantis. Your mission is complete!
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-destructive">
                  Your mission has ended in failure.
                </p>
                <p className="text-sm text-muted-foreground">
                  You ran out of supplies or fell to the dangers of an alien world. The Stargate program will remember your sacrifice.
                </p>
              </>
            )}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={onRestart} className="bg-primary hover:bg-primary/90">
              Start New Mission
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}