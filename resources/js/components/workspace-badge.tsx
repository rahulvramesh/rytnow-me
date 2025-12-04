import { cn } from '@/lib/utils';

interface WorkspaceBadgeProps {
    workspace: {
        id: number;
        name: string;
        color: string;
    };
    size?: 'sm' | 'md';
    className?: string;
}

export function WorkspaceBadge({
    workspace,
    size = 'sm',
    className,
}: WorkspaceBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium',
                size === 'sm' ? 'text-[10px]' : 'text-xs',
                className
            )}
            style={{
                backgroundColor: `${workspace.color}15`,
                color: workspace.color,
            }}
        >
            <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: workspace.color }}
            />
            {workspace.name}
        </span>
    );
}
