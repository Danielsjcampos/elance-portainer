import React, { useState, useEffect } from 'react';

interface DotCardProps {
    target?: number;
    duration?: number;
    title?: string;
    children?: React.ReactNode;
    glowColor?: "blue" | "red" | "purple";
    badgeText?: string;
    className?: string;
}

export default function DotCard({
    target = 777000,
    duration = 2000,
    title,
    children,
    glowColor = "blue",
    badgeText,
    className = ""
}: DotCardProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (children) return;
        let start = 0;
        const end = target;
        const range = end - start;
        if (range <= 0) return;
        const increment = Math.ceil(end / (duration / 50));
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                start = end;
                clearInterval(timer);
            }
            setCount(start);
        }, 50);
        return () => clearInterval(timer);
    }, [target, duration, children]);

    const display = count < 1000 ? count : `${Math.floor(count / 1000)}k`;

    const glowShadow = glowColor === 'red'
        ? "shadow-[0_0_15px_#ef4444,0_0_30px_#ef4444]"
        : glowColor === 'blue'
            ? "shadow-[0_0_15px_#3b82f6,0_0_30px_#3b82f6]"
            : "shadow-[0_0_15px_#a855f7,0_0_30px_#a855f7]";

    return (
        <div className={`relative p-[1px] w-full max-w-[450px] min-h-[450px] rounded-[32px] overflow-hidden bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center group ${className}`}>

            {/* Moving Dot */}
            <div
                className={`absolute w-[12px] h-[12px] bg-white rounded-full z-20 ${glowShadow}`}
                style={{ animation: 'moveDot 6s linear infinite' }}
            ></div>

            {/* Main card */}
            <div className="relative w-full h-full bg-[#0e131f] rounded-[31px] flex flex-col p-8 z-10 overflow-hidden">

                {badgeText && (
                    <div className={`absolute top-0 right-0 ${glowColor === 'red' ? 'bg-red-500' : 'bg-blue-500'} text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider z-50`}>
                        {badgeText}
                    </div>
                )}

                {/* Ray effect */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                {/* Border Lines */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-[1px] h-full bg-white/5 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[1px] h-full bg-white/5 pointer-events-none"></div>

                {children ? (
                    <div className="relative z-10 w-full flex flex-col h-full pt-4">
                        {title && (
                            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                {title}
                            </h3>
                        )}
                        <div className="text-gray-300 w-full flex-grow">
                            {children}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full relative z-10">
                        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                            {display}
                        </div>
                        <div className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">Views</div>
                    </div>
                )}
            </div>
        </div>
    );
}
