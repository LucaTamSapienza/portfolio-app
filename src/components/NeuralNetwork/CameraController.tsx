"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { SECTION_CAMERA_TARGETS } from "@/lib/graph";

const SECTIONS = ["about", "experience", "projects", "opensource", "skills", "contact"];

interface CameraControllerProps {
  activeSection: number;
}

export function CameraController({ activeSection }: CameraControllerProps) {
  const { camera, gl } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const baseCameraPos = useRef(new THREE.Vector3(0, 2, 22));
  const orbitAngle = useRef(0);
  const isAnimating = useRef(false);
  const prevSection = useRef(-1);

  // Drag orbit state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartAngle = useRef(0);
  const yawAngle = useRef(0);         // accumulated horizontal orbit
  const yawVelocity = useRef(0);      // momentum after release
  const lastDragX = useRef(0);
  const lastDragTime = useRef(0);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;

      // Track velocity for momentum
      if (isDragging.current) {
        const now = performance.now();
        const dt = now - lastDragTime.current;
        if (dt > 0) {
          yawVelocity.current = ((e.clientX - lastDragX.current) / window.innerWidth) * -2.0 / (dt / 16);
        }
        lastDragX.current = e.clientX;
        lastDragTime.current = now;

        // Update yaw from drag delta
        const deltaX = (e.clientX - dragStartX.current) / window.innerWidth;
        yawAngle.current = dragStartAngle.current + deltaX * -2.5;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Drag handlers on the canvas
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      // Only start drag for left button, and not on UI overlays
      if (e.button !== 0) return;
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartAngle.current = yawAngle.current;
      lastDragX.current = e.clientX;
      lastDragTime.current = performance.now();
      yawVelocity.current = 0;
      canvas.style.cursor = "grabbing";
    };

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        canvas.style.cursor = "auto";
      }
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [gl]);

  // Fly camera to section
  useEffect(() => {
    if (activeSection === prevSection.current) return;
    prevSection.current = activeSection;

    const sectionName = SECTIONS[activeSection] || "about";
    const target = SECTION_CAMERA_TARGETS[sectionName];
    if (!target) return;

    isAnimating.current = true;

    // Animate the base position (before orbit offset)
    gsap.to(baseCameraPos.current, {
      x: target.position[0],
      y: target.position[1],
      z: target.position[2],
      duration: 1.6,
      ease: "power2.inOut",
      onComplete: () => { isAnimating.current = false; },
    });

    // Gently ease out the drag offset on section change
    gsap.to(yawAngle, { current: 0, duration: 1.2, ease: "power2.out" });
    yawVelocity.current = 0;

    lookAtTarget.current.set(...target.lookAt);
  }, [activeSection, camera]);

  useFrame((_, delta) => {
    // Apply momentum when not dragging
    if (!isDragging.current) {
      yawAngle.current += yawVelocity.current * delta;
      yawVelocity.current *= 0.94; // friction
      if (Math.abs(yawVelocity.current) < 0.0001) yawVelocity.current = 0;
    }

    // Subtle idle drift
    if (!isAnimating.current && !isDragging.current) {
      orbitAngle.current += delta * 0.04;
      const driftX = Math.sin(orbitAngle.current) * 0.3;
      const driftY = Math.cos(orbitAngle.current * 0.7) * 0.15;
      baseCameraPos.current.x += driftX * delta * 0.5;
      baseCameraPos.current.y += driftY * delta * 0.5;
    }

    // Compute orbited camera position around the lookAt target
    const pivot = lookAtTarget.current;
    const offset = baseCameraPos.current.clone().sub(pivot);
    const radius = Math.sqrt(offset.x * offset.x + offset.z * offset.z);
    const baseAngle = Math.atan2(offset.x, offset.z);
    const finalAngle = baseAngle + yawAngle.current;

    camera.position.set(
      pivot.x + Math.sin(finalAngle) * radius,
      baseCameraPos.current.y,
      pivot.z + Math.cos(finalAngle) * radius,
    );

    // Mouse parallax offset on lookAt
    const parallaxX = mouseRef.current.x * 1.5;
    const parallaxY = -mouseRef.current.y * 0.8;
    const targetLookAt = pivot.clone().add(
      new THREE.Vector3(parallaxX, parallaxY, 0)
    );

    currentLookAt.current.lerp(targetLookAt, Math.min(delta * 3, 1));
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
