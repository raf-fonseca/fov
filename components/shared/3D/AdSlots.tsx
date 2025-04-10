"use client";

import React, { useRef } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface BillboardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  depth?: number;
  id: number;
}

// Billboard data array with manually configurable positions, rotations, and sizes
const billboardData: {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  depth: number;
}[] = [
  {
    id: 1,
    position: [30, 0, 30],
    rotation: [Math.PI * 2, Math.PI / 4, 0],
    size: [5, 3],
    depth: 0.3,
  },
  {
    id: 2,
    position: [-40, 5, 20],
    rotation: [Math.PI * 2, -Math.PI / 6, 0],
    size: [6, 4],
    depth: 0.4,
  },
  {
    id: 3,
    position: [0, 15, -50],
    rotation: [Math.PI * 2, Math.PI, 0],
    size: [8, 5],
    depth: 0.5,
  },
  {
    id: 4,
    position: [60, -5, -20],
    rotation: [Math.PI * 2, Math.PI / 2, 0],
    size: [4, 3],
    depth: 0.2,
  },
  {
    id: 5,
    position: [-50, 10, -40],
    rotation: [Math.PI * 2, Math.PI * 1.25, 0],
    size: [7, 4],
    depth: 0.4,
  },
  {
    id: 6,
    position: [20, -8, 60],
    rotation: [Math.PI * 2, Math.PI * 0.75, 0],
    size: [5, 3],
    depth: 0.3,
  },
  {
    id: 7,
    position: [-30, 25, 10],
    rotation: [Math.PI * 2, -Math.PI / 3, Math.PI / 20],
    size: [6, 4],
    depth: 0.35,
  },
  {
    id: 8,
    position: [45, 15, 45],
    rotation: [Math.PI * 2, Math.PI * 1.75, 0],
    size: [5, 3],
    depth: 0.25,
  },
  {
    id: 9,
    position: [-38, 10, -3],
    rotation: [Math.PI * 2, Math.PI * 0.5, 0],
    size: [14, 10],
    depth: 0.4,
  },
];

// Billboard component with a 3D cube with thickness
const Billboard: React.FC<BillboardProps> = ({
  position,
  rotation = [0, 0, 0],
  size = [5, 3],
  depth = 0.3,
  id,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position} rotation={new THREE.Euler(...rotation)}>
      {/* Main billboard body - a box with thickness */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[size[0], size[1], depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Black border - slightly larger box behind */}
      <mesh position={[0, 0, -0.01 - depth / 2]}>
        <boxGeometry args={[size[0] + 0.1, size[1] + 0.1, depth + 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Front face text */}
      <Text
        position={[0, 0, depth / 2 + 0.01]}
        fontSize={0.4}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={size[0] * 0.8}
        textAlign="center"
      >
        Your ad here (#{id})
      </Text>

      {/* Back face text (mirrored) */}
      <Text
        position={[0, 0, -depth / 2 - 0.01]}
        fontSize={0.4}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={size[0] * 0.8}
        textAlign="center"
        rotation={[0, Math.PI, 0]}
      >
        Your ad here (#{id})
      </Text>
    </group>
  );
};

// Component that renders all billboards
const AdSlots = () => {
  return (
    <>
      {billboardData.map((data) => (
        <Billboard
          key={data.id}
          id={data.id}
          position={data.position}
          rotation={data.rotation}
          size={data.size}
          depth={data.depth}
        />
      ))}
    </>
  );
};

export default AdSlots;
