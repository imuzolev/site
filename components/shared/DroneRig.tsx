"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const damp = THREE.MathUtils.damp;

// Where the drone sits in the hero — kept clear of the centered CTA buttons.
const PLACES = {
  "upper-left": "top-[10%] left-[3%] h-[42%] w-[40%] max-w-[520px]",
  "upper-right": "top-[10%] right-[3%] h-[42%] w-[40%] max-w-[520px]",
} as const;

// Quadcopter motor mounts in an X layout (matches the two crossed arms).
const MOTORS: [number, number, number][] = [
  [0.88, 0, 0.88],
  [0.88, 0, -0.88],
  [-0.88, 0, 0.88],
  [-0.88, 0, -0.88],
];

/**
 * Background quadcopter for the hero composition. Propellers spin continuously;
 * on hover the drone lifts a little and the rotors spin up. Its own lightweight
 * WebGL scene — hover runs through a ref + per-frame damping (no React renders),
 * the loop pauses off-screen, and it never mounts on mobile / reduced-motion.
 */
export function DroneRig({ place = "upper-left" }: { place?: keyof typeof PLACES }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const ok =
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!enabled) return null;

  return (
    <div ref={wrap} className={`absolute z-[6] ${PLACES[place]}`}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0.6, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 4, 5]} intensity={26} color="#00D1FF" />
        <pointLight position={[-4, 1, 2]} intensity={12} color="#8B5CF6" />
        <Drone />
      </Canvas>
    </div>
  );
}

function Drone() {
  const hover = useRef(false);
  const parallax = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const props = useRef<THREE.Group[]>([]);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const lift = useRef(0);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;

    // Pointer parallax for a living 3D feel.
    if (parallax.current) {
      const { x, y } = state.pointer;
      parallax.current.rotation.y = damp(parallax.current.rotation.y, x * 0.4, 3, dt);
      parallax.current.rotation.x = damp(parallax.current.rotation.x, -y * 0.25, 3, dt);
    }

    lift.current = damp(lift.current, hover.current ? 1 : 0, 4, dt);
    const g = lift.current;

    if (body.current) {
      // Idle bob + hover lift, with a slight nose tilt as it rises.
      body.current.position.y = Math.sin(t * 1.5) * 0.06 + g * 0.6;
      body.current.rotation.x = damp(body.current.rotation.x, g * -0.12, 4, dt);
      body.current.rotation.z = Math.sin(t * 0.8) * 0.03;
    }

    // Rotors always spin; spin up on hover.
    const speed = 14 + g * 34;
    for (const p of props.current) if (p) p.rotation.y += speed * dt;

    if (glowMat.current) glowMat.current.opacity = 0.12 + g * 0.4;
  });

  return (
    <group ref={parallax}>
      {/* Invisible hit volume that drives the hover state. */}
      <mesh
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
      >
        <sphereGeometry args={[1.7, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={body}>
        {/* Crossed arms (X-frame). */}
        {[Math.PI / 4, -Math.PI / 4].map((r, i) => (
          <mesh key={i} rotation={[0, r, 0]}>
            <boxGeometry args={[2.5, 0.06, 0.12]} />
            <meshStandardMaterial color="#15202E" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}

        {/* Central body + glowing camera dome. */}
        <mesh>
          <boxGeometry args={[0.6, 0.22, 0.6]} />
          <meshStandardMaterial color="#0F1722" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <sphereGeometry args={[0.16, 18, 18]} />
          <meshStandardMaterial
            color="#031019"
            emissive="#00D1FF"
            emissiveIntensity={2.2}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Motors + spinning propellers. */}
        {MOTORS.map((pos, i) => (
          <group key={i} position={pos}>
            <mesh>
              <cylinderGeometry args={[0.12, 0.14, 0.18, 14]} />
              <meshStandardMaterial color="#1A2533" metalness={0.7} roughness={0.4} />
            </mesh>
            <group ref={(g) => { if (g) props.current[i] = g; }} position={[0, 0.12, 0]}>
              {[0, Math.PI / 2].map((r, j) => (
                <mesh key={j} rotation={[0, r, 0]}>
                  <boxGeometry args={[0.92, 0.012, 0.07]} />
                  <meshStandardMaterial
                    color="#00D1FF"
                    emissive="#00D1FF"
                    emissiveIntensity={0.4}
                    transparent
                    opacity={0.55}
                  />
                </mesh>
              ))}
              <mesh>
                <cylinderGeometry args={[0.05, 0.05, 0.06, 10]} />
                <meshStandardMaterial color="#2A3A4D" metalness={0.8} roughness={0.3} />
              </mesh>
            </group>
          </group>
        ))}

        {/* Soft under-glow that strengthens on lift. */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 32]} />
          <meshBasicMaterial
            ref={glowMat}
            color="#00D1FF"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
