"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const damp = THREE.MathUtils.damp;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type Accent = "cyan" | "violet";
const ACCENTS: Record<Accent, { core: string; light: string }> = {
  cyan: { core: "#00D1FF", light: "#00D1FF" },
  violet: { core: "#8B5CF6", light: "#A78BFA" },
};

// Where each rig sits in the hero — kept clear of the centered CTA buttons.
const PLACES = {
  "lower-right": "bottom-[6%] right-[4%] h-[46%] w-[42%] max-w-[560px]",
  "upper-left": "top-[12%] left-[3%] h-[40%] w-[36%] max-w-[460px]",
} as const;

/**
 * Interactive sci-fi "sensor" living in the hero background. On hover it
 * activates: the core glows, thin cables extend out of the scene and latch on,
 * and once connected the unit "boots" — indicator LEDs blink and the light
 * pulses. Leaving the area reverses the whole sequence. All hover animation
 * runs through a `hover` ref + per-frame damping, so React never re-renders.
 */
export function SensorRig({
  place = "lower-right",
  accent = "cyan",
}: {
  place?: keyof typeof PLACES;
  accent?: Accent;
}) {
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
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 4, 5]} intensity={30} color={ACCENTS[accent].light} />
        <pointLight position={[-4, -2, 3]} intensity={15} color="#8B5CF6" />
        <Scene accent={accent} />
      </Canvas>
    </div>
  );
}

function Scene({ accent }: { accent: Accent }) {
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
      // Stagger when each cable finishes connecting (0..1 along the ramp).
      return { anchor, color: colors[i % 3], key: i, delay: 0.25 + (i / 7) * 0.5 };
    });
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y = damp(group.current.rotation.y, x * 0.5, 3, delta);
    group.current.rotation.x = damp(group.current.rotation.x, -y * 0.3, 3, delta);
  });

  return (
    <group ref={group}>
      <mesh
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
      >
        <sphereGeometry args={[1.7, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Sensor hover={hover} accent={accent} />
      {cables.map((c) => (
        <Cable key={c.key} anchor={c.anchor} color={c.color} delay={c.delay} hover={hover} />
      ))}
    </group>
  );
}

// Indicator LED positions around the core (on the ring plane).
const LEDS = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 6) * Math.PI * 2;
  return new THREE.Vector3(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0);
});

function Sensor({
  hover,
  accent,
}: {
  hover: MutableRefObject<boolean>;
  accent: Accent;
}) {
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const haloMat = useRef<THREE.MeshBasicMaterial>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const pulseMat = useRef<THREE.MeshBasicMaterial>(null);
  const leds = useRef<THREE.MeshStandardMaterial[]>([]);
  const glow = useRef(0); // 0→1 activation
  const color = ACCENTS[accent].core;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    glow.current = damp(glow.current, hover.current ? 1 : 0, 4, delta);
    const g = glow.current;
    // "Working" only kicks in once activation is nearly complete (cables connected).
    const working = clamp01((g - 0.7) / 0.3);

    if (coreMat.current)
      coreMat.current.emissiveIntensity = 0.5 + g * 3 + Math.sin(t * 4) * 0.4 * working;
    if (core.current) {
      core.current.scale.setScalar(1 + Math.sin(t * 2) * 0.04 + g * 0.15);
      core.current.rotation.y = t * 0.3;
      core.current.rotation.x = t * 0.15;
    }
    if (ring.current) ring.current.rotation.z = t * (0.4 + g * 1.4);
    if (shell.current) shell.current.rotation.y = -t * 0.1;
    if (halo.current) halo.current.scale.setScalar(1.5 + g * 1.5);
    if (haloMat.current) haloMat.current.opacity = 0.04 + g * 0.32;

    // Expanding pulse ring once online.
    if (pulse.current && pulseMat.current) {
      const f = (t * 0.6) % 1; // 0→1 repeating
      pulse.current.scale.setScalar(1 + f * 1.6);
      pulseMat.current.opacity = working * (1 - f) * 0.6;
    }

    // Blinking indicator LEDs, each on its own phase, gated by `working`.
    for (let i = 0; i < leds.current.length; i++) {
      const m = leds.current[i];
      if (!m) continue;
      const blink = Math.sin(t * 7 + i * 1.3) > 0 ? 1 : 0.04;
      m.emissiveIntensity = working * blink * 3;
      m.opacity = 0.15 + working * 0.85;
    }
  });

  return (
    <group>
      <mesh ref={halo}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial
          ref={haloMat}
          color={color}
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
          emissive={color}
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
        <meshBasicMaterial color={color} wireframe transparent opacity={0.16} />
      </mesh>

      {/* Expanding pulse ring (visible once the sensor is online). */}
      <mesh ref={pulse} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.012, 8, 48]} />
        <meshBasicMaterial
          ref={pulseMat}
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Indicator LEDs. */}
      {LEDS.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) leds.current[i] = m;
            }}
            color="#0A1A2A"
            emissive={i % 2 ? "#00FFE5" : color}
            emissiveIntensity={0}
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

function Cable({
  anchor,
  color,
  delay,
  hover,
}: {
  anchor: THREE.Vector3;
  color: string;
  delay: number;
  hover: MutableRefObject<boolean>;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const t = useRef(0); // eased connect progress 0→1

  // Thin cylinder whose base sits at the anchor and grows toward the sensor at
  // the origin, so scaling Y from 0→1 reads as the cable extending in to connect.
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

  useFrame((_, dt) => {
    // Staggered connect: this cable only starts pulling in after `delay`.
    const target = hover.current ? 1 : 0;
    t.current = damp(t.current, target, 5, dt);
    const p = clamp01((t.current - delay) / (1 - delay));
    if (mesh.current) mesh.current.scale.y = p;
    if (mat.current) {
      mat.current.emissiveIntensity = p * 2.4;
      mat.current.opacity = 0.12 + p * 0.7;
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
