import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { Loader2, Mic, Send, Square, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface QuickThoughtInputProps {
    compact?: boolean;
    onSuccess?: () => void;
    autoFocus?: boolean;
}

export function QuickThoughtInput({ compact = false, onSuccess, autoFocus = false }: QuickThoughtInputProps) {
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    const startRecording = useCallback(async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Audio recording requires HTTPS. Please access this site via HTTPS or localhost.');
            return;
        }

        try {
            if (navigator.permissions) {
                try {
                    const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
                    if (permissionStatus.state === 'denied') {
                        alert('Microphone access was denied. Please enable it in your browser settings and reload the page.');
                        return;
                    }
                } catch {
                    // permissions.query may not support microphone in all browsers
                }
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            let mimeType = 'audio/webm';
            if (!MediaRecorder.isTypeSupported('audio/webm')) {
                if (MediaRecorder.isTypeSupported('audio/mp4')) {
                    mimeType = 'audio/mp4';
                } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
                    mimeType = 'audio/ogg';
                }
            }

            const mediaRecorder = new MediaRecorder(stream, { mimeType });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
                setAudioBlob(blob);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start(1000);
            startTimeRef.current = Date.now();
            setIsRecording(true);
            setAudioBlob(null);

            timerRef.current = setInterval(() => {
                setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);
        } catch (err) {
            console.error('Failed to start recording:', err);
            const error = err as Error;
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                alert('Microphone access was denied. Please allow microphone access in your browser and try again.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                alert('No microphone found. Please connect a microphone and try again.');
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                alert('Microphone is in use by another application. Please close other apps using the microphone.');
            } else {
                alert(`Could not access microphone: ${error.message}`);
            }
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    const discardRecording = () => {
        setAudioBlob(null);
        setRecordingTime(0);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = useCallback(() => {
        if (!content.trim() && !audioBlob) return;

        setIsSubmitting(true);

        const formData = new FormData();
        if (content.trim()) {
            formData.append('content', content.trim());
        }
        if (audioBlob) {
            const extension = audioBlob.type.includes('webm') ? 'webm' : 'm4a';
            formData.append('audio', audioBlob, `recording-${Date.now()}.${extension}`);
            formData.append('duration', String(recordingTime));
        }

        router.post('/quick-thoughts', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setContent('');
                setAudioBlob(null);
                setRecordingTime(0);
                setIsSubmitting(false);
                onSuccess?.();
            },
            onError: () => {
                setIsSubmitting(false);
                alert('Failed to save thought');
            },
        });
    }, [content, audioBlob, recordingTime, onSuccess]);

    const canSubmit = (content.trim() || audioBlob) && !isRecording && !isSubmitting;

    if (compact) {
        return (
            <div className="space-y-3">
                <Textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[80px] resize-none"
                    autoFocus={autoFocus}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
                            handleSubmit();
                        }
                    }}
                />

                {/* Audio recording section */}
                {audioBlob && !isRecording && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <audio src={URL.createObjectURL(audioBlob)} controls className="h-8 flex-1" />
                        <Button variant="ghost" size="icon" className="size-7" onClick={discardRecording}>
                            <X className="size-4" />
                        </Button>
                    </div>
                )}

                {isRecording && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-md">
                        <span className="size-2 animate-pulse rounded-full bg-red-600" />
                        <span className="text-sm font-medium text-red-600">{formatTime(recordingTime)}</span>
                        <span className="flex-1 text-sm text-muted-foreground">Recording...</span>
                        <Button variant="destructive" size="sm" onClick={stopRecording}>
                            <Square className="size-3 mr-1" />
                            Stop
                        </Button>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {!isRecording && !audioBlob && (
                            <Button variant="ghost" size="sm" onClick={startRecording} className="text-muted-foreground">
                                <Mic className="size-4 mr-1" />
                                Record
                            </Button>
                        )}
                    </div>
                    <Button size="sm" onClick={handleSubmit} disabled={!canSubmit}>
                        {isSubmitting ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <>
                                <Send className="size-4 mr-1" />
                                Capture
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-4 bg-background">
            <Textarea
                placeholder="Capture a quick thought... (text, voice, or both)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 p-0 focus-visible:ring-0 text-base"
                autoFocus={autoFocus}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && canSubmit) {
                        handleSubmit();
                    }
                }}
            />

            {/* Audio recording section */}
            {audioBlob && !isRecording && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded-md">
                    <audio src={URL.createObjectURL(audioBlob)} controls className="h-8 flex-1" />
                    <Button variant="ghost" size="icon" className="size-7" onClick={discardRecording}>
                        <X className="size-4" />
                    </Button>
                </div>
            )}

            {isRecording && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 dark:bg-red-950/20 rounded-md">
                    <span className="size-2 animate-pulse rounded-full bg-red-600" />
                    <span className="text-sm font-medium text-red-600">{formatTime(recordingTime)}</span>
                    <span className="flex-1 text-sm text-muted-foreground">Recording...</span>
                    <Button variant="destructive" size="sm" onClick={stopRecording}>
                        <Square className="size-3 mr-1" />
                        Stop
                    </Button>
                </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                    {!isRecording && !audioBlob && (
                        <Button variant="outline" size="sm" onClick={startRecording}>
                            <Mic className="size-4 mr-1.5" />
                            Record Voice
                        </Button>
                    )}
                    <span className="text-xs text-muted-foreground">
                        Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to save
                    </span>
                </div>
                <Button onClick={handleSubmit} disabled={!canSubmit}>
                    {isSubmitting ? (
                        <Loader2 className="size-4 animate-spin mr-1.5" />
                    ) : (
                        <Send className="size-4 mr-1.5" />
                    )}
                    Capture Thought
                </Button>
            </div>
        </div>
    );
}
