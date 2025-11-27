import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { fetchHeaders } from '@/lib/csrf';
import { type TimeEntry } from '@/types/time-entry';
import { router } from '@inertiajs/react';
import { Clock, History, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface TimeEntriesSheetProps {
    projectId: number;
    taskId: number;
    timeEntries: TimeEntry[];
    totalTime: number;
}

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    });
}

interface TimeEntryItemProps {
    entry: TimeEntry;
    projectId: number;
    taskId: number;
}

function TimeEntryItem({ entry, projectId, taskId }: TimeEntryItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [note, setNote] = useState(entry.description || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const response = await fetch(`/projects/${projectId}/tasks/${taskId}/time/${entry.id}`, {
            method: 'PUT',
            headers: fetchHeaders(),
            body: JSON.stringify({ description: note }),
        });

        if (response.ok) {
            setIsEditing(false);
            router.reload();
        }
        setIsSaving(false);
    };

    const handleDelete = () => {
        if (confirm('Delete this time entry?')) {
            router.delete(`/projects/${projectId}/tasks/${taskId}/time/${entry.id}`, {
                preserveScroll: true,
            });
        }
    };

    const isRunning = !entry.stopped_at;

    return (
        <div className="group border rounded-xl p-5 hover:border-primary/50 transition-colors bg-card">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        {isRunning ? (
                            <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <span className="size-2.5 animate-pulse rounded-full bg-green-500" />
                                <span className="font-medium">Running</span>
                            </span>
                        ) : (
                            <span className="font-mono text-xl font-semibold">
                                {formatDuration(entry.duration || 0)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatTime(entry.started_at)}</span>
                        {entry.stopped_at && (
                            <>
                                <span className="text-muted-foreground/50">→</span>
                                <span>{formatTime(entry.stopped_at)}</span>
                            </>
                        )}
                    </div>
                </div>
                {!isRunning && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-9"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Pencil className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 text-destructive hover:text-destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Note display or edit */}
            {isEditing ? (
                <div className="mt-4 space-y-3">
                    <Textarea
                        placeholder="Add a note about what you worked on..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="text-sm"
                    />
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setIsEditing(false);
                                setNote(entry.description || '');
                            }}
                        >
                            <X className="size-3 mr-1" />
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : entry.description ? (
                <p className="mt-4 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-3">
                    {entry.description}
                </p>
            ) : null}
        </div>
    );
}

export function TimeEntriesSheet({ projectId, taskId, timeEntries, totalTime }: TimeEntriesSheetProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [hours, setHours] = useState('0');
    const [minutes, setMinutes] = useState('0');
    const [description, setDescription] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddEntry = () => {
        setIsAdding(true);
        router.post(
            `/projects/${projectId}/tasks/${taskId}/time`,
            {
                duration_hours: parseFloat(hours) || 0,
                duration_minutes: parseFloat(minutes) || 0,
                description: description || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddForm(false);
                    setHours('0');
                    setMinutes('0');
                    setDescription('');
                    setIsAdding(false);
                },
                onError: () => setIsAdding(false),
            }
        );
    };

    // Group entries by date
    const entriesByDate = timeEntries.reduce((acc, entry) => {
        const date = formatDate(entry.started_at);
        if (!acc[date]) acc[date] = [];
        acc[date].push(entry);
        return acc;
    }, {} as Record<string, TimeEntry[]>);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <History className="size-4" />
                    View All
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
                <SheetHeader className="pb-6">
                    <SheetTitle className="flex items-center gap-2 text-lg">
                        <Clock className="size-5" />
                        Time Log
                    </SheetTitle>
                </SheetHeader>

                {/* Summary */}
                <div className="bg-muted/50 rounded-xl p-5 mb-8">
                    <div className="text-sm text-muted-foreground mb-1">Total Time Logged</div>
                    <div className="text-3xl font-bold">{formatDuration(totalTime)}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                        {timeEntries.length} {timeEntries.length === 1 ? 'entry' : 'entries'}
                    </div>
                </div>

                {/* Add Entry Button/Form */}
                {!showAddForm ? (
                    <Button
                        variant="outline"
                        className="w-full mb-8 gap-2 h-11"
                        onClick={() => setShowAddForm(true)}
                    >
                        <Plus className="size-4" />
                        Add Manual Entry
                    </Button>
                ) : (
                    <div className="border rounded-xl p-5 mb-8 space-y-4">
                        <div className="font-medium">Add Time Entry</div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs text-muted-foreground">Hours</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-muted-foreground">Minutes</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={minutes}
                                    onChange={(e) => setMinutes(e.target.value)}
                                    className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Note (optional)</label>
                            <Textarea
                                placeholder="What did you work on?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="mt-1 text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAddEntry} disabled={isAdding} className="flex-1">
                                {isAdding ? 'Adding...' : 'Add Entry'}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setHours('0');
                                    setMinutes('0');
                                    setDescription('');
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Entries List */}
                {timeEntries.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <Clock className="size-14 mx-auto mb-4 opacity-30" />
                        <p className="font-medium text-base">No time entries yet</p>
                        <p className="text-sm mt-1">Start the timer or add a manual entry</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(entriesByDate).map(([date, entries]) => (
                            <div key={date}>
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
                                    {date}
                                </div>
                                <div className="space-y-3">
                                    {entries.map((entry) => (
                                        <TimeEntryItem
                                            key={entry.id}
                                            entry={entry}
                                            projectId={projectId}
                                            taskId={taskId}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
