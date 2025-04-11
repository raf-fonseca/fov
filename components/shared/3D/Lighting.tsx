"use client";

import { Environment, OrthographicCamera, Sphere } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const Lighting = () => {
  const shadowCameraRef = useRef<THREE.OrthographicCamera>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Sky environment */}
      <Environment preset="sunset" />

      {/* Main directional light (sun light) */}
      <directionalLight
        ref={lightRef}
        intensity={2.5}
        castShadow
        position={[-30, 120, -50]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={1000}
        shadow-bias={-0.0005}
        shadow-normalBias={0.04}
        color="#FFF8E7"
      >
        <OrthographicCamera
          left={-200}
          right={200}
          top={200}
          bottom={-200}
          ref={shadowCameraRef}
          attach={"shadow-camera"}
          near={10}
          far={1000}
        />
      </directionalLight>

      {/* Fill light for softer shadows */}
      <directionalLight
        intensity={0.8}
        position={[30, 20, 10]}
        color="#E6F0FF"
      />

      {/* Ambient light for overall scene brightness */}
      <ambientLight intensity={0.7} color="#FFFFFF" />
    </>
  );
};

export default Lighting;
