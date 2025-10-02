import { Button } from "./ui/button";
import { Play, Info } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-background to-black">
      <div className="text-center space-y-8 p-8 max-w-md">
        <div>
          <h1 className="text-6xl font-bold mb-4 neon-glow text-primary animate-pulse-glow" style={{ color: 'hsl(var(--primary))' }}>
            TURBO
          </h1>
          <h1 className="text-6xl font-bold mb-4 neon-glow text-accent animate-pulse-glow" style={{ color: 'hsl(var(--accent))' }}>
            RACER 3D
          </h1>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
            <div>
              <p className="text-sm text-foreground font-semibold mb-1">How to Play</p>
              <p className="text-xs text-muted-foreground">Swipe LEFT and RIGHT to change lanes</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-accent mt-1 flex-shrink-0" style={{ color: 'hsl(var(--accent))' }} />
            <div>
              <p className="text-sm text-foreground font-semibold mb-1">Avoid Obstacles</p>
              <p className="text-xs text-muted-foreground">Don't hit the red boxes!</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-destructive mt-1 flex-shrink-0" style={{ color: 'hsl(var(--destructive))' }} />
            <div>
              <p className="text-sm text-foreground font-semibold mb-1">Speed Increases</p>
              <p className="text-xs text-muted-foreground">Game gets faster over time!</p>
            </div>
          </div>
        </div>

        <Button
          onClick={onStart}
          size="lg"
          className="w-full text-xl py-8 bg-primary hover:bg-primary/90 text-primary-foreground neon-border border-2"
          style={{ 
            backgroundColor: 'hsl(var(--primary))',
            borderColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))'
          }}
        >
          <Play className="w-6 h-6 mr-2" />
          START RACING
        </Button>
      </div>
    </div>
  );
};
