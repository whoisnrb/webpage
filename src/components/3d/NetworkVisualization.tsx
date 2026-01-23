"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

interface NetworkNode {
    id: string
    x: number
    y: number
    z: number // depth for 3D effect
    label: string
    type: 'router' | 'firewall' | 'switch' | 'server' | 'workstation' | 'cloud'
}

const nodes: NetworkNode[] = [
    // Top layer (cloud)
    { id: 'cloud', x: 50, y: 10, z: 3, label: 'Internet', type: 'cloud' },

    // Firewall layer
    { id: 'firewall', x: 50, y: 25, z: 2.5, label: 'Firewall', type: 'firewall' },

    // Core router
    { id: 'router', x: 50, y: 40, z: 2, label: 'Core Router', type: 'router' },

    // Switches
    { id: 'switch1', x: 25, y: 55, z: 1.5, label: 'Switch 1', type: 'switch' },
    { id: 'switch2', x: 50, y: 55, z: 1.5, label: 'Switch 2', type: 'switch' },
    { id: 'switch3', x: 75, y: 55, z: 1.5, label: 'Switch 3', type: 'switch' },

    // Servers
    { id: 'server1', x: 15, y: 75, z: 1, label: 'DB Server', type: 'server' },
    { id: 'server2', x: 30, y: 75, z: 1, label: 'Web Server', type: 'server' },
    { id: 'server3', x: 45, y: 75, z: 1, label: 'App Server', type: 'server' },

    // Workstations
    { id: 'ws1', x: 60, y: 75, z: 1, label: 'Workstation 1', type: 'workstation' },
    { id: 'ws2', x: 72, y: 75, z: 1, label: 'Workstation 2', type: 'workstation' },
    { id: 'ws3', x: 84, y: 75, z: 1, label: 'Workstation 3', type: 'workstation' },
]

const connections = [
    { from: 'cloud', to: 'firewall', status: 'active' },
    { from: 'firewall', to: 'router', status: 'active' },
    { from: 'router', to: 'switch1', status: 'active' },
    { from: 'router', to: 'switch2', status: 'active' },
    { from: 'router', to: 'switch3', status: 'active' },
    { from: 'switch1', to: 'server1', status: 'active' },
    { from: 'switch1', to: 'server2', status: 'active' },
    { from: 'switch2', to: 'server3', status: 'active' },
    { from: 'switch3', to: 'ws1', status: 'active' },
    { from: 'switch3', to: 'ws2', status: 'active' },
    { from: 'switch3', to: 'ws3', status: 'active' },
]

function getNodeConfig(type: string) {
    switch (type) {
        case 'cloud': return { color: '#8b5cf6', size: 8, icon: '☁️' }
        case 'firewall': return { color: '#ef4444', size: 6, icon: '🛡️' }
        case 'router': return { color: '#f97316', size: 7, icon: '🔄' }
        case 'switch': return { color: '#06b6d4', size: 5, icon: '⚡' }
        case 'server': return { color: '#10b981', size: 5, icon: '🖥️' }
        case 'workstation': return { color: '#8b5cf6', size: 4, icon: '💻' }
        default: return { color: '#ffffff', size: 5, icon: '•' }
    }
}

export function NetworkVisualization() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null)
    const [autoAnimate, setAutoAnimate] = useState(true)

    return (
        <div className="w-full h-full relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} />
            </div>

            <svg
                viewBox="0 0 100 90"
                className="w-full h-full relative z-10"
                style={{ filter: 'drop-shadow(0 4px 20px rgba(6, 182, 212, 0.15))' }}
            >
                <defs>
                    {/* Enhanced gradients */}
                    <radialGradient id="routerGlow">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </radialGradient>

                    <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                        <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>

                    {/* Filters */}
                    <filter id="strongGlow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="softGlow">
                        <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Connection lines with data flow */}
                <g className="connections">
                    {connections.map((conn, i) => {
                        const fromNode = nodes.find(n => n.id === conn.from)!
                        const toNode = nodes.find(n => n.id === conn.to)!

                        return (
                            <g key={i}>
                                {/* Base line */}
                                <motion.line
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke="#1e293b"
                                    strokeWidth="0.4"
                                    strokeLinecap="round"
                                />

                                {/* Animated line */}
                                <motion.line
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke="#06b6d4"
                                    strokeWidth="0.3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                        pathLength: 1,
                                        opacity: [0.3, 0.8, 0.3]
                                    }}
                                    transition={{
                                        pathLength: { duration: 0.8, delay: i * 0.08 },
                                        opacity: autoAnimate ? {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.1
                                        } : { duration: 0.5 }
                                    }}
                                    filter="url(#softGlow)"
                                />

                                {/* Data packet */}
                                {autoAnimate && (
                                    <motion.circle
                                        r="0.6"
                                        fill="#06b6d4"
                                        filter="url(#strongGlow)"
                                        initial={{ x: fromNode.x, y: fromNode.y, opacity: 0 }}
                                        animate={{
                                            x: [fromNode.x, toNode.x],
                                            y: [fromNode.y, toNode.y],
                                            opacity: [0, 1, 1, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                            ease: "linear"
                                        }}
                                    />
                                )}
                            </g>
                        )
                    })}
                </g>

                {/* Network nodes */}
                <g className="nodes">
                    {nodes.map((node, i) => {
                        const config = getNodeConfig(node.type)
                        const size = config.size
                        const isHovered = hoveredNode === node.id
                        const scale = node.z / 2 // depth-based scaling

                        return (
                            <g key={node.id}>
                                {/* Outer glow ring */}
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={size * scale * 1.8}
                                    fill="none"
                                    stroke={config.color}
                                    strokeWidth="0.15"
                                    opacity={isHovered ? 0.4 : 0.2}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{
                                        scale: isHovered ? 1.1 : 1,
                                        opacity: isHovered ? 0.4 : 0.2
                                    }}
                                    transition={{
                                        scale: { duration: 0.3 },
                                        opacity: { duration: 0.5, delay: i * 0.1 }
                                    }}
                                />

                                {/* Pulse ring for special nodes */}
                                {(node.type === 'router' || node.type === 'firewall') && autoAnimate && (
                                    <motion.circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={size * scale}
                                        fill="none"
                                        stroke={config.color}
                                        strokeWidth="0.4"
                                        initial={{ scale: 1, opacity: 0.8 }}
                                        animate={{
                                            scale: [1, 2, 1],
                                            opacity: [0.8, 0, 0.8]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: node.type === 'firewall' ? 0.5 : 0
                                        }}
                                    />
                                )}

                                {/* Node background circle */}
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={size * scale}
                                    fill={`${config.color}15`}
                                    stroke={config.color}
                                    strokeWidth={isHovered ? "0.4" : "0.25"}
                                    filter="url(#softGlow)"
                                    style={{ cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredNode(node.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: isHovered ? 1.15 : 1,
                                        opacity: 1
                                    }}
                                    transition={{
                                        scale: { duration: 0.2 },
                                        opacity: { duration: 0.6, delay: i * 0.12 }
                                    }}
                                />

                                {/* Inner bright circle */}
                                <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={size * scale * 0.6}
                                    fill={config.color}
                                    opacity={isHovered ? 1 : 0.8}
                                    filter="url(#strongGlow)"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: isHovered ? 1.1 : 1 }}
                                    transition={{ duration: 0.2 }}
                                />

                                {/* Label on hover */}
                                {isHovered && (
                                    <motion.g
                                        initial={{ opacity: 0, y: node.y }}
                                        animate={{ opacity: 1, y: node.y - size * scale - 3 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <rect
                                            x={node.x - node.label.length * 1.2}
                                            y={node.y - size * scale - 5}
                                            width={node.label.length * 2.4}
                                            height="3.5"
                                            fill="#0f172a"
                                            stroke={config.color}
                                            strokeWidth="0.15"
                                            rx="0.5"
                                            opacity="0.95"
                                        />
                                        <text
                                            x={node.x}
                                            y={node.y - size * scale - 2.5}
                                            textAnchor="middle"
                                            fill="#ffffff"
                                            fontSize="2.2"
                                            fontWeight="600"
                                        >
                                            {node.label}
                                        </text>
                                    </motion.g>
                                )}
                            </g>
                        )
                    })}
                </g>
            </svg>

            {/* Enhanced Control Panel */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap gap-3 justify-between items-center">
                <button
                    onClick={() => setAutoAnimate(!autoAnimate)}
                    className="group px-5 py-2.5 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 backdrop-blur-md border border-primary/30 rounded-xl text-white text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-primary/20"
                >
                    <span className="flex items-center gap-2">
                        {autoAnimate ? '⏸' : '▶'}
                        {autoAnimate ? 'Animáció Szünet' : 'Animáció Indítás'}
                    </span>
                </button>

                <div className="flex gap-3 text-xs font-medium bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#f97316] shadow-lg shadow-orange-500/50" />
                        <span className="text-white/70">Router</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-lg shadow-cyan-500/50" />
                        <span className="text-white/70">Switch</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-lg shadow-green-500/50" />
                        <span className="text-white/70">Server</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
