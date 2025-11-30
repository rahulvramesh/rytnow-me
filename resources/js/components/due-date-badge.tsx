import { cn } from '@/lib/utils';
import { AlertCircle, Calendar, Clock } from 'lucide-react';

export type DueDateUrgency = 'overdue' | 'today' | 'soon' | 'upcoming' | 'none';

interface DueDateInfo {
    urgency: DueDateUrgency;
    label: string;
    daysUntil: number;
}

export function getDueDateInfo(dueDate: string | null): DueDateInfo {
    if (!dueDate) {
        return { urgency: 'none', label: '', daysUntil: 0 };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0); // Start of due date

    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        return {
            urgency: 'overdue',
            label: absDays === 1 ? '1 day overdue' : `${absDays} days overdue`,
            daysUntil: diffDays,
        };
    }

    if (diffDays === 0) {
        return { urgency: 'today', label: 'Due today', daysUntil: 0 };
    }

    if (diffDays === 1) {
        return { urgency: 'soon', label: 'Due tomorrow', daysUntil: 1 };
    }

    if (diffDays <= 3) {
        return {
            urgency: 'soon',
            label: `Due in ${diffDays} days`,
            daysUntil: diffDays,
        };
    }

    if (diffDays <= 7) {
        return {
            urgency: 'upcoming',
            label: `Due in ${diffDays} days`,
            daysUntil: diffDays,
        };
    }

    return {
        urgency: 'upcoming',
        label: due.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        }),
        daysUntil: diffDays,
    };
}

const urgencyStyles = {
    overdue: {
        bg: 'bg-red-100 dark:bg-red-950',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-300 dark:border-red-800',
        icon: 'text-red-600 dark:text-red-400',
    },
    today: {
        bg: 'bg-orange-100 dark:bg-orange-950',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-300 dark:border-orange-800',
        icon: 'text-orange-600 dark:text-orange-400',
    },
    soon: {
        bg: 'bg-yellow-100 dark:bg-yellow-950',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-300 dark:border-yellow-800',
        icon: 'text-yellow-600 dark:text-yellow-400',
    },
    upcoming: {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        border: 'border-border',
        icon: 'text-muted-foreground',
    },
    none: {
        bg: '',
        text: '',
        border: '',
        icon: '',
    },
};

interface DueDateBadgeProps {
    dueDate: string | null;
    variant?: 'default' | 'compact' | 'text-only';
    showIcon?: boolean;
    className?: string;
}

export function DueDateBadge({
    dueDate,
    variant = 'default',
    showIcon = true,
    className,
}: DueDateBadgeProps) {
    const info = getDueDateInfo(dueDate);

    if (info.urgency === 'none') {
        return null;
    }

    const styles = urgencyStyles[info.urgency];
    const IconComponent =
        info.urgency === 'overdue'
            ? AlertCircle
            : info.urgency === 'today'
              ? Clock
              : Calendar;

    // Text-only variant (for tight spaces)
    if (variant === 'text-only') {
        return (
            <span
                className={cn(
                    'text-[10px] font-medium tabular-nums',
                    styles.text,
                    className,
                )}
            >
                {info.label}
            </span>
        );
    }

    // Compact variant (inline)
    if (variant === 'compact') {
        return (
            <div
                className={cn(
                    'flex items-center gap-0.5 text-[10px]',
                    styles.text,
                    className,
                )}
            >
                {showIcon && <IconComponent className="size-2.5" />}
                <span className="tabular-nums">{info.label}</span>
            </div>
        );
    }

    // Default variant (badge)
    return (
        <div
            className={cn(
                'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium',
                styles.bg,
                styles.text,
                styles.border,
                className,
            )}
        >
            {showIcon && <IconComponent className="size-2.5" />}
            <span className="tabular-nums">{info.label}</span>
        </div>
    );
}
