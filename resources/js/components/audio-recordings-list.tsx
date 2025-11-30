import { Button } from '@/components/ui/button';
import { type AudioRecording } from '@/types/audio-recording';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface AudioRecordingsListProps {
    projectId: number;
    taskId: number;
    recordings: AudioRecording[];
}

function formatDuration(seconds: number | null): string {
    if (!seconds) return '--:--';
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

export function AudioRecordingsList({
    projectId,
    taskId,
    recordings,
}: AudioRecordingsListProps) {
    if (!recordings || recordings.length === 0) {
        return null;
    }

    const handleDelete = (recordingId: number) => {
        if (confirm('Delete this recording?')) {
            router.delete(
                `/projects/${projectId}/tasks/${taskId}/recordings/${recordingId}`,
                {
                    preserveScroll: true,
                },
            );
        }
    };

    return (
        <div className="mt-2 space-y-2">
            {recordings.map((recording) => (
                <div
                    key={recording.id}
                    className="flex items-center gap-3 rounded-md bg-muted/50 px-3 py-2"
                >
                    <audio
                        src={`/projects/${projectId}/tasks/${taskId}/recordings/${recording.id}`}
                        controls
                        className="h-8 max-w-[300px] flex-1"
                    />
                    <span className="text-xs text-muted-foreground">
                        {formatDuration(recording.duration)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {formatFileSize(recording.file_size)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {new Date(recording.created_at).toLocaleDateString()}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => handleDelete(recording.id)}
                    >
                        <Trash2 className="size-3" />
                    </Button>
                </div>
            ))}
        </div>
    );
}
