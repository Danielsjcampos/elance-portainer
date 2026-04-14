import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

interface GlowingCardProps {
    className?: string;
    title?: string;
    subtitle?: string;
    glowColor?: "white" | "blue" | "red";
    children?: React.ReactNode;
    badgeText?: string;
}

export const Component = ({
    className,
    title = "750k",
    subtitle = "Views",
    glowColor = "white",
    children,
    badgeText
}: GlowingCardProps) => {
    const [count, setCount] = useState(0);

    // Counter animation logic
    useEffect(() => {
        if (children) return;
        let start = 0;
        const end = parseInt(title.replace(/\D/g, '')) || 750000;
        const range = end - start;
        if (range <= 0) return;
        const increment = Math.ceil(end / 40);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setCount(start);
        }, 50);
        return () => clearInterval(timer);
    }, [title, children]);

    const display = count < 1000 ? count : `${Math.floor(count / 1000)}k`;
    const isNumeric = /^\d+k?$/i.test(title) && !children;

    // Dynamic glow colors based on theme
    const dotColor = glowColor === "blue" ? "bg-blue-400 shadow-[0_0_10px_#60a5fa,0_0_20px_#60a5fa]"
        : glowColor === "red" ? "bg-red-400 shadow-[0_0_10px_#f87171,0_0_20px_#f87171]"
            : "bg-white shadow-[0_0_10px_#ffffff,0_0_20px_#ffffff]";

    const rayColor = glowColor === "blue" ? "bg-blue-500/20"
        : glowColor === "red" ? "bg-red-500/20"
            : "bg-white/10";

    const badgeColor = glowColor === "blue" ? "bg-blue-600"
        : glowColor === "red" ? "bg-red-600"
            : "bg-white/20 text-white";

    return (
        <div className={cn("relative p-[1px] flex items-center justify-center outer h-full", className)}>
            <div className="relative w-full max-w-[450px] min-h-[450px] h-full bg-[#121212] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">

                {badgeText && (
                    <div className={cn("absolute top-0 right-0 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider z-50", badgeColor)}>
                        {badgeText}
                    </div>
                )}

                {/* Moving dot */}
                <div
                    className={cn("absolute w-1.5 h-1.5 rounded-full z-20 dot", dotColor)}
                    style={{ animation: 'moveDot 4s linear infinite' }}
                />

                {/* Inner Card */}
                <div className="absolute inset-[1px] bg-[#0a0a0a] rounded-2xl z-10 flex flex-col items-center overflow-hidden card">

                    {/* Ray (corner glow) */}
                    <div className={cn("absolute top-0 right-0 w-[150px] h-[150px] blur-[40px] rounded-full translate-x-1/3 -translate-y-1/3 ray pointer-events-none", rayColor)} />

                    {children ? (
                        <div className="relative z-20 w-full flex flex-col h-full p-8 pt-10 text-left">
                            {title && (
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 tracking-tight">
                                    {title}
                                </h3>
                            )}
                            <div className="text-gray-300 w-full flex-grow text-sm leading-relaxed">
                                {children}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center">
                            {/* Text Content */}
                            <div className="text-5xl font-black text-white/90 drop-shadow-md z-20 text tracking-tight">
                                {isNumeric ? display : title}
                            </div>
                            <div className="text-white/40 text-[11px] font-bold z-20 mt-1 uppercase tracking-[0.2em]">{subtitle}</div>
                        </div>
                    )}

                    {/* Grid Lines */}
                    <div className="absolute top-[10%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 line topl pointer-events-none" />
                    <div className="absolute bottom-[30px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 line bottoml pointer-events-none" />
                    <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent z-0 line rightl pointer-events-none" />
                    {/* Right calc(100% - 35px) is Left 35px */}
                    <div className="absolute left-[35px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent z-0 line leftl pointer-events-none" />

                </div>
            </div>
        </div>
    );
};
