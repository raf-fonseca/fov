"use client";

import { Environment, OrthographicCamera, Sky } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Lighting = () => {
  const shadowCameraRef = useRef<THREE.OrthographicCamera>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Subtle blue sky */}
      <Sky
        distance={450000}
        sunPosition={[-500, 500, -300]}
        inclination={0.5}
        azimuth={0.25}
        mieCoefficient={0.05}
        mieDirectionalG={0.6}
        rayleigh={0.8}
        turbidity={10}
      />

      {/* Environment map for realistic reflections */}
      <Environment preset="sunset" background={false} />

      {/* Main directional light with good shadows */}
      <directionalLight
        ref={lightRef}
        intensity={0.4}
        castShadow
        position={[-100, 100, -50]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={1000}
        shadow-bias={-0.0005}
        shadow-normalBias={0.04}
        color="#FFF8E7"
      >
        <OrthographicCamera
          ref={shadowCameraRef}
          left={-200}
          right={200}
          top={200}
          bottom={-200}
          attach="shadow-camera"
          near={10}
          far={1000}
        />
      </directionalLight>

      {/* Fill light for softer shadows */}
      <directionalLight
        intensity={0.2}
        position={[30, 20, 10]}
        color="#E6F0FF"
      />

      {/* Ambient light for overall scene brightness - low for better shadows */}
      <ambientLight intensity={0.15} color="#FFFFFF" />

      {/* Additional hemisphere light - subtle color temperature balance */}
      <hemisphereLight color="#87CEEB" groundColor="#8A7F80" intensity={0.25} />

      {/* Adjust environment intensity through a scene intensity multiplier */}
      <directionalLight
        intensity={0.3}
        position={[100, 50, -100]}
        color="#FFFAF0"
      />
    </>
  );
};

export default Lighting;
