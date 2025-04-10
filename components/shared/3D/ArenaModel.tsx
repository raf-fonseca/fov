"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import FlyControls, { ControlsInstructions } from "./Controller";
import Lighting from "./Lighting";
import AdSlots, { billboardData } from "./AdSlots";

const Model = () => {
  const { scene } = useGLTF("/main.glb");

  return <primitive object={scene} scale={1} position={[0, -25, 0]} />;
};

interface CameraControllerProps {
  targetPosition: [number, number, number];
  targetRotation: [number, number, number];
}

const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition,
  targetRotation,
}) => {
  const { camera } = useThree();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const startPosition = useRef(new THREE.Vector3());
  const startQuaternion = useRef(new THREE.Quaternion());
  const targetQuaternion = useRef(new THREE.Quaternion());
  const animationProgress = useRef(0);

  useEffect(() => {
    if (targetPosition) {
      // Start a new camera transition
      startPosition.current.copy(camera.position);
      startQuaternion.current.copy(camera.quaternion);

      // Convert target rotation Euler to quaternion for smoother interpolation
      targetQuaternion.current.setFromEuler(
        new THREE.Euler(targetRotation[0], targetRotation[1], targetRotation[2])
      );

      animationProgress.current = 0;
      setIsTransitioning(true);
    }
  }, [targetPosition, targetRotation, camera]);

  useEffect(() => {
    let animationFrame: number;

    const animateCamera = () => {
      if (isTransitioning) {
        // Increment animation progress
        animationProgress.current += 0.02; // Adjust for faster/slower animation

        if (animationProgress.current >= 1) {
          // Animation complete
          setIsTransitioning(false);
          animationProgress.current = 1;
        }

        // Smooth ease-in-out function
        const easeInOut = (t: number): number =>
          t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const t = easeInOut(animationProgress.current);

        // Interpolate position
        camera.position.lerpVectors(
          startPosition.current,
          new THREE.Vector3(
            targetPosition[0],
            targetPosition[1],
            targetPosition[2]
          ),
          t
        );

        // Use quaternion slerp for rotation - much smoother, no spinning
        const tempQuaternion = new THREE.Quaternion();
        tempQuaternion.slerpQuaternions(
          startQuaternion.current,
          targetQuaternion.current,
          t
        );
        camera.quaternion.copy(tempQuaternion);

        animationFrame = requestAnimationFrame(animateCamera);
      }
    };

    if (isTransitioning) {
      animationFrame = requestAnimationFrame(animateCamera);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isTransitioning, targetPosition, camera]);

  return null;
};

interface ArenaModelProps {
  selectedSlotId?: number;
}

const ArenaModel: React.FC<ArenaModelProps> = ({ selectedSlotId }) => {
  const [cameraTarget, setCameraTarget] = useState<
    [number, number, number] | null
  >(null);
  const [cameraRotation, setCameraRotation] = useState<
    [number, number, number] | null
  >(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | undefined>(
    selectedSlotId
  );

  // Helper function to calculate the shortest rotation path
  const calculateOptimalRotation = (
    currentRotation: THREE.Euler,
    targetYRotation: number
  ): number => {
    // Get current y rotation and normalize to 0-2π range
    let currentY = currentRotation.y % (Math.PI * 2);
    if (currentY < 0) currentY += Math.PI * 2;

    // Normalize target rotation
    let targetY = targetYRotation % (Math.PI * 2);
    if (targetY < 0) targetY += Math.PI * 2;

    // Calculate the difference
    let diff = targetY - currentY;

    // Find the shortest path
    if (Math.abs(diff) > Math.PI) {
      if (diff > 0) {
        diff -= Math.PI * 2;
      } else {
        diff += Math.PI * 2;
      }
    }

    return currentY + diff;
  };

  useEffect(() => {
    setSelectedSlot(selectedSlotId);

    // If external selection changes, teleport camera to that billboard
    if (selectedSlotId && selectedSlotId !== selectedSlot) {
      const billboard = billboardData.find((b) => b.id === selectedSlotId);
      if (billboard) {
        // Find position in front of the billboard
        const rotationY = billboard.rotation[1];
        const offsetX = Math.sin(rotationY) * 15;
        const offsetZ = Math.cos(rotationY) * 15;

        // Calculate camera position and rotation
        setCameraTarget([
          billboard.position[0] + offsetX,
          billboard.position[1],
          billboard.position[2] + offsetZ,
        ]);

        // Calculate the look-at rotation (to stare at the billboard)
        const lookAtVector = new THREE.Vector3();
        lookAtVector
          .subVectors(
            new THREE.Vector3(
              billboard.position[0],
              billboard.position[1],
              billboard.position[2]
            ),
            new THREE.Vector3(
              billboard.position[0] + offsetX,
              billboard.position[1],
              billboard.position[2] + offsetZ
            )
          )
          .normalize();

        // Convert look-at direction to rotation
        const lookAtMatrix = new THREE.Matrix4();
        lookAtMatrix.lookAt(
          new THREE.Vector3(0, 0, 0),
          lookAtVector,
          new THREE.Vector3(0, 1, 0)
        );
        const lookAtQuaternion = new THREE.Quaternion();
        lookAtQuaternion.setFromRotationMatrix(lookAtMatrix);
        const euler = new THREE.Euler().setFromQuaternion(lookAtQuaternion);

        setCameraRotation([euler.x, euler.y, euler.z]);
        setIsTransitioning(true);
      }
    }
  }, [selectedSlotId, selectedSlot]);

  const handleSelectSlot = (
    id: number,
    position: [number, number, number],
    cameraOffset?: [number, number, number]
  ) => {
    setSelectedSlot(id);

    // Calculate camera position (in front of the billboard)
    const targetPosition: [number, number, number] = [
      position[0] + (cameraOffset?.[0] || 0),
      position[1] + (cameraOffset?.[1] || 0),
      position[2] + (cameraOffset?.[2] || 0),
    ];

    // Create look-at camera rotation
    const lookAt = new THREE.Vector3(position[0], position[1], position[2]);
    const cameraPos = new THREE.Vector3(
      targetPosition[0],
      targetPosition[1],
      targetPosition[2]
    );
    const direction = new THREE.Vector3()
      .subVectors(lookAt, cameraPos)
      .normalize();

    // Use matrix to calculate proper rotation without flipping
    const lookAtMatrix = new THREE.Matrix4();
    lookAtMatrix.lookAt(cameraPos, lookAt, new THREE.Vector3(0, 1, 0));
    const quaternion = new THREE.Quaternion().setFromRotationMatrix(
      lookAtMatrix
    );
    const euler = new THREE.Euler().setFromQuaternion(quaternion);

    setCameraTarget(targetPosition);
    setCameraRotation([euler.x, euler.y, euler.z]);
    setIsTransitioning(true);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }} shadows>
        {/* Import lighting from separate component */}
        <Lighting />

        <Suspense fallback={null}>
          <Model />

          {/* Add the billboards */}
          <AdSlots
            onSelectSlot={handleSelectSlot}
            selectedSlot={selectedSlot}
          />
        </Suspense>

        {/* Handle camera transitions */}
        {cameraTarget && cameraRotation && (
          <CameraController
            targetPosition={cameraTarget}
            targetRotation={cameraRotation}
          />
        )}

        {/* Import flying controls from separate component */}
        <FlyControls />
      </Canvas>

      {/* Import instructions overlay from Controller */}
      <ControlsInstructions />
    </div>
  );
};

export default ArenaModel;
