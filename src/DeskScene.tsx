import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

function DeskModel() {
  const model = useRef<Group>(null)
  useFrame(({ pointer }) => {
    if (!model.current) return
    model.current.rotation.y += (pointer.x * 0.08 - model.current.rotation.y) * 0.04
    model.current.rotation.x += (-pointer.y * 0.025 - model.current.rotation.x) * 0.04
  })

  return (
    <group ref={model} position={[0, -0.45, 0]}>
      <mesh position={[0, -1.15, 0]} receiveShadow>
        <boxGeometry args={[7.6, 0.28, 4.2]} />
        <meshStandardMaterial color="#2a170d" roughness={0.82} />
      </mesh>

      <group position={[0, 0.25, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 2.9, 1.35]} />
          <meshStandardMaterial color="#81745c" roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.12, 0.69]}>
          <boxGeometry args={[3.15, 2.18, 0.08]} />
          <meshStandardMaterial color="#08130a" emissive="#1e5b2a" emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0, -1.8, -0.05]} castShadow>
          <boxGeometry args={[0.85, 0.75, 0.85]} />
          <meshStandardMaterial color="#6e644f" />
        </mesh>
        <mesh position={[0, -2.12, -0.02]} castShadow>
          <boxGeometry args={[2.4, 0.16, 1.2]} />
          <meshStandardMaterial color="#5f5544" />
        </mesh>
      </group>

      <mesh position={[0, -0.83, 2]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[4.2, 0.18, 1.45]} />
        <meshStandardMaterial color="#756a55" roughness={0.88} />
      </mesh>
      <mesh position={[-2.85, -0.63, 1.45]} rotation={[-0.05, 0.16, 0]} castShadow>
        <boxGeometry args={[1.2, 0.16, 1]} />
        <meshStandardMaterial color="#171a12" emissive="#6d7d24" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[2.8, -0.74, 1.25]} rotation={[-0.08, -0.18, 0]} castShadow>
        <boxGeometry args={[1.55, 0.19, 0.95]} />
        <meshStandardMaterial color="#151713" />
      </mesh>
      <mesh position={[2.82, -0.62, 1.22]} rotation={[-0.08, -0.18, 0]}>
        <boxGeometry args={[1.1, 0.03, 0.55]} />
        <meshStandardMaterial color="#7a8836" emissive="#58651f" emissiveIntensity={0.45} />
      </mesh>
    </group>
  )
}

export default function DeskScene() {
  return (
    <Canvas className="desk-canvas" camera={{ position: [0, 2.4, 8.2], fov: 44 }} dpr={[1, 1.5]} shadows>
      <color attach="background" args={['#070706']} />
      <fog attach="fog" args={['#070706', 7, 14]} />
      <ambientLight intensity={0.55} color="#8fa15a" />
      <pointLight position={[3.8, 5, 4]} intensity={75} color="#ffb34e" castShadow />
      <pointLight position={[0, 1, 4]} intensity={35} color="#6cff7d" />
      <DeskModel />
    </Canvas>
  )
}
