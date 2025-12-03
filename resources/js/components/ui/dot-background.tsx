import { cn } from '@/lib/utils';
import React from 'react';

interface DotBackgroundProps {
    children?: React.ReactNode;
    className?: string;
    dotColor?: string;
    dotColorDark?: string;
    dotSize?: string;
    fadeCenter?: boolean;
}

export function DotBackground({
    children,
    className,
    dotColor = '#d4d4d4',
    dotColorDark = '#404040',
    dotSize = '20px',
    fadeCenter = true,
}: DotBackgroundProps) {
    return (
        <div className={cn('relative h-full w-full', className)}>
            {/* Dot pattern */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundSize: `${dotSize} ${dotSize}`,
                    backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
                }}
            />
            {/* Dark mode dot pattern */}
            <div
                className="absolute inset-0 hidden dark:block"
                style={{
                    backgroundSize: `${dotSize} ${dotSize}`,
                    backgroundImage: `radial-gradient(${dotColorDark} 1px, transparent 1px)`,
                }}
            />
            {/* Hide light mode dots in dark mode */}
            <style>{`
                .dark .dot-light { display: none; }
            `}</style>
            {/* Radial fade effect */}
            {fadeCenter && (
                <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            )}
            {/* Content */}
            <div className="relative z-10 h-full w-full">{children}</div>
        </div>
    );
}
