import { Button } from '@/components/ui/button';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { Textarea } from '@/components/ui/textarea';
import { type QuickThought } from '@/types/quick-thought';
import { router } from '@inertiajs/react';
import { ArrowRight, Check, Mic, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface QuickThoughtCardProps {
    thought: QuickThought;
    onConvert: (thought: QuickThought) => void;
}

function formatDuration(seconds: number | null): string {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes: number | null): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function QuickThoughtCard({ thought, onConvert }: QuickThoughtCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(thought.content || '');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleSaveEdit = () => {
        router.put(`/quick-thoughts/${thought.id}`, { content: editContent }, {
            preserveScroll: true,
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleDelete = () => {
        if (!confirm('Delete this thought?')) return;
        setIsDeleting(true);
        router.delete(`/quick-thoughts/${thought.id}`, {
            preserveScroll: true,
            onError: () => setIsDeleting(false),
        });
    };

    const handleDeleteRecording = (recordingId: number) => {
        if (!confirm('Delete this recording?')) return;
        router.delete(`/quick-thoughts/${thought.id}/recordings/${recordingId}`, {
            preserveScroll: true,
        });
    };

    return (
        <div
            className={`relative overflow-hidden border rounded-lg p-4 bg-background transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Hover glow effect */}
            <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
                <DottedGlowBackground
                    gap={16}
                    radius={1.5}
                    color="rgba(100, 100, 100, 0.3)"
                    darkColor="rgba(200, 200, 200, 0.3)"
                    glowColor="rgba(59, 130, 246, 0.6)"
                    darkGlowColor="rgba(96, 165, 250, 0.6)"
                    opacity={0.8}
                    speedMin={0.5}
                    speedMax={1.2}
                    speedScale={1}
                />
            </div>
            {/* Content wrapper with z-index to stay above background */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(thought.created_at)}
                    </span>
                    <div className="flex items-center gap-1">
                        {!isEditing && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 text-muted-foreground hover:text-foreground"
                                    onClick={() => {
                                        setEditContent(thought.content || '');
                                        setIsEditing(true);
                                    }}
                                >
                                    <Pencil className="size-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 text-muted-foreground hover:text-destructive"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="size-3.5" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Content */}
                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[80px] resize-none"
                            autoFocus
                        />
                        <div className="flex items-center gap-2 justify-end">
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                                <X className="size-4 mr-1" />
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveEdit}>
                                <Check className="size-4 mr-1" />
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {thought.content && (
                            <p className="text-sm whitespace-pre-wrap mb-3">{thought.content}</p>
                        )}
                    </>
                )}

                {/* Recordings */}
                {thought.recordings && thought.recordings.length > 0 && (
                    <div className="space-y-2 mb-3">
                        {thought.recordings.map((recording) => (
                            <div
                                key={recording.id}
                                className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
                            >
                                <Mic className="size-3.5 text-muted-foreground flex-shrink-0" />
                                <audio
                                    src={`/quick-thoughts/${thought.id}/recordings/${recording.id}`}
                                    controls
                                    className="h-8 flex-1"
                                />
                                <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                                    {formatDuration(recording.duration)}
                                </span>
                                {recording.file_size && (
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                        {formatFileSize(recording.file_size)}
                                    </span>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                                    onClick={() => handleDeleteRecording(recording.id)}
                                >
                                    <Trash2 className="size-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                {!isEditing && (
                    <div className="flex items-center justify-end pt-2 border-t">
                        <Button variant="outline" size="sm" onClick={() => onConvert(thought)}>
                            <ArrowRight className="size-4 mr-1.5" />
                            Convert to Task
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
