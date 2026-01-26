'use client';

import { useRef, useLayoutEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { MotionValue, useSpring } from "framer-motion";
import * as THREE from "three";
import { useSmoothTransform } from "./useSmoothTransform";

interface ShapesProps {
  isHover: boolean;
  isPress: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function Shapes({ isHover, isPress, mouseX, mouseY }: ShapesProps) {
  const lightRotateX = useSmoothTransform(mouseY, spring, mouseToLightRotation);
  const lightRotateY = useSmoothTransform(mouseX, spring, mouseToLightRotation);

  return (
    <Canvas shadows dpr={[1, 2]} resize={{ scroll: false, offsetSize: true }}>
      <Camera mouseX={mouseX} mouseY={mouseY} />
      <LightGroup rotateX={lightRotateX} rotateY={lightRotateY} />
      <ShapesGroup isHover={isHover} isPress={isPress} />
    </Canvas>
  );
}

function LightGroup({
  rotateX,
  rotateY,
}: {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.x = rotateX.get();
    g.rotation.y = rotateY.get();
  });

  return (
    <group ref={groupRef}>
      <Lights />
    </group>
  );
}

function ShapesGroup({ isHover, isPress }: { isHover: boolean; isPress: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetZ = useSpring(isHover ? (isPress ? -0.9 : 0) : 0, spring);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    g.position.z = targetZ.get();
  });

  return (
    <group ref={groupRef}>
      <Sphere isHover={isHover} />
      <Cone isHover={isHover} />
      <Torus isHover={isHover} />
      <Icosahedron isHover={isHover} />
    </group>
  );
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <pointLight color="#f2056f" position={[15, 10, 5]} intensity={2} />
    </>
  );
}

function Sphere({ isHover }: { isHover: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const z = useSpring(isHover ? 2 : 0, spring);

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    m.position.z = z.get();
  });

  return (
    <mesh ref={meshRef} position={[-0.5, -0.5, 0]}>
      <sphereGeometry args={[0.4]} />
      <Material />
    </mesh>
  );
}

function Cone({ isHover }: { isHover: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const z = useSpring(isHover ? 1.1 : 0, spring);
  const x = useSpring(isHover ? -1.5 : -0.8, spring);
  const rx = useSpring(isHover ? -0.2 : -0.5, spring);
  const rz = useSpring(isHover ? 0.4 : -0.3, spring);

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    m.position.z = z.get();
    m.position.x = x.get();
    m.rotation.x = rx.get();
    m.rotation.z = rz.get();
  });

  return (
    <mesh ref={meshRef} position={[-0.8, 0.4, 0]} rotation={[-0.5, 0, -0.3]}>
      <coneGeometry args={[0.3, 0.6, 20]} />
      <Material />
    </mesh>
  );
}

function Torus({ isHover }: { isHover: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const y = useSpring(isHover ? 0.5 : 0.4, spring);
  const z = useSpring(isHover ? 2 : 0, spring);
  const ry = useSpring(isHover ? -0.2 : 0.5, spring);

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    m.position.y = y.get();
    m.position.z = z.get();
    m.rotation.y = ry.get();
  });

  return (
    <mesh ref={meshRef} position={[0.1, 0.4, 0]} rotation={[-0.5, 0.5, 0]}>
      <torusGeometry args={[0.2, 0.1, 10, 50]} />
      <Material />
    </mesh>
  );
}

function Icosahedron({ isHover }: { isHover: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const x = useSpring(isHover ? 1.8 : 1.1, spring);
  const z = useSpring(isHover ? 0.6 : 0, spring);
  const y = useSpring(isHover ? 0.6 : 0, spring);
  const rz = useSpring(isHover ? -0.5 : 0.5, spring);

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    m.position.x = x.get();
    m.position.z = z.get();
    m.position.y = y.get();
    m.rotation.z = rz.get();
  });

  return (
    <mesh ref={meshRef} position={[1.1, 0, 0]} rotation={[0, 0, 0.5]}>
      <icosahedronGeometry args={[0.7, 0]} />
      <Material />
    </mesh>
  );
}


function Material() {
  return (
    <meshPhysicalMaterial
      color="#ffffff"
      metalness={0.6}
      roughness={0.15}
      clearcoat={0.7}
      clearcoatRoughness={0.1}
    />
  );
}

function Camera({ mouseX, mouseY }: { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  const cameraX = useSmoothTransform(mouseX, spring, (x) => x / 350);
  const cameraY = useSmoothTransform(mouseY, spring, (y) => (-y) / 350);

  const set = useThree((s) => s.set);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const scene = useThree((s) => s.scene);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useLayoutEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    cam.aspect = size.width / size.height;
    cam.updateProjectionMatrix();
  }, [size]);

  useLayoutEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    const old = camera;
    set(() => ({ camera: cam }));
    return () => set(() => ({ camera: old }));
  }, [camera, set]);

  useFrame(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    cam.position.x = cameraX.get();
    cam.position.y = cameraY.get();
    cam.lookAt(scene.position);
  });

  return <perspectiveCamera ref={cameraRef} fov={90} position={[0, 0, 3.8]} />;
}

const spring = { stiffness: 600, damping: 30 };
const mouseToLightRotation = (v: number) => (-v) / 140;
