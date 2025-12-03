'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface ZenBackgroundProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'aurora' | 'waves' | 'breath' | 'minimal';
}

// Get colors based on time of day
function getTimeBasedColors(): { primary: string; secondary: string; accent: string } {
    const hour = new Date().getHours();

    // Early morning (5-8): Warm sunrise
    if (hour >= 5 && hour < 8) {
        return {
            primary: 'rgba(251, 146, 60, 0.15)',   // orange
            secondary: 'rgba(251, 191, 36, 0.1)',  // amber
            accent: 'rgba(254, 215, 170, 0.08)',   // peach
        };
    }
    // Morning (8-12): Fresh, energetic
    if (hour >= 8 && hour < 12) {
        return {
            primary: 'rgba(34, 197, 94, 0.12)',    // green
            secondary: 'rgba(59, 130, 246, 0.1)',  // blue
            accent: 'rgba(147, 197, 253, 0.08)',   // light blue
        };
    }
    // Afternoon (12-17): Calm, focused
    if (hour >= 12 && hour < 17) {
        return {
            primary: 'rgba(99, 102, 241, 0.12)',   // indigo
            secondary: 'rgba(139, 92, 246, 0.1)',  // violet
            accent: 'rgba(196, 181, 253, 0.08)',   // lavender
        };
    }
    // Evening (17-20): Warm wind-down
    if (hour >= 17 && hour < 20) {
        return {
            primary: 'rgba(244, 63, 94, 0.1)',     // rose
            secondary: 'rgba(251, 146, 60, 0.1)',  // orange
            accent: 'rgba(254, 205, 211, 0.08)',   // pink
        };
    }
    // Night (20-5): Deep, restful
    return {
        primary: 'rgba(99, 102, 241, 0.1)',    // indigo
        secondary: 'rgba(67, 56, 202, 0.08)',  // deep indigo
        accent: 'rgba(30, 27, 75, 0.1)',       // dark purple
    };
}

export function ZenBackground({
    children,
    className,
    variant = 'aurora',
}: ZenBackgroundProps) {
    const [colors, setColors] = useState(getTimeBasedColors);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Update colors every 30 minutes
        const interval = setInterval(() => {
            setColors(getTimeBasedColors());
        }, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return (
            <div className={cn('relative h-full w-full bg-background', className)}>
                {children}
            </div>
        );
    }

    return (
        <div className={cn('relative h-full w-full overflow-hidden bg-background', className)}>
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />

            {variant === 'aurora' && (
                <>
                    {/* Floating orbs with slow animation */}
                    <div
                        className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-zen-float-1 rounded-full opacity-60 blur-[100px]"
                        style={{ background: colors.primary }}
                    />
                    <div
                        className="absolute -right-1/4 top-1/4 h-[500px] w-[500px] animate-zen-float-2 rounded-full opacity-50 blur-[120px]"
                        style={{ background: colors.secondary }}
                    />
                    <div
                        className="absolute -bottom-1/4 left-1/3 h-[400px] w-[400px] animate-zen-float-3 rounded-full opacity-40 blur-[80px]"
                        style={{ background: colors.accent }}
                    />

                    {/* Subtle center glow */}
                    <div
                        className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 animate-zen-breathe rounded-full opacity-30 blur-[150px]"
                        style={{ background: colors.primary }}
                    />
                </>
            )}

            {variant === 'waves' && (
                <>
                    {/* Wave layers */}
                    <svg
                        className="absolute bottom-0 left-0 h-full w-full opacity-[0.03]"
                        viewBox="0 0 1440 800"
                        preserveAspectRatio="none"
                    >
                        <path
                            className="animate-zen-wave-1"
                            fill="currentColor"
                            d="M0,400 C360,300 720,500 1080,400 C1260,350 1440,450 1440,450 L1440,800 L0,800 Z"
                        />
                        <path
                            className="animate-zen-wave-2"
                            fill="currentColor"
                            fillOpacity="0.5"
                            d="M0,500 C360,400 720,600 1080,500 C1260,450 1440,550 1440,550 L1440,800 L0,800 Z"
                        />
                    </svg>
                </>
            )}

            {variant === 'breath' && (
                <>
                    {/* Central breathing circle */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div
                            className="h-[600px] w-[600px] animate-zen-breathe-deep rounded-full opacity-20 blur-[100px]"
                            style={{ background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)` }}
                        />
                    </div>
                    {/* Outer ring */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div
                            className="h-[900px] w-[900px] animate-zen-breathe-outer rounded-full opacity-10 blur-[120px]"
                            style={{ background: `radial-gradient(circle, transparent 40%, ${colors.secondary} 70%, transparent 100%)` }}
                        />
                    </div>
                </>
            )}

            {variant === 'minimal' && (
                <>
                    {/* Very subtle radial gradient */}
                    <div
                        className="absolute left-1/2 top-1/2 h-[1200px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
                        style={{
                            background: `radial-gradient(circle, ${colors.primary} 0%, transparent 60%)`
                        }}
                    />
                </>
            )}

            {/* Subtle noise texture overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette effect for focus */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(0,0,0,0.03)_100%)]" />

            {/* Content */}
            <div className="relative z-10 h-full w-full">{children}</div>
        </div>
    );
}
