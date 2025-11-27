import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Mic, MicOff, Pause, Play, Square, Trash2, Volume2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface ExplainTaskDialogProps {
    onSave: (audioBlob: Blob, duration: number) => void;
    children?: React.ReactNode;
}

export function ExplainTaskDialog({ onSave, children }: ExplainTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const pausedTimeRef = useRef<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start(1000);
            startTimeRef.current = Date.now();
            pausedTimeRef.current = 0;
            setIsRecording(true);
            setIsPaused(false);
            setAudioBlob(null);
            setAudioUrl(null);

            timerRef.current = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000);
                setRecordingTime(elapsed);
            }, 100);
        } catch (err) {
            console.error('Failed to start recording:', err);
            const error = err as Error;
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                alert('Microphone access was denied. Please allow microphone access in your browser and try again.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                alert('No microphone found. Please connect a microphone and try again.');
            } else {
                alert(`Could not access microphone: ${error.message}`);
            }
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [isRecording]);

    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
            pausedTimeRef.current = Date.now();
        }
    }, [isRecording, isPaused]);

    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume();
            const pauseDuration = Date.now() - pausedTimeRef.current;
            startTimeRef.current += pauseDuration;
            setIsPaused(false);
        }
    }, [isRecording, isPaused]);

    const discardRecording = useCallback(() => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    }, [audioUrl]);

    const handleSave = useCallback(() => {
        if (audioBlob) {
            onSave(audioBlob, recordingTime);
            discardRecording();
            setOpen(false);
        }
    }, [audioBlob, recordingTime, onSave, discardRecording]);

    const togglePlayback = useCallback(() => {
        if (!audioUrl) return;

        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            if (!audioRef.current) {
                audioRef.current = new Audio(audioUrl);
                audioRef.current.onended = () => setIsPlaying(false);
            }
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [audioUrl, isPlaying]);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Cleanup when closing
            if (isRecording) {
                stopRecording();
            }
            discardRecording();
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Mic className="size-4" />
                        Explain Task
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mic className="size-5" />
                        Explain Task
                    </DialogTitle>
                    <DialogDescription>
                        Record an audio explanation for this task. This helps provide context and details.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center py-8 space-y-6">
                    {/* Recording visualization */}
                    <div className="relative">
                        <div 
                            className={`size-32 rounded-full flex items-center justify-center transition-all ${
                                isRecording 
                                    ? isPaused 
                                        ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                                        : 'bg-red-100 dark:bg-red-900/30 animate-pulse'
                                    : audioBlob
                                        ? 'bg-green-100 dark:bg-green-900/30'
                                        : 'bg-muted'
                            }`}
                        >
                            {isRecording ? (
                                isPaused ? (
                                    <MicOff className="size-12 text-yellow-600" />
                                ) : (
                                    <Mic className="size-12 text-red-600 animate-pulse" />
                                )
                            ) : audioBlob ? (
                                <Volume2 className="size-12 text-green-600" />
                            ) : (
                                <Mic className="size-12 text-muted-foreground" />
                            )}
                        </div>
                        {isRecording && !isPaused && (
                            <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-20" />
                        )}
                    </div>

                    {/* Timer */}
                    <div className="text-3xl font-mono font-semibold tabular-nums">
                        {formatTime(recordingTime)}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3">
                        {!isRecording && !audioBlob && (
                            <Button 
                                size="lg" 
                                onClick={startRecording}
                                className="gap-2 px-8"
                            >
                                <Mic className="size-5" />
                                Start Recording
                            </Button>
                        )}

                        {isRecording && (
                            <>
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-12 rounded-full"
                                    onClick={isPaused ? resumeRecording : pauseRecording}
                                >
                                    {isPaused ? (
                                        <Play className="size-5" />
                                    ) : (
                                        <Pause className="size-5" />
                                    )}
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    size="icon"
                                    className="size-12 rounded-full"
                                    onClick={stopRecording}
                                >
                                    <Square className="size-5" />
                                </Button>
                            </>
                        )}

                        {audioBlob && !isRecording && (
                            <>
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-12 rounded-full"
                                    onClick={togglePlayback}
                                >
                                    {isPlaying ? (
                                        <Pause className="size-5" />
                                    ) : (
                                        <Play className="size-5" />
                                    )}
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    className="size-12 rounded-full text-destructive hover:text-destructive"
                                    onClick={discardRecording}
                                >
                                    <Trash2 className="size-5" />
                                </Button>
                                <Button 
                                    size="lg"
                                    onClick={handleSave}
                                    className="px-8"
                                >
                                    Save Recording
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Status text */}
                    <p className="text-sm text-muted-foreground">
                        {isRecording 
                            ? isPaused 
                                ? 'Recording paused' 
                                : 'Recording in progress...'
                            : audioBlob 
                                ? 'Recording complete. Play to review or save.'
                                : 'Click to start recording your explanation'
                        }
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
