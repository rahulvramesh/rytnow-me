import { cn } from '@/lib/utils';
import { type EstimateProgress } from '@/types/task';
import { Clock } from 'lucide-react';

interface EstimateProgressBarProps {
    progress: EstimateProgress | null;
    variant?: 'default' | 'compact' | 'inline';
    showLabel?: boolean;
    className?: string;
}

function formatHours(hours: number): string {
    if (hours < 1) {
        return `${Math.round(hours * 60)}m`;
    }
    if (hours % 1 === 0) {
        return `${hours}h`;
    }
    return `${hours.toFixed(1)}h`;
}

function getProgressColor(percentage: number, overEstimate: boolean): string {
    if (overEstimate) {
        return 'bg-red-500 dark:bg-red-600';
    }
    if (percentage >= 80) {
        return 'bg-yellow-500 dark:bg-yellow-600';
    }
    return 'bg-green-500 dark:bg-green-600';
}

function getProgressTextColor(percentage: number, overEstimate: boolean): string {
    if (overEstimate) {
        return 'text-red-600 dark:text-red-400';
    }
    if (percentage >= 80) {
        return 'text-yellow-600 dark:text-yellow-400';
    }
    return 'text-green-600 dark:text-green-400';
}

export function EstimateProgressBar({
    progress,
    variant = 'default',
    showLabel = true,
    className,
}: EstimateProgressBarProps) {
    if (!progress) {
        return null;
    }

    const { estimated, actual, percentage, over_estimate } = progress;
    const barWidth = Math.min(percentage, 100);

    // Inline variant - just text
    if (variant === 'inline') {
        return (
            <span
                className={cn(
                    'inline-flex items-center gap-1 text-xs',
                    getProgressTextColor(percentage, over_estimate),
                    className,
                )}
            >
                <Clock className="size-3" />
                {formatHours(actual)} / {formatHours(estimated)}
            </span>
        );
    }

    // Compact variant - small bar with no labels
    if (variant === 'compact') {
        return (
            <div
                className={cn('flex items-center gap-1.5', className)}
                title={`${formatHours(actual)} / ${formatHours(estimated)} (${percentage}%)`}
            >
                <div className="h-1 w-12 overflow-hidden rounded-full bg-muted">
                    <div
                        className={cn(
                            'h-full rounded-full transition-all',
                            getProgressColor(percentage, over_estimate),
                        )}
                        style={{ width: `${barWidth}%` }}
                    />
                </div>
                <span
                    className={cn(
                        'text-[10px] tabular-nums',
                        getProgressTextColor(percentage, over_estimate),
                    )}
                >
                    {formatHours(actual)}
                </span>
            </div>
        );
    }

    // Default variant - full bar with labels
    return (
        <div className={cn('space-y-1', className)}>
            {showLabel && (
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Time Progress</span>
                    <span
                        className={cn(
                            'font-medium tabular-nums',
                            getProgressTextColor(percentage, over_estimate),
                        )}
                    >
                        {formatHours(actual)} / {formatHours(estimated)}
                        {over_estimate && (
                            <span className="ml-1 text-red-500">
                                (+{formatHours(actual - estimated)})
                            </span>
                        )}
                    </span>
                </div>
            )}
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-300',
                        getProgressColor(percentage, over_estimate),
                    )}
                    style={{ width: `${barWidth}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0h</span>
                <span>{percentage.toFixed(0)}%</span>
                <span>{formatHours(estimated)}</span>
            </div>
        </div>
    );
}

interface EstimatedHoursInputProps {
    value: number | null;
    onChange: (value: number | null) => void;
    disabled?: boolean;
    className?: string;
}

const COMMON_ESTIMATES = [0.5, 1, 2, 4, 8, 16] as const;

export function EstimatedHoursInput({
    value,
    onChange,
    disabled = false,
    className,
}: EstimatedHoursInputProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex flex-wrap gap-1.5">
                {COMMON_ESTIMATES.map((hours) => (
                    <button
                        key={hours}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(value === hours ? null : hours)}
                        className={cn(
                            'flex h-7 items-center justify-center rounded-md border px-2 text-xs font-medium transition-colors',
                            value === hours
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                            disabled && 'cursor-not-allowed opacity-50',
                        )}
                    >
                        {hours < 1 ? `${hours * 60}m` : `${hours}h`}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    min="0.25"
                    max="999"
                    step="0.25"
                    value={value ?? ''}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange(val ? parseFloat(val) : null);
                    }}
                    disabled={disabled}
                    placeholder="Custom hours"
                    className={cn(
                        'h-8 w-full rounded-md border border-input bg-background px-3 text-sm',
                        'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                />
                {value !== null && (
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
