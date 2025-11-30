import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    className?: string;
}

const WORKSPACE_COLORS = [
    '#6366f1', // Indigo (default)
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
    '#3b82f6', // Blue
    '#6b7280', // Gray
    '#1f2937', // Dark gray
];

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
    return (
        <div className={cn('grid grid-cols-6 gap-2', className)}>
            {WORKSPACE_COLORS.map((color) => (
                <button
                    key={color}
                    type="button"
                    onClick={() => onChange(color)}
                    className={cn(
                        'size-8 rounded-full transition-all hover:scale-110 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                        value === color && 'ring-2 ring-ring ring-offset-2',
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                >
                    {value === color && (
                        <Check className="mx-auto size-4 text-white" />
                    )}
                </button>
            ))}
        </div>
    );
}

export { WORKSPACE_COLORS };
