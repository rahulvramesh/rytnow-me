import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

export const STORY_POINTS = [1, 2, 3, 5, 8, 13] as const;

export type StoryPoints = (typeof STORY_POINTS)[number] | null;

interface StoryPointsSelectProps {
    value: StoryPoints;
    onChange: (value: StoryPoints) => void;
    disabled?: boolean;
    className?: string;
}

export function StoryPointsSelect({
    value,
    onChange,
    disabled = false,
    className,
}: StoryPointsSelectProps) {
    return (
        <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
            {STORY_POINTS.map((points) => (
                <button
                    key={points}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(value === points ? null : points)}
                    className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-md border text-xs font-medium transition-colors',
                        value === points
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                >
                    {points}
                </button>
            ))}
        </div>
    );
}

interface StoryPointsBadgeProps {
    points: number | null;
    variant?: 'default' | 'compact';
    className?: string;
}

export function StoryPointsBadge({
    points,
    variant = 'default',
    className,
}: StoryPointsBadgeProps) {
    if (!points) {
        return null;
    }

    if (variant === 'compact') {
        return (
            <span
                className={cn(
                    'inline-flex items-center text-[10px] font-medium text-muted-foreground',
                    className,
                )}
            >
                {points}SP
            </span>
        );
    }

    return (
        <div
            className={cn(
                'inline-flex items-center gap-0.5 rounded border border-blue-300 bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
                className,
            )}
        >
            <Zap className="size-2.5" />
            <span>{points}</span>
        </div>
    );
}
