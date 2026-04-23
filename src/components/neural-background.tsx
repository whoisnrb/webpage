"use client"

import { useEffect, useRef, useState } from "react"

export function NeuralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isMobile, setIsMobile] = useState<boolean | null>(null)

    useEffect(() => {
        // Detect mobile once on mount - avoids SSR mismatch
        setIsMobile(window.innerWidth < 768)

        const handleResize = () => setIsMobile(window.innerWidth < 768)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        // Only run the heavy canvas animation on desktop
        if (isMobile !== false) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let width = (canvas.width = window.innerWidth)
        let height = (canvas.height = window.innerHeight)

        const particles: Particle[] = []
        const particleCount = 100
        const connectionDistance = 150
        const mouseDistance = 200
        let mouse = { x: 0, y: 0 }
        let animationId: number

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number

            constructor() {
                this.x = Math.random() * width
                this.y = Math.random() * height
                this.vx = (Math.random() - 0.5) * 0.5
                this.vy = (Math.random() - 0.5) * 0.5
                this.size = Math.random() * 2 + 1
            }

            update() {
                this.x += this.vx
                this.y += this.vy
                if (this.x < 0 || this.x > width) this.vx *= -1
                if (this.y < 0 || this.y > height) this.vy *= -1
            }

            draw() {
                if (!ctx) return
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        const initParticles = () => {
            particles = []
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle())
            }
        }

        const drawLines = () => {
            if (!ctx) return
            const maxDistance = 150
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < maxDistance) {
                        const opacity = 1 - distance / maxDistance
                        ctx.strokeStyle = theme === 'dark' 
                            ? `rgba(147, 51, 234, ${opacity * 0.15})` 
                            : `rgba(147, 51, 234, ${opacity * 0.1})`
                        ctx.lineWidth = 0.5
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
                    ctx.moveTo(particles[i].x, particles[i].y)
                    ctx.lineTo(mouse.x, mouse.y)
                    ctx.stroke()
                }
            }

            animationId = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
            init()
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX
            mouse.y = e.clientY
        }

        window.addEventListener("resize", handleResize)
        window.addEventListener("mousemove", handleMouseMove)
        init()
        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [isMobile])

    // Mobile: lightweight static gradient background - zero CPU usage
    if (isMobile === true) {
        return (
            <div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse at 20% 10%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.03) 0%, transparent 70%),
                        #050810
                    `
                }}
            />
        )
    }

    // Desktop: full animated canvas
    if (isMobile === null) return null // SSR / initial render - avoid flash

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
        />
    )
}

