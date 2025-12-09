"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";

export const FluidBackground = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            setContext(ctx);
        }
    }, []);

    useEffect(() => {
        let animationFrameId: number;

        if (context && canvasRef.current) {
            const canvas = canvasRef.current;
            const width = window.innerWidth;
            const height = window.innerHeight;

            canvas.width = width;
            canvas.height = height;

            // Fluid simulation parameters (simplified for performance)
            let time = 0;
            const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
            const particleCount = 20;

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 1, // Slow movement
                    vy: (Math.random() - 0.5) * 1,
                    size: Math.random() * 100 + 50,
                });
            }

            const render = () => {
                time++;
                context.clearRect(0, 0, width, height);

                // Draw background
                context.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff'; // Slate-950 or White
                context.fillRect(0, 0, width, height);

                particles.forEach((p, i) => {
                    p.x += p.vx;
                    p.y += p.vy;

                    // Bounce off walls
                    if (p.x < 0 || p.x > width) p.vx *= -1;
                    if (p.y < 0 || p.y > height) p.vy *= -1;

                    // Draw gradient blobs
                    const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);

                    if (theme === 'dark') {
                        // Neon colors for dark mode
                        const color = i % 2 === 0 ? 'rgba(6, 182, 212,' : 'rgba(139, 92, 246,'; // Cyan or Violet
                        gradient.addColorStop(0, `${color} 0.2)`); // Lighter core
                        gradient.addColorStop(1, `${color} 0)`);
                    } else {
                        // Soft pastels for light mode
                        const color = i % 2 === 0 ? 'rgba(56, 189, 248,' : 'rgba(167, 139, 250,'; // Light Blue or Purple
                        gradient.addColorStop(0, `${color} 0.15)`);
                        gradient.addColorStop(1, `${color} 0)`);
                    }

                    context.fillStyle = gradient;
                    context.beginPath();
                    context.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                    context.fill();
                });

                animationFrameId = requestAnimationFrame(render);
            };

            render();
        }

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [context, theme]);

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 opacity-60 pointer-events-none"
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
};
