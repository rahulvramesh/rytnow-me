import { EchoProvider } from '@/components/echo-provider';
import { KeyboardProvider } from '@/components/keyboard-provider';
import { QuickThoughtCaptureButton } from '@/components/quick-thought-capture-button';
import { useWorkspaceChannel } from '@/hooks/use-workspace-channel';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import {
    LIVEBLOCKS_AUTH_ENDPOINT,
    LiveblocksProvider,
} from '@/liveblocks.config';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

// User info type returned by API
interface UserInfo {
    id: string;
    name: string;
    email: string;
    avatar: string;
    color?: string;
}

// Inner component that uses workspace channel (must be inside EchoProvider)
function WorkspaceChannelSubscriber({
    workspaceId,
}: {
    workspaceId: number | undefined;
}) {
    useWorkspaceChannel(workspaceId);
    return null;
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { auth, currentWorkspace } = usePage<SharedData>().props;
    const user = auth?.user;

    return (
        <LiveblocksProvider
            authEndpoint={async (room) => {
                const response = await fetch(LIVEBLOCKS_AUTH_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-XSRF-TOKEN': decodeURIComponent(
                            document.cookie
                                .split('; ')
                                .find((row) => row.startsWith('XSRF-TOKEN='))
                                ?.split('=')[1] || '',
                        ),
                    },
                    credentials: 'include',
                    body: JSON.stringify({ room }),
                });

                if (!response.ok) {
                    throw new Error('Failed to authenticate with Liveblocks');
                }

                return response.json();
            }}
            resolveUsers={async ({ userIds }) => {
                try {
                    const response = await fetch(
                        `/api/users?ids=${userIds.join(',')}`,
                        {
                            headers: {
                                Accept: 'application/json',
                                'X-XSRF-TOKEN': decodeURIComponent(
                                    document.cookie
                                        .split('; ')
                                        .find((row) =>
                                            row.startsWith('XSRF-TOKEN='),
                                        )
                                        ?.split('=')[1] || '',
                                ),
                            },
                            credentials: 'include',
                        },
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }

                    const users: UserInfo[] = await response.json();
                    return users.map((u) => ({
                        name: u.name,
                        avatar: u.avatar,
                        color: u.color,
                    }));
                } catch {
                    // Fallback: return basic user info
                    return userIds.map((id) => ({
                        name:
                            id === user?.id?.toString()
                                ? user?.name
                                : `User ${id}`,
                        color: `hsl(${Math.abs(parseInt(id) * 137) % 360}, 70%, 50%)`,
                    }));
                }
            }}
            resolveMentionSuggestions={async ({ text }) => {
                try {
                    const response = await fetch(
                        `/api/users/search?q=${encodeURIComponent(text)}`,
                        {
                            headers: {
                                Accept: 'application/json',
                                'X-XSRF-TOKEN': decodeURIComponent(
                                    document.cookie
                                        .split('; ')
                                        .find((row) =>
                                            row.startsWith('XSRF-TOKEN='),
                                        )
                                        ?.split('=')[1] || '',
                                ),
                            },
                            credentials: 'include',
                        },
                    );

                    if (!response.ok) {
                        return [];
                    }

                    const users: UserInfo[] = await response.json();
                    return users.map((u) => u.id);
                } catch {
                    return [];
                }
            }}
        >
            <EchoProvider userId={user?.id ?? null}>
                <WorkspaceChannelSubscriber
                    workspaceId={currentWorkspace?.id}
                />
                <KeyboardProvider>
                    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                        {children}
                    </AppLayoutTemplate>
                    <QuickThoughtCaptureButton />
                </KeyboardProvider>
            </EchoProvider>
        </LiveblocksProvider>
    );
};
