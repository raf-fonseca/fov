"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import FlyControls, { ControlsInstructions } from "./Controller";
import Lighting from "./Lighting";
import AdSlots from "./AdSlots";

const Model = () => {
  const { scene } = useGLTF("/main.glb");

  return <primitive object={scene} scale={1} position={[0, -25, 0]} />;
};

const ArenaModel = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }} shadows>
        {/* Import lighting from separate component */}
        <Lighting />

        <Suspense fallback={null}>
          <Model />

          {/* Add the billboards */}
          <AdSlots />
        </Suspense>

        {/* Import flying controls from separate component */}
        <FlyControls />
      </Canvas>

      {/* Import instructions overlay from Controller */}
      <ControlsInstructions />
    </div>
  );
};

export default ArenaModel;
