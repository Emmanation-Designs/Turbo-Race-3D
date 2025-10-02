import { Button } from "./ui/button";
import { Trophy, Play, Tv } from "lucide-react";

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onWatchAd: () => void;
  isLoading: boolean;
}

export const GameOverScreen = ({ score, onRestart, onWatchAd, isLoading }: GameOverScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-slide-up">
      <div className="bg-card border-2 border-destructive rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl neon-border" style={{ borderColor: 'hsl(var(--destructive))' }}>
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/20 mb-4">
            <Trophy className="w-10 h-10 text-destructive" style={{ color: 'hsl(var(--destructive))' }} />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-2 neon-glow text-destructive" style={{ color: 'hsl(var(--destructive))' }}>
              GAME OVER
            </h2>
            <p className="text-muted-foreground">You hit an obstacle!</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">FINAL SCORE</div>
            <div className="text-4xl font-bold text-primary neon-glow" style={{ color: 'hsl(var(--primary))' }}>
              {Math.floor(score)}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onWatchAd}
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 neon-border border-2"
              style={{ 
                backgroundColor: 'hsl(var(--accent))',
                borderColor: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))'
              }}
            >
              <Tv className="w-5 h-5 mr-2" />
              {isLoading ? "Loading Ad..." : "Watch Ad to Continue"}
            </Button>

            <Button
              onClick={onRestart}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10 text-lg py-6"
              style={{ 
                borderColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary))'
              }}
            >
              <Play className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
