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
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const orbitAngle = useRef(0);
  const isAnimating = useRef(false);
  const prevSection = useRef(-1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fly camera to section
  useEffect(() => {
    if (activeSection === prevSection.current) return;
    prevSection.current = activeSection;

    const sectionName = SECTIONS[activeSection] || "about";
    const target = SECTION_CAMERA_TARGETS[sectionName];
    if (!target) return;

    isAnimating.current = true;
    gsap.to(camera.position, {
      x: target.position[0],
      y: target.position[1],
      z: target.position[2],
      duration: 1.6,
      ease: "power2.inOut",
      onComplete: () => { isAnimating.current = false; },
    });

    lookAtTarget.current.set(...target.lookAt);
  }, [activeSection, camera]);

  useFrame((_, delta) => {
    // Subtle idle drift
    if (!isAnimating.current) {
      orbitAngle.current += delta * 0.04;
      const driftX = Math.sin(orbitAngle.current) * 0.3;
      const driftY = Math.cos(orbitAngle.current * 0.7) * 0.15;
      camera.position.x += driftX * delta * 0.5;
      camera.position.y += driftY * delta * 0.5;
    }

    // Mouse parallax offset on lookAt
    const parallaxX = mouseRef.current.x * 1.5;
    const parallaxY = -mouseRef.current.y * 0.8;
    const targetLookAt = lookAtTarget.current.clone().add(
      new THREE.Vector3(parallaxX, parallaxY, 0)
    );

    currentLookAt.current.lerp(targetLookAt, Math.min(delta * 3, 1));
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
