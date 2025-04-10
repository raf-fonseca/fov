"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

// Custom flying controls
const FlyControls = () => {
  const { camera } = useThree();
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const pointerLockRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Set up key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for navigation keys
      if (
        [
          "KeyW",
          "KeyS",
          "KeyA",
          "KeyD",
          "Space",
          "ShiftLeft",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.code)
      ) {
        e.preventDefault();
      }

      switch (e.code) {
        case "KeyW":
          moveState.current.backward = true;
          break;
        case "KeyS":
          moveState.current.forward = true;
          break;
        case "KeyA":
          moveState.current.left = true;
          break;
        case "KeyD":
          moveState.current.right = true;
          break;
        case "Space":
          moveState.current.up = true;
          break;
        case "ShiftLeft":
          moveState.current.down = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Prevent default for navigation keys
      if (
        [
          "KeyW",
          "KeyS",
          "KeyA",
          "KeyD",
          "Space",
          "ShiftLeft",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.code)
      ) {
        e.preventDefault();
      }

      switch (e.code) {
        case "KeyW":
          moveState.current.backward = false;
          break;
        case "KeyS":
          moveState.current.forward = false;
          break;
        case "KeyA":
          moveState.current.left = false;
          break;
        case "KeyD":
          moveState.current.right = false;
          break;
        case "Space":
          moveState.current.up = false;
          break;
        case "ShiftLeft":
          moveState.current.down = false;
          break;
      }
    };

    // Prevent scrolling on wheel events when pointer is locked
    const handleWheel = (e: WheelEvent) => {
      if (isLocked) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isLocked]);

  // Handle pointer lock state changes
  useEffect(() => {
    const handleLockChange = () => {
      const isCurrentlyLocked = document.pointerLockElement !== null;
      setIsLocked(isCurrentlyLocked);

      // When locked, prevent scrolling
      if (isCurrentlyLocked) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("pointerlockchange", handleLockChange);
    return () => {
      document.removeEventListener("pointerlockchange", handleLockChange);
      // Reset overflow
      document.body.style.overflow = "";
    };
  }, []);

  // Movement logic in animation frame
  useFrame((_, delta) => {
    if (!isLocked) return;

    // Movement speed (adjust as needed)
    const speed = 20;
    velocity.current.set(0, 0, 0);
    direction.current.set(0, 0, 0);

    // Calculate movement direction
    direction.current.z =
      Number(moveState.current.forward) - Number(moveState.current.backward);
    direction.current.x =
      Number(moveState.current.right) - Number(moveState.current.left);
    direction.current.y =
      Number(moveState.current.up) - Number(moveState.current.down);
    direction.current.normalize();

    // Apply direction to velocity
    velocity.current.z = direction.current.z * speed * delta;
    velocity.current.x = direction.current.x * speed * delta;
    velocity.current.y = direction.current.y * speed * delta;

    // Move camera in local space
    camera.translateX(velocity.current.x);
    camera.translateY(velocity.current.y);
    camera.translateZ(velocity.current.z);
  });

  return <PointerLockControls ref={pointerLockRef} />;
};

// Instructions overlay component
export const ControlsInstructions = () => (
  <div
    style={{
      position: "absolute",
      bottom: 20,
      left: 20,
      background: "rgba(0,0,0,0.5)",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      pointerEvents: "none",
    }}
  >
    Click to enable controls
    <br />
    WASD: Move around
    <br />
    Space: Move up
    <br />
    Shift: Move down
    <br />
    Mouse: Look around
  </div>
);

export default FlyControls;
