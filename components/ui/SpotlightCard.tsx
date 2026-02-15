"use client";

import { cn } from "@/lib/utils";
import { useRef, useState, MouseEvent } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function SpotlightCard({ children, className, ...props }: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative rounded-3xl border border-slate-800 bg-slate-950/90 overflow-hidden",
                className
            )}
            {...props}
        >

            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#334155 1.5px, transparent 1.5px)`,
                    backgroundSize: "24px 24px",
                    opacity: 0.2,
                }}
            />


            <div
                className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
                style={{
                    opacity,
                    backgroundImage: `radial-gradient(#2dd4bf 2px, transparent 2px)`,
                    backgroundSize: "24px 24px",
                    maskImage: `radial-gradient(120px circle at ${position.x}px ${position.y}px, black, transparent)`,
                    WebkitMaskImage: `radial-gradient(120px circle at ${position.x}px ${position.y}px, black, transparent)`,
                }}
            />


            <div className="relative z-20">{children}</div>
        </div>
    );
}
