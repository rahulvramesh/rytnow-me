import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Mic, Square, Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

interface AudioRecorderProps {
    projectId: number;
    taskId: number;
}

export function AudioRecorder({ projectId, taskId }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
            });

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
            alert('Could not access microphone. Please check permissions.');
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

    const uploadRecording = useCallback(() => {
        if (!audioBlob) return;

        setIsUploading(true);

        const formData = new FormData();
        const extension = audioBlob.type.includes('webm') ? 'webm' : 'm4a';
        formData.append('audio', audioBlob, `recording-${Date.now()}.${extension}`);
        formData.append('duration', String(recordingTime));

        router.post(`/projects/${projectId}/tasks/${taskId}/recordings`, formData, {
            preserveScroll: true,
            onSuccess: () => {
                setAudioBlob(null);
                setRecordingTime(0);
                setIsUploading(false);
            },
            onError: () => {
                setIsUploading(false);
                alert('Failed to upload recording');
            },
        });
    }, [audioBlob, projectId, taskId, recordingTime]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const discardRecording = () => {
        setAudioBlob(null);
        setRecordingTime(0);
    };

    return (
        <div className="flex items-center gap-2">
            {!isRecording && !audioBlob && (
                <Button variant="outline" size="sm" onClick={startRecording} className="gap-1">
                    <Mic className="size-4" />
                    Record
                </Button>
            )}

            {isRecording && (
                <>
                    <span className="flex items-center gap-2 text-sm font-medium text-red-600">
                        <span className="size-2 animate-pulse rounded-full bg-red-600" />
                        {formatTime(recordingTime)}
                    </span>
                    <Button variant="destructive" size="sm" onClick={stopRecording} className="gap-1">
                        <Square className="size-3" />
                        Stop
                    </Button>
                </>
            )}

            {audioBlob && !isRecording && (
                <>
                    <audio src={URL.createObjectURL(audioBlob)} controls className="h-8 max-w-[200px]" />
                    <Button
                        variant="default"
                        size="sm"
                        onClick={uploadRecording}
                        disabled={isUploading}
                        className="gap-1"
                    >
                        <Upload className="size-4" />
                        {isUploading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={discardRecording} disabled={isUploading}>
                        Discard
                    </Button>
                </>
            )}
        </div>
    );
}
