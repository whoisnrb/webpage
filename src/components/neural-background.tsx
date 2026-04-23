'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import { useTheme } from 'next-themes'

export const NeuralBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { theme } = useTheme()

    // Reduced particle count for better performance
    const particleCount = useMemo(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768 ? 40 : 80
        }
        return 80
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: false })
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []

        const resizeCanvas = () => {
            if (!canvas) return
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initParticles()
        }

        class Particle {
            x: number
            y: number
            vx: number
            vy: number
            size: number

            constructor() {
                this.x = Math.random() * (canvas?.width || 800)
                this.y = Math.random() * (canvas?.height || 600)
                this.vx = (Math.random() - 0.5) * 0.5
                this.vy = (Math.random() - 0.5) * 0.5
                this.size = Math.random() * 2
            }

            update() {
                if (!canvas) return
                this.x += this.vx
                this.y += this.vy

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1
            }

            draw() {
                if (!ctx) return
                ctx.fillStyle = theme === 'dark' ? 'rgba(147, 51, 234, 0.4)' : 'rgba(147, 51, 234, 0.2)'
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
            }
        }

        const animate = () => {
            if (!ctx || !canvas) return
            
            ctx.fillStyle = theme === 'dark' ? '#000' : '#fff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            particles.forEach(p => {
                p.update()
                p.draw()
            })
            drawLines()
            animationFrameId = requestAnimationFrame(animate)
        }

        resizeCanvas()
        animate()

        window.addEventListener('resize', resizeCanvas)

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            cancelAnimationFrame(animationFrameId)
        }
    }, [theme, particleCount])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{ filter: 'blur(1px)' }}
        />
    )
}
