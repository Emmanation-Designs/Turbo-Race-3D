import { useEffect, useState } from "react";

interface GameHUDProps {
  score: number;
  speed: number;
  gameStarted: boolean;
}

export const GameHUD = ({ score, speed, gameStarted }: GameHUDProps) => {
  const [speedPercent, setSpeedPercent] = useState(0);

  useEffect(() => {
    setSpeedPercent(Math.min((speed / 20) * 100, 100));
  }, [speed]);

  if (!gameStarted) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-10 p-4 pointer-events-none">
      <div className="max-w-md mx-auto flex justify-between items-start">
        <div className="bg-card/80 backdrop-blur-sm border-2 border-primary rounded-lg p-3 neon-border" style={{ borderColor: 'hsl(var(--primary))' }}>
          <div className="text-xs text-muted-foreground mb-1">SCORE</div>
          <div className="text-2xl font-bold text-primary neon-glow" style={{ color: 'hsl(var(--primary))' }}>
            {Math.floor(score)}
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border-2 border-accent rounded-lg p-3 neon-border" style={{ borderColor: 'hsl(var(--accent))' }}>
          <div className="text-xs text-muted-foreground mb-1">SPEED</div>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-secondary transition-all duration-300"
              style={{ width: `${speedPercent}%` }}
            />
          </div>
          <div className="text-xs text-accent mt-1 text-right" style={{ color: 'hsl(var(--accent))' }}>
            {Math.floor(speed * 10)} km/h
          </div>
        </div>
      </div>
    </div>
  );
};
