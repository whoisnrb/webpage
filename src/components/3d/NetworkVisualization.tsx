"use client"

import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
    OrbitControls,
    PerspectiveCamera,
    Html,
    Float,
    Stars,
    Sphere,
    Box,
    Cylinder,
    Torus,
    Text,
    Line
} from '@react-three/drei'
import * as THREE from 'three'
import { Shield, Wifi, Server, Database, Smartphone, Globe, Lock, Cpu, Network as NetworkIcon } from 'lucide-react'

// Types
type NodeType = 'cloud' | 'firewall' | 'router' | 'switch' | 'server' | 'device'

interface NodeData {
    id: string
    position: [number, number, number]
    type: NodeType
    label: string
    connectedTo?: string[]
}

// Network Data Structure
const networkData: NodeData[] = [
    // Level 1: Internet/Cloud
    { id: 'cloud', position: [0, 4.5, 0], type: 'cloud', label: 'Internet', connectedTo: ['firewall'] },

    // Level 2: Security
    { id: 'firewall', position: [0, 2.5, 0], type: 'firewall', label: 'Tűzfal', connectedTo: ['router'] },

    // Level 3: Core
    { id: 'router', position: [0, 0.5, 0], type: 'router', label: 'Core Router', connectedTo: ['sw1', 'sw2', 'sw3'] },

    // Level 4: Distribution (Switches)
    { id: 'sw1', position: [-2.5, -1.5, 1], type: 'switch', label: 'Switch A', connectedTo: ['srv1', 'srv2'] },
    { id: 'sw2', position: [0, -1.5, -1], type: 'switch', label: 'Switch B', connectedTo: ['srv3'] },
    { id: 'sw3', position: [2.5, -1.5, 1], type: 'switch', label: 'Switch C', connectedTo: ['dev1', 'dev2'] },

    // Level 5: Endpoints
    { id: 'srv1', position: [-3.5, -3.5, 1.5], type: 'server', label: 'Adatbázis' },
    { id: 'srv2', position: [-1.5, -3.5, 1.5], type: 'server', label: 'Webszerver' },
    { id: 'srv3', position: [0, -3.5, -1], type: 'server', label: 'Backup' },
    { id: 'dev1', position: [2, -3.5, 2], type: 'device', label: 'Munkaállomás' },
    { id: 'dev2', position: [3.5, -3.5, 0.5], type: 'device', label: 'WiFi AP' },
]

// Visual Configuration
const config = {
    colors: {
        cloud: '#3b82f6', // blue
        firewall: '#ef4444', // red
        router: '#f97316', // orange
        switch: '#06b6d4', // cyan
        server: '#10b981', // green
        device: '#8b5cf6', // violet
        link: '#334155',   // slate-700
        packet: '#ffffff'  // white
    }
}

// Components

function NetworkNode({ node, isHovered, onHover }: { node: NodeData, isHovered: boolean, onHover: (id: string | null) => void }) {
    const meshRef = useRef<THREE.Group>(null)
    const color = config.colors[node.type]

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle floating rotation
            meshRef.current.rotation.y += 0.005
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
        }
    })

    const Geometry = () => {
        switch (node.type) {
            case 'cloud':
                return (
                    <group>
                        {[...Array(5)].map((_, i) => (
                            <Sphere key={i} args={[0.3, 16, 16]} position={[Math.sin(i) * 0.4, Math.cos(i) * 0.2, 0]}>
                                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} />
                            </Sphere>
                        ))}
                        <pointLight color={color} intensity={2} distance={3} />
                    </group>
                )
            case 'firewall':
                return (
                    <Box args={[0.6, 0.6, 0.6]}>
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe={true} />
                        <Box args={[0.4, 0.4, 0.4]}>
                            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
                        </Box>
                    </Box>
                )
            case 'router':
                return (
                    <group>
                        <Sphere args={[0.35, 32, 32]}>
                            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
                        </Sphere>
                        <Torus args={[0.55, 0.02, 16, 100]} rotation={[1.5, 0, 0]}>
                            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
                        </Torus>
                    </group>
                )
            case 'switch':
                return (
                    <Box args={[0.6, 0.2, 0.4]}>
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
                    </Box>
                )
            case 'server':
                return (
                    <Cylinder args={[0.25, 0.25, 0.6, 32]}>
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
                    </Cylinder>
                )
            case 'device':
                return (
                    <Box args={[0.4, 0.3, 0.05]} rotation={[-0.2, 0, 0]}>
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
                    </Box>
                )
            default:
                return <Sphere args={[0.2]}><meshStandardMaterial color="white" /></Sphere>
        }
    }

    const Icon = () => {
        switch (node.type) {
            case 'cloud': return <Globe size={20} className="text-blue-400" />
            case 'firewall': return <Lock size={20} className="text-red-400" />
            case 'router': return <NetworkIcon size={20} className="text-orange-400" />
            case 'switch': return <Cpu size={20} className="text-cyan-400" />
            case 'server': return <Database size={20} className="text-emerald-400" />
            case 'device': return <Smartphone size={20} className="text-violet-400" />
        }
    }

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group
                ref={meshRef}
                position={node.position}
                onPointerOver={() => onHover(node.id)}
                onPointerOut={() => onHover(null)}
            >
                <Geometry />

                {/* Glow Sprite */}
                <sprite scale={[1.5, 1.5, 1]}>
                    <spriteMaterial
                        transparent
                        opacity={0.2}
                        color={color}
                        blending={THREE.AdditiveBlending}
                    />
                </sprite>

                {/* Label Tooltip */}
                <Html distanceFactor={10} position={[0, 0.8, 0]} style={{ pointerEvents: 'none', display: isHovered ? 'block' : 'none' }}>
                    <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 whitespace-nowrap transform -translate-x-1/2 transition-opacity duration-200">
                        <Icon />
                        <span className="text-xs font-bold text-white tracking-wide">{node.label}</span>
                    </div>
                </Html>
            </group>
        </Float>
    )
}

function ConnectionLink({ start, end, active }: { start: [number, number, number], end: [number, number, number], active: boolean }) {
    const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end])

    return (
        <group>
            {/* Base line */}
            <Line
                points={points}
                color={config.colors.link}
                lineWidth={1}
                transparent
                opacity={0.3}
            />

            {/* Active Data Packet */}
            {active && <DataPacket path={points} />}
        </group>
    )
}

function DataPacket({ path }: { path: THREE.Vector3[] }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const [progress, setProgress] = useState(0)
    const speed = 1.5 // units per second

    useFrame((state, delta) => {
        if (!meshRef.current) return

        const newProgress = (progress + delta * speed) % 1
        setProgress(newProgress)

        const pos = new THREE.Vector3().lerpVectors(path[0], path[1], newProgress)
        meshRef.current.position.copy(pos)
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color={config.colors.packet} />
            <pointLight distance={1} intensity={1} color={config.colors.packet} decay={2} />
        </mesh>
    )
}

function Scene() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)

    // Generate connections
    const connections = useMemo(() => {
        const links: JSX.Element[] = []
        networkData.forEach(source => {
            if (source.connectedTo) {
                source.connectedTo.forEach(targetId => {
                    const target = networkData.find(n => n.id === targetId)
                    if (target) {
                        links.push(
                            <ConnectionLink
                                key={`${source.id}-${target.id}`}
                                start={source.position}
                                end={target.position}
                                active={true}
                            />
                        )
                    }
                })
            }
        })
        return links
    }, [])

    return (
        <>
            <PerspectiveCamera makeDefault position={[5, 1, 8]} fov={50} />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
                autoRotate
                autoRotateSpeed={0.5}
            />

            {/* Environment */}
            <color attach="background" args={['#020617']} /> {/* slate-950 */}
            <fog attach="fog" args={['#020617', 5, 20]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

            {/* Grid Floor */}
            <gridHelper args={[20, 20, 0x1e293b, 0x0f172a]} position={[0, -4, 0]} />

            {/* Network Components */}
            <group position={[0, 0, 0]}>
                {connections}
                {networkData.map(node => (
                    <NetworkNode
                        key={node.id}
                        node={node}
                        isHovered={hoveredNode === node.id}
                        onHover={setHoveredNode}
                    />
                ))}
            </group>
        </>
    )
}

export function NetworkVisualization() {
    return (
        <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 relative group">
            <Canvas dpr={[1, 2]} performance={{ min: 0.5 }}>
                <Scene />
            </Canvas>

            {/* Minimal overlay UI */}
            <div className="absolute bottom-4 left-4 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest">
                        Live Monitor
                    </span>
                </div>
            </div>

            {/* Interaction Hint */}
            <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] font-medium text-white/30 uppercase tracking-widest">
                    Drag to Rotate
                </span>
            </div>
        </div>
    )
}
