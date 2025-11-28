import { createEcho, isReverbConfigured } from '@/lib/echo';
import type Echo from 'laravel-echo';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface EchoContextValue {
    echo: Echo<'reverb'> | null;
    isConnected: boolean;
}

const EchoContext = createContext<EchoContextValue>({ echo: null, isConnected: false });

interface EchoProviderProps {
    children: ReactNode;
    userId: number | null;
    enabled?: boolean;
}

export function EchoProvider({ children, userId, enabled = true }: EchoProviderProps) {
    const [echo, setEcho] = useState<Echo<'reverb'> | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId || !enabled || !isReverbConfigured()) {
            return;
        }

        const echoInstance = createEcho();

        // Track connection state
        echoInstance.connector.pusher.connection.bind('connected', () => {
            setIsConnected(true);
            console.log('[Echo] Connected to Reverb');
        });

        echoInstance.connector.pusher.connection.bind('disconnected', () => {
            setIsConnected(false);
            console.log('[Echo] Disconnected from Reverb');
        });

        echoInstance.connector.pusher.connection.bind('error', (error: unknown) => {
            console.error('[Echo] Connection error:', error);
        });

        setEcho(echoInstance);
        window.Echo = echoInstance;

        return () => {
            echoInstance.disconnect();
            setEcho(null);
            setIsConnected(false);
        };
    }, [userId, enabled]);

    return <EchoContext.Provider value={{ echo, isConnected }}>{children}</EchoContext.Provider>;
}

export function useEcho() {
    return useContext(EchoContext);
}
