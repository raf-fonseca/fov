"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import { Text } from "@react-three/drei";
import { useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface BillboardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  size?: [number, number];
  borderDepth?: number;
  id: number;
  onSelect: (id: number) => void;
  isSelected: boolean;
  onBillboardClick: (id: number) => void;
  texture?: string | null;
}

// Billboard data array with manually configurable positions, rotations, and sizes
export const billboardData: {
  id: number;
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  borderDepth: number;
  name: string;
}[] = [
  {
    id: 1,
    position: [0, 34, -47.8],
    rotation: [0, 0, 0],
    size: [20, 8],
    borderDepth: 0.5,
    name: "Main Entrance Billboard",
  },
  {
    id: 2,
    position: [-37.9, 10, -3],
    rotation: [Math.PI * 2, Math.PI * 0.5, 0],
    size: [14, 10],
    borderDepth: 0.6,
    name: "West Wall",
  },
  {
    id: 3,
    position: [0, 34, 43],
    rotation: [0, Math.PI, 0],
    size: [20, 8],
    borderDepth: 0.5,
    name: "South Entrance",
  },
  //   {
  //     id: 4,
  //     position: [60, -5, -20],
  //     rotation: [Math.PI * 2, Math.PI / 2, 0],
  //     size: [4, 3],
  //     borderDepth: 0.4,
  //     name: "East Corner",
  //   },
  //   {
  //     id: 5,
  //     position: [-50, 10, -40],
  //     rotation: [Math.PI * 2, Math.PI * 1.25, 0],
  //     size: [7, 4],
  //     borderDepth: 0.6,
  //     name: "Northwest Tower",
  //   },
  //   {
  //     id: 6,
  //     position: [20, -8, 60],
  //     rotation: [Math.PI * 2, Math.PI * 0.75, 0],
  //     size: [5, 3],
  //     borderDepth: 0.5,
  //     name: "South Pavilion",
  //   },
  //   {
  //     id: 7,
  //     position: [-30, 25, 10],
  //     rotation: [Math.PI * 2, -Math.PI / 3, Math.PI / 20],
  //     size: [6, 4],
  //     borderDepth: 0.55,
  //     name: "North Balcony",
  //   },
  //   {
  //     id: 8,
  //     position: [45, 15, 45],
  //     rotation: [Math.PI * 2, Math.PI * 1.75, 0],
  //     size: [5, 3],
  //     borderDepth: 0.45,
  //     name: "Southeast Tower",
  //   },
  //   {
  //     id: 9,
  //     position: [-40, 5, 20],
  //     rotation: [Math.PI * 2, -Math.PI / 6, 0],
  //     size: [6, 4],
  //     borderDepth: 0.6,
  //     name: "West Entrance",
  //   },
];

// Billboard component with a 3D frame and a plane for content
const Billboard: React.FC<BillboardProps> = ({
  position,
  rotation = [0, 0, 0],
  size = [5, 3],
  borderDepth = 0.5,
  id,
  onSelect,
  isSelected,
  onBillboardClick,
  texture,
}) => {
  const contentRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);
  const [loadedTexture, setLoadedTexture] = useState<THREE.Texture | null>(
    null
  );

  // Load texture when it changes
  React.useEffect(() => {
    if (texture && contentRef.current) {
      const tex = textureLoader.load(texture, (loadedTex) => {
        // Configure texture for proper display
        loadedTex.flipY = true;
        loadedTex.wrapS = THREE.ClampToEdgeWrapping;
        loadedTex.wrapT = THREE.ClampToEdgeWrapping;
        loadedTex.minFilter = THREE.LinearFilter;
        loadedTex.colorSpace = THREE.SRGBColorSpace; // Use correct color space property

        // Get image dimensions
        const imageWidth = loadedTex.image.width;
        const imageHeight = loadedTex.image.height;
        const imageAspect = imageWidth / imageHeight;
        const planeAspect = size[0] / size[1];

        // Apply texture to material with proper settings
        if (contentRef.current) {
          // Create a new MeshBasicMaterial that ignores lighting
          const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: loadedTex,
            side: THREE.DoubleSide,
            toneMapped: false, // Disable tone mapping for more accurate colors
            transparent: true,
            opacity: 1.0,
          });

          // Set texture repeat and offset based on aspect ratio
          if (material.map) {
            if (imageAspect > planeAspect) {
              // Image is wider than plane - center horizontally
              const scale = planeAspect / imageAspect;
              material.map.repeat.set(1, scale);
              material.map.offset.set(0, (1 - scale) / 2);
            } else {
              // Image is taller than plane - center vertically
              const scale = imageAspect / planeAspect;
              material.map.repeat.set(scale, 1);
              material.map.offset.set((1 - scale) / 2, 0);
            }
          }

          // Replace the material
          contentRef.current.material = material;
        }

        setLoadedTexture(loadedTex);
      });
    }
  }, [texture, textureLoader, size]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();

    // Only proceed if the canvas is focused (pointer is locked)
    if (document.pointerLockElement) {
      onSelect(id);
      onBillboardClick(id);
    } else {
      console.log("Canvas must be focused to interact with billboards");
    }
  };

  // Consistent colors regardless of selection state
  const materialColor = "#ffffff";
  const borderColor = "#000000";

  // Calculate positions for border and content
  const borderPosition: [number, number, number] = [0, 0, 0]; // Border at center
  const contentOffset = 0.05; // Slight offset to place content in front of border
  const contentPosition: [number, number, number] = [
    0,
    0,
    borderDepth / 2 + contentOffset,
  ]; // Content in front of border

  return (
    <group position={position} rotation={new THREE.Euler(...rotation)}>
      {/* Border frame */}
      <mesh position={borderPosition} castShadow receiveShadow>
        <boxGeometry args={[size[0] + 0.6, size[1] + 0.6, borderDepth]} />
        <meshStandardMaterial color={borderColor} />
      </mesh>

      {/* Main content plane - in front of the border */}
      <mesh
        ref={contentRef}
        position={contentPosition}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[size[0], size[1]]} />
        {!texture ? (
          <meshBasicMaterial
            color={materialColor}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial
            color={materialColor}
            map={loadedTexture}
            side={THREE.DoubleSide}
            toneMapped={false}
            transparent={true}
            opacity={1.0}
          />
        )}
      </mesh>

      {/* Front face text - only show if no texture */}
      {!texture && (
        <Text
          position={[0, 0, contentPosition[2] + 0.01]}
          fontSize={0.4}
          color="#333333"
          anchorX="center"
          anchorY="middle"
          maxWidth={size[0] * 0.8}
          textAlign="center"
        >
          Click to Upload Content #{id}
        </Text>
      )}
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
  onBillboardClick?: (id: number) => void;
  billboardTextures?: Record<number, string>;
}

// Component that renders all billboards
const AdSlots: React.FC<AdSlotsProps> = ({
  onSelectSlot = () => {},
  selectedSlot,
  onBillboardClick = () => {},
  billboardTextures = {},
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

  const handleBillboardClick = useCallback(
    (id: number) => {
      onBillboardClick(id);
    },
    [onBillboardClick]
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
          borderDepth={data.borderDepth}
          onSelect={handleSelect}
          isSelected={selectedSlot === data.id}
          onBillboardClick={handleBillboardClick}
          texture={billboardTextures[data.id] || null}
        />
      ))}
    </>
  );
};

export default AdSlots;
