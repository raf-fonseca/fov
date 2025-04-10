"use client";

import React, { useRef, useState, useCallback } from "react";
import { Text } from "@react-three/drei";
import { useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface BillboardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  depth?: number;
  id: number;
  onSelect: (id: number) => void;
  isSelected: boolean;
}

// Billboard data array with manually configurable positions, rotations, and sizes
export const billboardData: {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  depth: number;
  name: string;
}[] = [
  {
    id: 1,
    position: [0, 34, -47.8],
    rotation: [Math.PI * 2, Math.PI * 2, 0],
    size: [20, 8],
    depth: 0.3,
    name: "Main Entrance Billboard",
  },
  {
    id: 2,
    position: [-37.9, 10, -3],
    rotation: [Math.PI * 2, Math.PI * 0.5, 0],
    size: [14, 10],
    depth: 0.4,
    name: "West Wall",
  },
  {
    id: 3,
    position: [30, 0, 30],
    rotation: [Math.PI * 2, Math.PI, 0],
    size: [8, 5],
    depth: 0.5,
    name: "Southern Plaza",
  },
  {
    id: 4,
    position: [60, -5, -20],
    rotation: [Math.PI * 2, Math.PI / 2, 0],
    size: [4, 3],
    depth: 0.2,
    name: "East Corner",
  },
  {
    id: 5,
    position: [-50, 10, -40],
    rotation: [Math.PI * 2, Math.PI * 1.25, 0],
    size: [7, 4],
    depth: 0.4,
    name: "Northwest Tower",
  },
  {
    id: 6,
    position: [20, -8, 60],
    rotation: [Math.PI * 2, Math.PI * 0.75, 0],
    size: [5, 3],
    depth: 0.3,
    name: "South Pavilion",
  },
  {
    id: 7,
    position: [-30, 25, 10],
    rotation: [Math.PI * 2, -Math.PI / 3, Math.PI / 20],
    size: [6, 4],
    depth: 0.35,
    name: "North Balcony",
  },
  {
    id: 8,
    position: [45, 15, 45],
    rotation: [Math.PI * 2, Math.PI * 1.75, 0],
    size: [5, 3],
    depth: 0.25,
    name: "Southeast Tower",
  },
  {
    id: 9,
    position: [-40, 5, 20],
    rotation: [Math.PI * 2, -Math.PI / 6, 0],
    size: [6, 4],
    depth: 0.4,
    name: "West Entrance",
  },
];

// Billboard component with a 3D cube with thickness
const Billboard: React.FC<BillboardProps> = ({
  position,
  rotation = [0, 0, 0],
  size = [5, 3],
  depth = 0.3,
  id,
  onSelect,
  isSelected,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(id);
  };

  // Consistent colors regardless of selection state
  const materialColor = "#ffffff";
  const borderColor = "#000000";

  return (
    <group position={position} rotation={new THREE.Euler(...rotation)}>
      {/* Main billboard body - a box with thickness */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[size[0], size[1], depth]} />
        <meshStandardMaterial color={materialColor} />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, -0.01 - depth / 2]}>
        <boxGeometry args={[size[0] + 0.6, size[1] + 0.6, depth + 0.01]} />
        <meshStandardMaterial color={borderColor} />
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
        Click to Upload Content #{id}
      </Text>
    </group>
  );
};

interface AdSlotsProps {
  onSelectSlot?: (
    id: number,
    position: [number, number, number],
    cameraOffset?: [number, number, number]
  ) => void;
  selectedSlot?: number;
}

// Component that renders all billboards
const AdSlots: React.FC<AdSlotsProps> = ({
  onSelectSlot = () => {},
  selectedSlot,
}) => {
  const handleSelect = useCallback(
    (id: number) => {
      const billboard = billboardData.find((b) => b.id === id);
      if (billboard) {
        // Calculate camera position 15 units away from the billboard, facing it
        const position = billboard.position;

        // Get direction vector based on rotation (simplified - assumes y rotation is main facing direction)
        const rotationY = billboard.rotation[1];
        const offsetX = Math.sin(rotationY) * 15;
        const offsetZ = Math.cos(rotationY) * 15;

        // Position camera opposite the direction the billboard faces
        const cameraOffset: [number, number, number] = [-offsetX, 0, -offsetZ];

        onSelectSlot(id, position, cameraOffset);
      }
    },
    [onSelectSlot]
  );

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
          onSelect={handleSelect}
          isSelected={selectedSlot === data.id}
        />
      ))}
    </>
  );
};

export default AdSlots;
