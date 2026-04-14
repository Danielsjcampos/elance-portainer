'use client'
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export const GradientCard = ({
    children,
    title,
    glowColor = "purple"
}: {
    children: React.ReactNode,
    title: string,
    glowColor?: "purple" | "blue" | "red"
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    // Select glow colors based on prop
    const getGlowColors = () => {
        switch (glowColor) {
            case "blue":
                return {
                    primary: "rgba(56, 189, 248, 0.7)",
                    secondary: "rgba(59, 130, 246, 0.7)",
                    center: "rgba(37, 99, 235, 0.7)",
                    shadowHover: "0 0 20px 4px rgba(56, 189, 248, 0.9), 0 0 30px 6px rgba(59, 130, 246, 0.7), 0 0 40px 8px rgba(37, 99, 235, 0.5)",
                    shadowNormal: "0 0 15px 3px rgba(56, 189, 248, 0.8), 0 0 25px 5px rgba(59, 130, 246, 0.6), 0 0 35px 7px rgba(37, 99, 235, 0.4)"
                };
            case "red":
                return {
                    primary: "rgba(239, 68, 68, 0.7)",
                    secondary: "rgba(220, 38, 38, 0.7)",
                    center: "rgba(185, 28, 28, 0.7)",
                    shadowHover: "0 0 20px 4px rgba(239, 68, 68, 0.9), 0 0 30px 6px rgba(220, 38, 38, 0.7), 0 0 40px 8px rgba(185, 28, 28, 0.5)",
                    shadowNormal: "0 0 15px 3px rgba(239, 68, 68, 0.8), 0 0 25px 5px rgba(220, 38, 38, 0.6), 0 0 35px 7px rgba(185, 28, 28, 0.4)"
                };
            case "purple":
            default:
                return {
                    primary: "rgba(172, 92, 255, 0.7)",
                    secondary: "rgba(56, 189, 248, 0.7)",
                    center: "rgba(161, 58, 229, 0.7)",
                    shadowHover: "0 0 20px 4px rgba(172, 92, 255, 0.9), 0 0 30px 6px rgba(138, 58, 185, 0.7), 0 0 40px 8px rgba(56, 189, 248, 0.5)",
                    shadowNormal: "0 0 15px 3px rgba(172, 92, 255, 0.8), 0 0 25px 5px rgba(138, 58, 185, 0.6), 0 0 35px 7px rgba(56, 189, 248, 0.4)"
                };
        }
    };

    const colors = getGlowColors();

    // Handle mouse movement for 3D effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();

            // Calculate mouse position relative to card center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            setMousePosition({ x, y });

            // Calculate rotation (limited range for subtle effect)
            const rotateX = -(y / rect.height) * 5; // Max 5 degrees rotation
            const rotateY = (x / rect.width) * 5; // Max 5 degrees rotation

            setRotation({ x: rotateX, y: rotateY });
        }
    };

    // Reset rotation when not hovering
    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotation({ x: 0, y: 0 });
    };

    return (
        <div className="w-full flex items-center justify-center">
            {/* Card container with realistic 3D effect */}
            <motion.div
                ref={cardRef}
                className="relative rounded-[32px] overflow-hidden w-full max-w-[450px]"
                style={{
                    minHeight: "450px",
                    transformStyle: "preserve-3d",
                    backgroundColor: "#0e131f",
                    boxShadow: `0 -10px 100px 10px ${colors.primary.replace('0.7', '0.15')}, 0 0 10px 0 rgba(0, 0, 0, 0.5)`,
                }}
                initial={{ y: 0 }}
                animate={{
                    y: isHovered ? -5 : 0,
                    rotateX: rotation.x,
                    rotateY: rotation.y,
                    perspective: 1000,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                {/* Subtle glass reflection overlay */}
                <motion.div
                    className="absolute inset-0 z-35 pointer-events-none"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
                        backdropFilter: "blur(2px)",
                    }}
                    animate={{
                        opacity: isHovered ? 0.7 : 0.5,
                        rotateX: -rotation.x * 0.2,
                        rotateY: -rotation.y * 0.2,
                        z: 1,
                    }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                />

                {/* Dark background with black gradient like in the image */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "linear-gradient(180deg, #000000 0%, #000000 70%)",
                    }}
                    animate={{
                        z: -1
                    }}
                />

                {/* Noise texture overlay */}
                <motion.div
                    className="absolute inset-0 opacity-30 mix-blend-overlay z-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                    animate={{
                        z: -0.5
                    }}
                />

                {/* Subtle finger smudge texture for realism */}
                <motion.div
                    className="absolute inset-0 opacity-10 mix-blend-soft-light z-11 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='smudge'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01' numOctaves='3' seed='5' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='10'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23smudge)'/%3E%3C/svg%3E")`,
                        backdropFilter: "blur(1px)",
                    }}
                    animate={{
                        z: -0.25
                    }}
                />

                {/* glow effect matching the image */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-2/3 z-20"
                    style={{
                        background: `
              radial-gradient(ellipse at bottom right, ${colors.primary} -10%, rgba(79, 70, 229, 0) 70%),
              radial-gradient(ellipse at bottom left, ${colors.secondary} -10%, rgba(79, 70, 229, 0) 70%)
            `,
                        filter: "blur(40px)",
                    }}
                    animate={{
                        opacity: isHovered ? 0.9 : 0.8,
                        y: isHovered ? rotation.x * 0.5 : 0,
                        z: 0
                    }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                />

                {/* Central glow as seen in the image */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-2/3 z-21"
                    style={{
                        background: `
              radial-gradient(circle at bottom center, ${colors.center} -20%, rgba(79, 70, 229, 0) 60%)
            `,
                        filter: "blur(45px)",
                    }}
                    animate={{
                        opacity: isHovered ? 0.85 : 0.75,
                        y: isHovered ? `calc(10% + ${rotation.x * 0.3}px)` : "10%",
                        z: 0
                    }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                />

                {/* Enhanced bottom border glow for premium look */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] z-25"
                    style={{
                        background: "linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.05) 100%)",
                    }}
                    animate={{
                        boxShadow: isHovered ? colors.shadowHover : colors.shadowNormal,
                        opacity: isHovered ? 1 : 0.9,
                        z: 0.5
                    }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-1/4 w-[1px] z-25 rounded-full"
                    style={{
                        background: "linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0) 80%)",
                    }}
                    animate={{
                        boxShadow: isHovered ? colors.shadowHover : colors.shadowNormal,
                        opacity: isHovered ? 1 : 0.9,
                        z: 0.5
                    }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-1/4 z-25"
                    style={{
                        background: "linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.55) 15%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.25) 45%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0) 85%)",
                    }}
                    animate={{
                        boxShadow: isHovered ? colors.shadowHover : colors.shadowNormal,
                        opacity: isHovered ? 1 : 0.9,
                        z: 0.5
                    }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 h-1/4 w-[1px] z-25 rounded-full"
                    style={{
                        background: "linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 20%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0) 80%)",
                    }}
                    animate={{
                        boxShadow: isHovered ? colors.shadowHover : colors.shadowNormal,
                        opacity: isHovered ? 1 : 0.9,
                        z: 0.5
                    }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 h-1/3 z-25"
                    style={{
                        background: "linear-gradient(to top, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.55) 15%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.25) 45%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0) 85%)",
                    }}
                    animate={{
                        boxShadow: isHovered ? colors.shadowHover : colors.shadowNormal,
                        opacity: isHovered ? 1 : 0.9,
                        z: 0.5
                    }}
                    transition={{
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                />

                {/* Card content */}
                <motion.div
                    className="relative flex flex-col h-full p-8 z-40"
                    animate={{
                        z: 2
                    }}
                >
                    <motion.div
                        className="mb-auto"
                        animate={{
                            z: isHovered ? 5 : 2,
                            rotateX: isHovered ? -rotation.x * 0.3 : 0,
                            rotateY: isHovered ? -rotation.y * 0.3 : 0
                        }}
                        transition={{
                            duration: 0.4,
                            ease: "easeOut"
                        }}
                    >
                        <motion.h3
                            className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4"
                            style={{
                                letterSpacing: "-0.01em",
                                lineHeight: 1.2,
                            }}
                            initial={{ filter: "blur(3px)", opacity: 0.7 }}
                            animate={{
                                textShadow: isHovered ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
                                filter: "blur(0px)",
                                opacity: 1,
                                transition: { duration: 1.2, delay: 0.2 }
                            }}
                        >
                            {title}
                        </motion.h3>

                        <motion.div
                            className="text-sm text-gray-300 w-full"
                            initial={{ filter: "blur(3px)", opacity: 0.7 }}
                            animate={{
                                textShadow: isHovered ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                                filter: "blur(0px)",
                                opacity: 0.85,
                                transition: { duration: 1.2, delay: 0.4 }
                            }}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};
