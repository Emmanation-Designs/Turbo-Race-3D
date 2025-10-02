import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";
import * as THREE from "three";

interface RaceSceneProps {
  carLane: number;
  obstacles: Array<{ id: number; lane: number; position: number }>;
  speed: number;
  onCollision: () => void;
  gameStarted: boolean;
}

const Car = ({ lane }: { lane: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetX = (lane - 1) * 2.5;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        targetX,
        0.15
      );
    }
  });

  return (
    <Box ref={meshRef} args={[1.5, 0.8, 2]} position={[0, 0.4, 2]}>
      <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={0.5} />
    </Box>
  );
};

const Obstacle = ({ lane, position }: { lane: number; position: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const x = (lane - 1) * 2.5;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z = position;
    }
  });

  return (
    <Box ref={meshRef} args={[1.2, 1.2, 1.2]} position={[x, 0.6, position]}>
      <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.8} />
    </Box>
  );
};

const Road = ({ speed }: { speed: number }) => {
  const roadRef = useRef<THREE.Mesh>(null);
  const offset = useRef(0);

  useFrame((state, delta) => {
    if (roadRef.current) {
      offset.current += speed * delta;
      if (roadRef.current.material instanceof THREE.MeshStandardMaterial) {
        roadRef.current.material.map!.offset.y = offset.current;
      }
    }
  });

  const texture = new THREE.TextureLoader().load(
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzFhMWEyZSIvPjxyZWN0IHg9IjQ4IiB5PSIwIiB3aWR0aD0iNCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4zIi8+PHJlY3QgeD0iNDgiIHk9IjMwIiB3aWR0aD0iNCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4zIi8+PHJlY3QgeD0iNDgiIHk9IjYwIiB3aWR0aD0iNCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4zIi8+PHJlY3QgeD0iNDgiIHk9IjkwIiB3aWR0aD0iNCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4zIi8+PC9zdmc+'
  );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 20);

  return (
    <mesh ref={roadRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[8, 50]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const Scene = ({ carLane, obstacles, speed, onCollision, gameStarted }: RaceSceneProps) => {
  useFrame(() => {
    if (!gameStarted) return;

    const carX = (carLane - 1) * 2.5;
    const carZ = 2;

    obstacles.forEach((obstacle) => {
      const obstacleX = (obstacle.lane - 1) * 2.5;
      const obstacleZ = obstacle.position;

      const distance = Math.sqrt(
        Math.pow(carX - obstacleX, 2) + Math.pow(carZ - obstacleZ, 2)
      );

      if (distance < 1.5) {
        onCollision();
      }
    });
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 5]} intensity={1} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      
      <Road speed={speed} />
      <Car lane={carLane} />
      
      {gameStarted && obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} lane={obstacle.lane} position={obstacle.position} />
      ))}
      
      {/* Lane markers */}
      <Box args={[0.1, 0.1, 50]} position={[-2.5, 0.05, -15]}>
        <meshStandardMaterial color="#444" />
      </Box>
      <Box args={[0.1, 0.1, 50]} position={[2.5, 0.05, -15]}>
        <meshStandardMaterial color="#444" />
      </Box>
    </>
  );
};

export const RaceScene = (props: RaceSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 5, 8], fov: 60 }}
      style={{ width: "100%", height: "100vh", touchAction: "none" }}
    >
      <Scene {...props} />
    </Canvas>
  );
};
