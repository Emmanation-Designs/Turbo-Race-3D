import { useState, useEffect, useRef, useCallback } from "react";
import { RaceScene } from "@/components/RaceScene";
import { GameHUD } from "@/components/GameHUD";
import { GameOverScreen } from "@/components/GameOverScreen";
import { StartScreen } from "@/components/StartScreen";
import { initializeAdMob, showRewardAd } from "@/utils/admob";
import { toast } from "sonner";

interface Obstacle {
  id: number;
  lane: number;
  position: number;
}

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [carLane, setCarLane] = useState(1); // 0, 1, 2 (left, center, right)
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [adLoading, setAdLoading] = useState(false);
  
  const obstacleIdRef = useRef(0);
  const touchStartXRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const savedGameStateRef = useRef<{ score: number; speed: number; obstacles: Obstacle[] } | null>(null);

  // Initialize AdMob on mount
  useEffect(() => {
    initializeAdMob();
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Update score
      setScore((prev) => prev + speed * 0.1);

      // Increase speed over time (max speed: 20)
      setSpeed((prev) => Math.min(prev + 0.01, 20));

      // Move obstacles
      setObstacles((prev) =>
        prev
          .map((obs) => ({
            ...obs,
            position: obs.position + speed * 0.05,
          }))
          .filter((obs) => obs.position < 10) // Remove obstacles that passed
      );

      // Spawn new obstacles (max 2 at a time)
      const now = Date.now();
      if (obstacles.length < 2 && now - lastSpawnTimeRef.current > 1500 / speed) {
        const existingLanes = obstacles.map((obs) => obs.lane);
        const availableLanes = [0, 1, 2].filter((lane) => !existingLanes.includes(lane));
        
        if (availableLanes.length > 0) {
          const randomLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
          setObstacles((prev) => [
            ...prev,
            {
              id: obstacleIdRef.current++,
              lane: randomLane,
              position: -20,
            },
          ]);
          lastSpawnTimeRef.current = now;
        }
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, speed, obstacles.length]);

  // Touch controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!gameStarted || gameOver) return;
    touchStartXRef.current = e.touches[0].clientX;
  }, [gameStarted, gameOver]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!gameStarted || gameOver) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe right
        setCarLane((prev) => Math.min(prev + 1, 2));
      } else {
        // Swipe left
        setCarLane((prev) => Math.max(prev - 1, 0));
      }
    }
  }, [gameStarted, gameOver]);

  // Keyboard controls for desktop testing
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      if (e.key === "ArrowLeft") {
        setCarLane((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "ArrowRight") {
        setCarLane((prev) => Math.min(prev + 1, 2));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, gameOver]);

  const handleCollision = useCallback(() => {
    if (gameOver) return;
    
    // Save game state
    savedGameStateRef.current = {
      score,
      speed,
      obstacles: [...obstacles],
    };
    
    setGameOver(true);
    toast.error("Crash! Game Over");
  }, [gameOver, score, speed, obstacles]);

  const handleRestart = () => {
    setGameStarted(false);
    setGameOver(false);
    setCarLane(1);
    setObstacles([]);
    setScore(0);
    setSpeed(5);
    savedGameStateRef.current = null;
    obstacleIdRef.current = 0;
    lastSpawnTimeRef.current = 0;
  };

  const handleWatchAd = async () => {
    setAdLoading(true);
    
    try {
      await showRewardAd(
        () => {
          // Ad watched successfully - continue game
          if (savedGameStateRef.current) {
            setScore(savedGameStateRef.current.score);
            setSpeed(savedGameStateRef.current.speed);
            
            // Filter out obstacles that are too close to the car (in collision range)
            // Keep only obstacles that are far enough ahead or behind
            const safeObstacles = savedGameStateRef.current.obstacles.filter(
              (obs) => obs.position < -5 || obs.position > 8
            );
            setObstacles(safeObstacles);
          }
          setGameOver(false);
          toast.success("Nice! Continue racing!");
        },
        () => {
          // Ad failed or dismissed
          toast.error("Ad not available. Try restarting instead.");
        }
      );
    } finally {
      setAdLoading(false);
    }
  };

  const handleStart = () => {
    setGameStarted(true);
    toast.success("Race started! Swipe to dodge!");
  };

  return (
    <div
      className="w-full h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!gameStarted && !gameOver && <StartScreen onStart={handleStart} />}
      
      <RaceScene
        carLane={carLane}
        obstacles={obstacles}
        speed={speed}
        onCollision={handleCollision}
        gameStarted={gameStarted && !gameOver}
      />
      
      <GameHUD score={score} speed={speed} gameStarted={gameStarted && !gameOver} />
      
      {gameOver && (
        <GameOverScreen
          score={score}
          onRestart={handleRestart}
          onWatchAd={handleWatchAd}
          isLoading={adLoading}
        />
      )}
    </div>
  );
};

export default Index;
