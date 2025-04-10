"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Sky,
  Stars,
} from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

const Model = () => {
  const { scene } = useGLTF("/main.glb");

  return <primitive object={scene} scale={1} position={[0, -25, 0]} />;
};

const CameraController = () => {
  const { camera } = useThree();

  return null;
};

const ArenaModel = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }} shadows>
        {/* Enhanced lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight
          position={[-10, 10, -5]}
          intensity={0.8}
          color="#8fb5ff"
        />
        <hemisphereLight
          args={["#88bbff", "#444422", 0.7]}
          position={[0, 50, 0]}
        />

        {/* Bright blue sky */}
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0.6}
          azimuth={0.25}
          mieCoefficient={0.01}
          mieDirectionalG={0.8}
          rayleigh={0.5}
          turbidity={8}
        />

        {/* Optional stars for added effect */}
        <Stars radius={100} depth={50} count={1000} factor={4} fade />

        {/* Environment map for realistic reflections */}
        <Environment preset="sunset" background={false} />

        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <CameraController />
        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          minDistance={2}
          maxDistance={20}
          enableDamping
        />
      </Canvas>
    </div>
  );
};

export default ArenaModel;
