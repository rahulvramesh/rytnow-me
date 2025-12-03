'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import * as React from 'react';

interface DatePickerProps {
    value?: string; // ISO date string (YYYY-MM-DD)
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    clearable?: boolean;
    minDate?: Date;
    maxDate?: Date;
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Pick a date',
    className,
    disabled = false,
    clearable = true,
    minDate,
    maxDate,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    const selectedDate = value ? parseISO(value) : undefined;

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            // Format as YYYY-MM-DD for form submission
            const formatted = format(date, 'yyyy-MM-dd');
            onChange?.(formatted);
        }
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.('');
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'h-11 w-full justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        className,
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                        <span className="flex-1">
                            {format(selectedDate, 'PPP')}
                        </span>
                    ) : (
                        <span className="flex-1">{placeholder}</span>
                    )}
                    {value && clearable && (
                        <X
                            className="h-4 w-4 opacity-50 hover:opacity-100"
                            onClick={handleClear}
                        />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    disabled={(date) => {
                        if (minDate && date < minDate) return true;
                        if (maxDate && date > maxDate) return true;
                        return false;
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

interface DateRangePickerProps {
    startDate?: string;
    endDate?: string;
    onStartDateChange?: (value: string) => void;
    onEndDateChange?: (value: string) => void;
    startPlaceholder?: string;
    endPlaceholder?: string;
    className?: string;
    disabled?: boolean;
}

export function DateRangePicker({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    startPlaceholder = 'Start date',
    endPlaceholder = 'End date',
    className,
    disabled = false,
}: DateRangePickerProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <DatePicker
                value={startDate}
                onChange={onStartDateChange}
                placeholder={startPlaceholder}
                disabled={disabled}
                maxDate={endDate ? parseISO(endDate) : undefined}
            />
            <span className="text-muted-foreground">to</span>
            <DatePicker
                value={endDate}
                onChange={onEndDateChange}
                placeholder={endPlaceholder}
                disabled={disabled}
                minDate={startDate ? parseISO(startDate) : undefined}
            />
        </div>
    );
}

// Compact inline date picker for tables/lists
interface InlineDatePickerProps {
    value?: string | null;
    onChange?: (value: string | null) => void;
    placeholder?: string;
    className?: string;
    isOverdue?: boolean;
}

export function InlineDatePicker({
    value,
    onChange,
    placeholder = 'Set date',
    className,
    isOverdue = false,
}: InlineDatePickerProps) {
    const [open, setOpen] = React.useState(false);

    const selectedDate = value ? parseISO(value) : undefined;

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            const formatted = format(date, 'yyyy-MM-dd');
            onChange?.(formatted);
        }
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(null);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        'inline-flex h-7 items-center gap-1 rounded px-2 text-xs transition-colors hover:bg-muted',
                        isOverdue && 'text-red-500',
                        !value && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className="h-3 w-3" />
                    {selectedDate ? (
                        <span>{format(selectedDate, 'MMM d')}</span>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    {value && (
                        <X
                            className="h-3 w-3 opacity-50 hover:opacity-100"
                            onClick={handleClear}
                        />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
