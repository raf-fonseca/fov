"use client";

import { Environment, Sky, Stars } from "@react-three/drei";
import * as THREE from "three";

const Lighting = () => {
  return (
    <>
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
    </>
  );
};

export default Lighting;
