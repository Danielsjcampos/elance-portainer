import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { XCircle, CheckCircle2 } from "lucide-react";

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const TraditionalCard = ({ title, children, className }: CardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={cn(
                "relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-[#050505] p-8 shadow-2xl transition-all duration-500 hover:border-red-500/30 md:p-10",
                className
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(239,68,68,.08), transparent 40%)`,
                }}
            />
            {/* Subtle top red glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-50"></div>

            <div className="relative z-10 flex flex-col h-full bg-transparent">
                <div className="mb-6 border-b border-white/5 pb-6">
                    <p className="text-[10px] sm:text-xs text-red-500/80 font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5" />
                        Por que é a pior escolha
                    </p>
                    <h3 className="text-2xl font-semibold text-white/70 tracking-tight">{title}</h3>
                </div>
                <div className="flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface ModernCardProps extends CardProps {
    badgeText?: string;
}

export const ModernCard = ({ title, children, className, badgeText = "A Escolha Inteligente" }: ModernCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={cn(
                "relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-blue-500/30 bg-[#070b14] p-8 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] transition-all duration-500 hover:border-blue-400/60 hover:shadow-[0_0_80px_-15px_rgba(56,189,248,0.4)] md:p-10 group",
                className
            )}
        >
            {/* Background radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none" />

            {/* Light spotlight following mouse */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
                style={{
                    opacity,
                    background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(56,189,248,.12), transparent 40%)`,
                }}
            />

            {/* Glow lines */}
            <div className="absolute top-0 left-1/4 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent opacity-80"></div>
            <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

            <div className="relative z-10 flex flex-col h-full">
                {badgeText && (
                    <div className="absolute -top-3 -right-3 md:-top-5 md:-right-5 z-20">
                        <div className="relative flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
                            <div className="absolute inset-0 rounded-full bg-blue-400/60 blur-md animate-pulse" />
                            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] sm:text-xs font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-widest border border-white/20 whitespace-nowrap">
                                {badgeText}
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-6 border-b border-blue-500/20 pb-6 relative">
                    <p className="text-[10px] sm:text-xs text-cyan-400 font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        Por que é a melhor escolha
                    </p>
                    <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 tracking-tight drop-shadow-sm">{title}</h3>
                </div>
                <div className="flex-grow">
                    {children}
                </div>
            </div>
        </div>
    );
};
