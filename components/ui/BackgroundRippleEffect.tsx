"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundRippleEffectProps {
    className?: string;
    mousePosition?: { x: number; y: number };
}

export const BackgroundRippleEffect = ({
    className,
    mousePosition: externalMousePosition,
}: BackgroundRippleEffectProps) => {
    const [internalMousePosition, setInternalMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number; createdAt: number }>>([]);
    const rippleCounter = useRef(0);

    const mousePosition = externalMousePosition || internalMousePosition;
    const cellSize = 60;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!externalMousePosition && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setInternalMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const newRipple = { x, y, id: rippleCounter.current++, createdAt: Date.now() };
            setRipples(prev => [...prev.slice(-20), newRipple]);
        }
    };

    useEffect(() => {
        if (ripples.length > 0) {
            const timer = setTimeout(() => {
                setRipples(prev => prev.slice(1));
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [ripples]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute inset-0 z-0 overflow-hidden bg-slate-950",
                className
            )}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >

            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                    backgroundSize: `${cellSize}px ${cellSize}px`
                }}
            />


            <div
                className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.06), transparent 80%)`
                }}
            />


            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute transition-all duration-300 ease-out"
                    style={{
                        left: Math.floor(mousePosition.x / cellSize) * cellSize,
                        top: Math.floor(mousePosition.y / cellSize) * cellSize,
                        width: cellSize * 5,
                        height: cellSize * 5,
                        transform: 'translate(-50%, -50%)',
                        background: `radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)`,
                    }}
                />
            </div>


            <div className="absolute inset-0 pointer-events-none">
                {ripples.map((ripple) => (
                    <RippleWave key={ripple.id} ripple={ripple} cellSize={cellSize} />
                ))}
            </div>


            <GridCells
                cellSize={cellSize}
                ripples={ripples}
                mousePosition={mousePosition}
            />
        </div>
    );
};

const GridCells = ({ cellSize, ripples, mousePosition }: {
    cellSize: number;
    ripples: { x: number; y: number; id: number; createdAt: number }[];
    mousePosition: { x: number; y: number };
}) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const cols = Math.ceil(dimensions.width / cellSize);
    const rows = Math.ceil(dimensions.height / cellSize);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 grid pointer-events-none"
            style={{
                gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            }}
        >
            {cols > 0 && rows > 0 && Array.from({ length: rows * cols }).map((_, i) => {
                const row = Math.floor(i / cols);
                const col = i % cols;
                const cx = col * cellSize + cellSize / 2;
                const cy = row * cellSize + cellSize / 2;

                return (
                    <GridCell
                        key={`${row}-${col}`}
                        cx={cx}
                        cy={cy}
                        ripples={ripples}
                        mousePosition={mousePosition}
                    />
                );
            })}
        </div>
    );
};

const GridCell = ({ cx, cy, ripples, mousePosition }: {
    cx: number;
    cy: number;
    ripples: { x: number; y: number; id: number; createdAt: number }[];
    mousePosition: { x: number; y: number };
}) => {
    const [opacity, setOpacity] = useState(0);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        const animate = () => {
            const now = Date.now();

            // Hover glow based on mouse proximity
            const distToMouse = Math.sqrt((cx - mousePosition.x) ** 2 + (cy - mousePosition.y) ** 2);
            const hoverOp = distToMouse < 200 ? Math.max(0, 1 - distToMouse / 200) * 0.35 : 0;

            // Ripple ring: cell lights up as the expanding ring passes through it
            let rippleOp = 0;
            for (const ripple of ripples) {
                const distToRipple = Math.sqrt((cx - ripple.x) ** 2 + (cy - ripple.y) ** 2);
                const elapsed = (now - ripple.createdAt) / 1000; // seconds since click
                const waveRadius = elapsed * 400; // ring expands at 400px/s
                const ringWidth = 150; // visual thickness of the ring

                const distFromRing = Math.abs(distToRipple - waveRadius);
                if (distFromRing < ringWidth && elapsed < 3) {
                    const fade = Math.max(0, 1 - distFromRing / ringWidth);
                    const timeFade = Math.max(0, 1 - elapsed / 3);
                    const op = fade * timeFade * 0.5;
                    rippleOp = Math.max(rippleOp, op);
                }
            }

            const target = Math.max(hoverOp, rippleOp);
            setOpacity(prev => prev + (target - prev) * 0.15);
            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameRef.current);
    }, [cx, cy, mousePosition, ripples]);

    return (
        <div
            className="border-r border-b border-white/[0.03]"
            style={{
                backgroundColor: `rgba(16, 185, 129, ${opacity})`,
            }}
        />
    );
};

const RippleWave = ({ ripple, cellSize }: {
    ripple: { x: number; y: number; id: number };
    cellSize: number;
}) => {
    return (
        <motion.div
            className="absolute rounded-full pointer-events-none"
            initial={{
                left: ripple.x,
                top: ripple.y,
                width: 0,
                height: 0,
                opacity: 0,
            }}
            animate={{
                width: [0, cellSize * 15, cellSize * 20],
                height: [0, cellSize * 15, cellSize * 20],
                opacity: [0, 0.4, 0],
            }}
            transition={{
                duration: 2.5,
                ease: [0.4, 0, 0.2, 1],
                times: [0, 0.3, 1]
            }}
            style={{
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(16, 185, 129, 0.2) 40%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
            }}
        />
    );
};
