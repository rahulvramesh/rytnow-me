import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

interface FocusTimerProps {
    defaultMinutes?: number;
    onComplete?: () => void;
    className?: string;
}

export interface FocusTimerRef {
    toggle: () => void;
    reset: () => void;
    isRunning: boolean;
}

export const FocusTimer = forwardRef<FocusTimerRef, FocusTimerProps>(function FocusTimer({
    defaultMinutes = 25,
    onComplete,
    className,
}, ref) {
    const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [initialSeconds] = useState(defaultMinutes * 60);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning && totalSeconds > 0) {
            interval = setInterval(() => {
                setTotalSeconds((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        onComplete?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, totalSeconds, onComplete]);

    const toggleTimer = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsRunning(false);
        setTotalSeconds(initialSeconds);
    }, [initialSeconds]);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
        toggle: toggleTimer,
        reset: resetTimer,
        isRunning,
    }), [toggleTimer, resetTimer, isRunning]);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const progress = ((initialSeconds - totalSeconds) / initialSeconds) * 100;

    const formatTime = (mins: number, secs: number) => {
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cn('flex items-center gap-3', className)}>
            {/* Progress ring */}
            <div className="relative size-12">
                <svg className="size-12 -rotate-90" viewBox="0 0 48 48">
                    {/* Background circle */}
                    <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-muted/30"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                        className="text-primary transition-all duration-1000"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium tabular-nums">
                        {formatTime(minutes, seconds)}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={toggleTimer}
                    title={isRunning ? 'Pause' : 'Start'}
                >
                    {isRunning ? (
                        <Pause className="size-4" />
                    ) : (
                        <Play className="size-4" />
                    )}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="size-8 p-0"
                    onClick={resetTimer}
                    title="Reset"
                >
                    <RotateCcw className="size-4" />
                </Button>
            </div>
        </div>
    );
});
