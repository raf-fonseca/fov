"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import FlyControls, { ControlsInstructions } from "./Controller";
import Lighting from "./Lighting";
import AdSlots, { billboardData } from "./AdSlots";
import FileUpload from "@/components/shared/FileUpload";

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
  canvasFocusable?: boolean;
  disableCanvasFocus?: () => void;
  enableCanvasFocus?: () => void;
}

const ArenaModel: React.FC<ArenaModelProps> = ({
  selectedSlotId,
  canvasFocusable = true,
  disableCanvasFocus,
  enableCanvasFocus,
}) => {
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
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // File upload state
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedBillboardId, setSelectedBillboardId] = useState<number | null>(
    null
  );

  // Texture state - store textures mapped to billboard IDs
  const [billboardTextures, setBillboardTextures] = useState<
    Record<number, string>
  >({});

  // Get selected billboard dimensions for the upload popup
  const getSelectedBillboardDimensions = useCallback((id: number | null) => {
    if (!id) return { width: 3, height: 2 }; // Default dimensions

    const billboard = billboardData.find((b) => b.id === id);
    if (billboard) {
      return {
        width: billboard.size[0],
        height: billboard.size[1],
      };
    }

    return { width: 3, height: 2 }; // Default dimensions
  }, []);

  // Move camera to position in front of billboard
  const moveCameraToBillboard = useCallback((id: number) => {
    const billboard = billboardData.find((b) => b.id === id);
    if (billboard) {
      // Find position in front of the billboard
      const rotationY = billboard.rotation[1];
      const offsetX = Math.sin(rotationY) * 10; // Slightly closer (10 units) to see the ad better
      const offsetZ = Math.cos(rotationY) * 10;

      // Calculate camera position
      const targetPosition: [number, number, number] = [
        billboard.position[0] + offsetX,
        billboard.position[1],
        billboard.position[2] + offsetZ,
      ];

      // Create look-at camera rotation
      const lookAt = new THREE.Vector3(
        billboard.position[0],
        billboard.position[1],
        billboard.position[2]
      );
      const cameraPos = new THREE.Vector3(
        targetPosition[0],
        targetPosition[1],
        targetPosition[2]
      );
      const direction = new THREE.Vector3()
        .subVectors(lookAt, cameraPos)
        .normalize();

      // Use matrix to calculate proper rotation
      const lookAtMatrix = new THREE.Matrix4();
      lookAtMatrix.lookAt(cameraPos, lookAt, new THREE.Vector3(0, 1, 0));
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(
        lookAtMatrix
      );
      const euler = new THREE.Euler().setFromQuaternion(quaternion);

      setCameraTarget(targetPosition);
      setCameraRotation([euler.x, euler.y, euler.z]);
      setIsTransitioning(true);
    }
  }, []);

  useEffect(() => {
    setSelectedSlot(selectedSlotId);

    // If external selection changes, teleport camera to that billboard
    if (selectedSlotId && selectedSlotId !== selectedSlot) {
      moveCameraToBillboard(selectedSlotId);
    }
  }, [selectedSlotId, selectedSlot, moveCameraToBillboard]);

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

  const handleBillboardClick = useCallback(
    (id: number) => {
      // Only proceed if canvas is focusable
      if (!canvasFocusable) {
        return; // Exit if canvas is not focusable
      }

      // Check if pointer is locked (canvas is focused)
      if (document.pointerLockElement) {
        setSelectedBillboardId(id);
        setSelectedSlot(id);
        setShowUploadPopup(true);

        // Move camera to the billboard when it's clicked
        moveCameraToBillboard(id);
      } else {
        // If pointer is not locked, don't show popup
        console.log("Canvas must be focused to interact with billboards");
      }
    },
    [moveCameraToBillboard, canvasFocusable]
  );

  const handleClosePopup = useCallback(() => {
    setShowUploadPopup(false);
  }, []);

  // Handle uploaded image by setting it in the billboardTextures state
  const handleImageUploaded = useCallback(
    (billboardId: number, textureUrl: string) => {
      setBillboardTextures((prev) => ({
        ...prev,
        [billboardId]: textureUrl,
      }));
    },
    []
  );

  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      ref={canvasContainerRef}
    >
      {/* Crosshair overlay positioned relative to Canvas */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            position: "relative",
          }}
        >
          {/* Horizontal line */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              width: "16px",
              height: "2px",
              backgroundColor: "white",
              transform: "translateY(-50%)",
              opacity: 0.7,
            }}
          />
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "2px",
              height: "16px",
              backgroundColor: "white",
              transform: "translateX(-50%)",
              opacity: 0.7,
            }}
          />
          {/* Center dot */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "4px",
              height: "4px",
              backgroundColor: "white",
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.9,
            }}
          />
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        shadows
        style={{ touchAction: "none" }} // Ensures touch events don't trigger scrolling
      >
        {/* Import lighting from separate component */}
        <Lighting />

        <Suspense fallback={null}>
          <Model />

          {/* Add the billboards */}
          <AdSlots
            onSelectSlot={handleSelectSlot}
            selectedSlot={selectedSlot}
            onBillboardClick={handleBillboardClick}
            billboardTextures={billboardTextures}
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
        <FlyControls canBeFocused={canvasFocusable} />
      </Canvas>

      {/* File Upload Popup - outside the Canvas to avoid R3F issues */}
      {showUploadPopup && (
        <FileUpload
          onClose={handleClosePopup}
          billboardId={selectedBillboardId}
          onImageUploaded={handleImageUploaded}
          disableCanvasFocus={disableCanvasFocus}
          enableCanvasFocus={enableCanvasFocus}
          billboardDimensions={getSelectedBillboardDimensions(
            selectedBillboardId
          )}
        />
      )}

      {/* Import instructions overlay from Controller */}
      <ControlsInstructions />
    </div>
  );
};

export default ArenaModel;
