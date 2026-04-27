"use client"; // Next.js App Router 必须声明为客户端组件

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import {
  OrbitControls,
  Float,
  MeshDistortMaterial,
  ContactShadows,
} from "@react-three/drei";

function AnimatedShape() {
  const meshRef = useRef<Mesh>(null!);

  // 每帧旋转，类似之前的 animate 函数
//   useFrame((state, delta) => {
//     meshRef.current.rotation.x += delta * 0.2;
//     meshRef.current.rotation.y += delta * 0.3;
//   });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      {/* 使用 drei 提供的酷炫材质 */}
      <MeshDistortMaterial color="#3b82f6" speed={5} distort={0} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="h-screen w-full bg-slate-900 rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], near: 0.1, fov: 35 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <axesHelper args={[10]} />
        <OrbitControls enableDamping={true} enableZoom={true}  autoRotate={false} dampingFactor={0.5}/>
        {/* 让物体漂浮的特效 */}
        {/* <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          
        </Float> */}
<AnimatedShape />
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={1}
        />
      </Canvas>
    </div>
  );
}
