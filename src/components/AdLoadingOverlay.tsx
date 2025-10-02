import { useEffect, useState } from "react";
import { Tv, Loader2 } from "lucide-react";

interface AdLoadingOverlayProps {
  onComplete: () => void;
}

export const AdLoadingOverlay = ({ onComplete }: AdLoadingOverlayProps) => {
  const [countdown, setCountdown] = useState(5);
  const [phase, setPhase] = useState<"loading" | "watching" | "complete">("loading");

  useEffect(() => {
    // Loading phase - 1 second
    const loadingTimer = setTimeout(() => {
      setPhase("watching");
      setCountdown(5);
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (phase !== "watching") return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setPhase("complete");
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [countdown, phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
      {phase === "loading" && (
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <p className="text-foreground text-lg">Loading Ad...</p>
        </div>
      )}

      {phase === "watching" && (
        <div className="text-center space-y-6 p-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 mb-4 animate-pulse-glow">
            <Tv className="w-12 h-12 text-accent" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Simulated Ad Playing
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              On mobile, a real video ad would play here
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border-2 border-accent rounded-lg p-6 neon-border">
            <div className="text-5xl font-bold text-accent neon-glow mb-2">
              {countdown}
            </div>
            <div className="text-sm text-muted-foreground">
              seconds remaining
            </div>
          </div>

          <div className="text-xs text-muted-foreground max-w-xs mx-auto">
            This is a browser simulation. Actual ads will display when deployed to mobile devices.
          </div>
        </div>
      )}

      {phase === "complete" && (
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-accent neon-glow animate-scale-in">
            ✓
          </div>
          <p className="text-foreground text-lg">Ad Complete!</p>
        </div>
      )}
    </div>
  );
};
