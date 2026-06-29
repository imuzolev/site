"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const damp = THREE.MathUtils.damp;

/**
 * Interactive sci-fi "sensor" — a glowing core ringed by a wireframe shell with
 * thin cables that extend/tension toward it on hover. Lives in the hero
 * background as part of the composition. All hover animation runs through a
 * shared `hover` ref + per-frame damping, so nothing re-renders React.
 */
export function SensorRig() {
  const wrap = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);

  // Skip WebGL entirely on small screens / reduced-motion to protect weak devices.
  useEffect(() => {
    const ok =
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);

  // Pause the render loop while the hero is scrolled away.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={wrap}
      className="absolute bottom-[6%] right-[4%] z-[6] h-[46%] w-[42%] max-w-[560px]"
    >
      <Canvas
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 4, 5]} intensity={30} color="#00D1FF" />
        <pointLight position={[-4, -2, 3]} intensity={15} color="#8B5CF6" />
        <Scene />
      </Canvas>
    </div>
  );
}

function Scene() {
  const hover = useRef(false);
  const group = useRef<THREE.Group>(null);

  const cables = useMemo(() => {
    const colors = ["#00D1FF", "#8B5CF6", "#00FFE5"];
    return Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2 + 0.4;
      const r = 2.5 + (i % 3) * 0.4;
      const anchor = new THREE.Vector3(
        Math.cos(a) * r,
        Math.sin(i * 1.7) * 1.5,
        Math.sin(a) * r * 0.55 + Math.cos(i * 2.1) * 0.8
      );
      return { anchor, color: colors[i % 3], key: i };
    });
  }, []);

  // Gentle idle rotation + pointer parallax for a living 3D feel.
  useFrame((state, delta) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y = damp(group.current.rotation.y, x * 0.5, 3, delta);
    group.current.rotation.x = damp(group.current.rotation.x, -y * 0.3, 3, delta);
  });

  return (
    <group ref={group}>
      {/* Invisible hit volume that drives the hover state. */}
      <mesh
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
      >
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Sensor hover={hover} />
      {cables.map((c) => (
        <Cable key={c.key} anchor={c.anchor} color={c.color} hover={hover} />
      ))}
    </group>
  );
}

function Sensor({ hover }: { hover: MutableRefObject<boolean> }) {
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const haloMat = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    glow.current = damp(glow.current, hover.current ? 1 : 0, 4, delta);
    const g = glow.current;

    if (coreMat.current)
      coreMat.current.emissiveIntensity = 0.5 + g * 3 + Math.sin(t * 3) * 0.15 * g;
    if (core.current) {
      core.current.scale.setScalar(1 + Math.sin(t * 2) * 0.04 + g * 0.15);
      core.current.rotation.y = t * 0.3;
      core.current.rotation.x = t * 0.15;
    }
    if (ring.current) ring.current.rotation.z = t * (0.4 + g * 1.4);
    if (shell.current) shell.current.rotation.y = -t * 0.1;
    if (halo.current) halo.current.scale.setScalar(1.5 + g * 1.5);
    if (haloMat.current) haloMat.current.opacity = 0.04 + g * 0.32;
  });

  return (
    <group>
      <mesh ref={halo}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial
          ref={haloMat}
          color="#00D1FF"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh ref={core}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          ref={coreMat}
          color="#0A1A2A"
          emissive="#00D1FF"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.018, 12, 64]} />
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={1.2} />
      </mesh>

      <mesh ref={shell}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#00D1FF" wireframe transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Cable({
  anchor,
  color,
  hover,
}: {
  anchor: THREE.Vector3;
  color: string;
  hover: MutableRefObject<boolean>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  // Build a thin cylinder whose base sits at the anchor and grows toward the
  // sensor at the origin, so scaling Y from 0→1 reads as the cable extending in.
  const { geometry, quaternion } = useMemo(() => {
    const len = anchor.length();
    const dir = anchor.clone().multiplyScalar(-1).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir
    );
    const geometry = new THREE.CylinderGeometry(0.012, 0.012, len, 6, 1, true);
    geometry.translate(0, len / 2, 0);
    return { geometry, quaternion };
  }, [anchor]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const target = hover.current ? 1 : 0;
    if (mesh.current)
      mesh.current.scale.y = damp(mesh.current.scale.y, target, 5, delta);
    if (mat.current) {
      mat.current.emissiveIntensity = damp(
        mat.current.emissiveIntensity,
        target * 2.4,
        5,
        delta
      );
      mat.current.opacity = damp(mat.current.opacity, 0.12 + target * 0.7, 5, delta);
    }
  });

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      position={anchor}
      quaternion={quaternion}
      scale={[1, 0, 1]}
    >
      <meshStandardMaterial
        ref={mat}
        color={color}
        emissive={color}
        emissiveIntensity={0}
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}
