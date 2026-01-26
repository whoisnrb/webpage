// @ts-nocheck
"use client"

import { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import {
    OrbitControls,
    PerspectiveCamera,
    Html,
    Float,
    Stars,
    Text,
    Sphere,
    Torus,
    Icosahedron,
    Box,
    Cylinder,
    QuadraticBezierLine
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Shield, Server, Database, Globe, Activity, Lock, Wifi } from 'lucide-react'

// --- Types & Data ---

type NodeType = 'cloud' | 'security' | 'core' | 'distribution' | 'endpoint'

interface NodeData {
    id: string
    position: [number, number, number]
    type: NodeType
    label: string
    links: string[]
}

const NODES: NodeData[] = [
    { id: 'cloud', position: [0, 6, 0], type: 'cloud', label: 'Global Internet', links: ['fw'] },
    { id: 'fw', position: [0, 3.5, 0], type: 'security', label: 'Next-Gen Firewall', links: ['core'] },
    { id: 'core', position: [0, 0, 0], type: 'core', label: 'Core Backbone', links: ['sw1', 'sw2'] },
    { id: 'sw1', position: [-4, -2, 2], type: 'distribution', label: 'Segment A', links: ['srv1', 'db1'] },
    { id: 'sw2', position: [4, -2, 2], type: 'distribution', label: 'Segment B', links: ['wifi', 'srv2'] },
    { id: 'srv1', position: [-5, -5, 3], type: 'endpoint', label: 'App Cluster', links: [] },
    { id: 'db1', position: [-3, -5, 1], type: 'endpoint', label: 'Secure DB', links: [] },
    { id: 'wifi', position: [3, -5, 1], type: 'endpoint', label: 'Enterprise WiFi', links: [] },
    { id: 'srv2', position: [5, -5, 3], type: 'endpoint', label: 'Backup Sys', links: [] },
]

const COLORS = {
    cyan: new THREE.Color('#06b6d4'),
    blue: new THREE.Color('#3b82f6'),
    purple: new THREE.Color('#8b5cf6'),
    orange: new THREE.Color('#f97316'),
    red: new THREE.Color('#ef4444'),
    emerald: new THREE.Color('#10b981'),
}

// --- Components ---

const GlowingParticle = ({ start, end, speed = 1, color }: { start: THREE.Vector3, end: THREE.Vector3, speed?: number, color: THREE.Color }) => {
    const ref = useRef<THREE.Mesh>(null)
    const [offset] = useState(() => Math.random())

    useFrame((state) => {
        if (!ref.current) return
        const t = (state.clock.elapsedTime * speed + offset) % 1
        ref.current.position.lerpVectors(start, end, t)

        // Fade in/out at ends
        const opacity = Math.sin(t * Math.PI)
        if (ref.current.material) {
            (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity
        }

        // Scale pulse
        const s = 1 + Math.sin(t * 10) * 0.5
        ref.current.scale.setScalar(s * 0.15)
    })

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color={color} transparent />
        </mesh>
    )
}

const Connection = ({ start, end, active }: { start: [number, number, number], end: [number, number, number], active?: boolean }) => {
    const vStart = useMemo(() => new THREE.Vector3(...start), [start])
    const vEnd = useMemo(() => new THREE.Vector3(...end), [end])
    const mid = useMemo(() => new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5).add(new THREE.Vector3(0, 1, 0)), [vStart, vEnd])

    return (
        <group>
            {/* The Line */}
            <QuadraticBezierLine
                start={vStart}
                end={vEnd}
                mid={mid}
                color={COLORS.cyan}
                lineWidth={1}
                transparent
                opacity={0.15}
            />

            {/* Moving Particles */}
            <GlowingParticle start={vStart} end={vEnd} color={COLORS.cyan} speed={0.8} />
            <GlowingParticle start={vEnd} end={vStart} color={COLORS.blue} speed={0.5} />
        </group>
    )
}

const CyberNode = ({ node, isHovered, onHover }: { node: NodeData, isHovered: boolean, onHover: (id: string | null) => void }) => {
    const group = useRef<THREE.Group>(null)
    const ring1 = useRef<THREE.Mesh>(null)
    const ring2 = useRef<THREE.Mesh>(null)

    const color = useMemo(() => {
        switch (node.type) {
            case 'security': return COLORS.red
            case 'core': return COLORS.orange
            case 'cloud': return COLORS.purple
            case 'distribution': return COLORS.cyan
            case 'endpoint': return COLORS.emerald
            default: return COLORS.blue
        }
    }, [node.type])

    useFrame((state, delta) => {
        if (!group.current) return

        // Idle animation
        group.current.rotation.y += delta * 0.2

        // Ring rotations
        if (ring1.current) ring1.current.rotation.x += delta * 0.5
        if (ring2.current) ring2.current.rotation.z += delta * 0.3

        // Hover scale effect
        const targetScale = isHovered ? 1.2 : 1
        group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5)
    })

    const Icon = () => {
        const iconProps = { size: 20, className: "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" }
        switch (node.type) {
            case 'cloud': return <Globe {...iconProps} className="text-purple-400" />
            case 'security': return <Shield {...iconProps} className="text-red-400" />
            case 'core': return <Activity {...iconProps} className="text-orange-400" />
            case 'distribution': return <Wifi {...iconProps} className="text-cyan-400" />
            case 'endpoint': return <Server {...iconProps} className="text-emerald-400" />
            default: return <Database {...iconProps} />
        }
    }

    return (
        <group position={node.position}>
            <Float floatIntensity={1} rotationIntensity={0.5} speed={1.5}>
                <group
                    ref={group}
                    onPointerOver={() => onHover(node.id)}
                    onPointerOut={() => onHover(null)}
                >
                    {/* Core Core */}
                    <mesh>
                        <octahedronGeometry args={[0.8, 0]} />
                        <meshPhysicalMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={2}
                            transparent
                            opacity={0.8}
                            roughness={0}
                            metalness={0.9}
                            clearcoat={1}
                        />
                    </mesh>

                    {/* Outer Glass Shell */}
                    <mesh>
                        <sphereGeometry args={[1.2, 32, 32]} />
                        <meshPhysicalMaterial
                            color={color}
                            transparent
                            opacity={0.1}
                            roughness={0.1}
                            metalness={0.1}
                            transmission={0.5}
                            thickness={2}
                        />
                    </mesh>

                    {/* Tech Rings */}
                    <mesh ref={ring1}>
                        <torusGeometry args={[1.5, 0.05, 16, 50]} />
                        <meshBasicMaterial color={color} transparent opacity={0.3} />
                    </mesh>
                    <mesh ref={ring2} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[1.8, 0.02, 16, 50]} />
                        <meshBasicMaterial color={color} transparent opacity={0.2} />
                    </mesh>

                    {/* Point Light for Glow */}
                    <pointLight color={color} distance={4} intensity={2} decay={2} />
                </group>

                {/* HTML Overlay Label */}
                <Html distanceFactor={15} transform position={[0, 2, 0]} style={{ pointerEvents: 'none' }}>
                    <div className={`
                        transition-all duration-300 transform 
                        ${isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-60'}
                    `}>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-3">
                                <Icon />
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-white tracking-widest uppercase">{node.label}</span>
                                    <span className="text-[10px] text-white/50">{node.type.toUpperCase()} NODE</span>
                                </div>
                            </div>
                            {/* Connector Line */}
                            <div className="h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent"></div>
                        </div>
                    </div>
                </Html>
            </Float>
        </group>
    )
}

function Scene() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)

    // Calculate connections
    const connections = useMemo(() => {
        const lines: JSX.Element[] = []
        NODES.forEach(node => {
            node.links.forEach(targetId => {
                const target = NODES.find(n => n.id === targetId)
                if (target) {
                    lines.push(
                        <Connection
                            key={`${node.id}-${target.id}`}
                            start={node.position}
                            end={target.position}
                        />
                    )
                }
            })
        })
        return lines
    }, [])

    return (
        <>
            <PerspectiveCamera makeDefault position={[12, 5, 12]} fov={45} />
            <OrbitControls
                enablePan={false}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 1.5}
                autoRotate
                autoRotateSpeed={0.5}
                maxDistance={25}
                minDistance={5}
            />

            {/* Cinematic Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
            <pointLight position={[-10, 10, -10]} intensity={1} color="#06b6d4" />
            <pointLight position={[0, -10, 0]} intensity={0.5} color="#f472b6" />

            {/* Stars & Atmosphere */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <fog attach="fog" args={['#020617', 5, 40]} />

            {/* Network Graph */}
            <group position={[0, 0, 0]}>
                {connections}
                {NODES.map(node => (
                    <CyberNode
                        key={node.id}
                        node={node}
                        isHovered={hoveredNode === node.id}
                        onHover={setHoveredNode}
                    />
                ))}
            </group>

            {/* Floor Grid - Holographic */}
            <gridHelper
                args={[40, 40, 0x334155, 0x0f172a]}
                position={[0, -8, 0]}
            />

            {/* Post Processing Effects */}
            <EffectComposer disableNormalPass>
                <Bloom
                    luminanceThreshold={0.2} // Lower threshold to make more things glow
                    mipmapBlur
                    intensity={1.5} // High intensity for neon look
                    radius={0.6}
                />
                <Noise opacity={0.02} /> {/* Subtle noise for realism */}
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </>
    )
}

export function NetworkVisualization() {
    return (
        <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#020617] relative">
            <Canvas dpr={[1, 2]} gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
                <Scene />
            </Canvas>

            {/* Professional Overlay UI */}
            <div className="absolute top-6 left-6 pointer-events-none">
                <div className="flex flex-col gap-1">
                    <h3 className="text-white/90 font-black text-xl tracking-tighter">LIVE MONITOR</h3>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-500 font-mono text-xs">SYSTEM OPTIMAL</span>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 right-6 pointer-events-none">
                <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-white/40 text-[10px] font-mono">LATENCY</span>
                        <span className="text-cyan-400 font-mono text-sm">2ms</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-white/40 text-[10px] font-mono">UPTIME</span>
                        <span className="text-cyan-400 font-mono text-sm">99.99%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
