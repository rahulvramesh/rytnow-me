import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { fetchHeaders } from '@/lib/csrf';
import type { User } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface MentionPickerProps {
    query: string;
    onSelect: (user: User) => void;
    onClose: () => void;
    position?: { top: number; left: number };
    workspaceId?: number;
}

export function MentionPicker({ query, onSelect, onClose, position, workspaceId }: MentionPickerProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch users based on query
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({ q: query });
                if (workspaceId) {
                    params.append('workspace_id', String(workspaceId));
                }
                const response = await fetch(`/api/users/search?${params.toString()}`, {
                    headers: fetchHeaders(),
                });
                if (response.ok) {
                    const data = await response.json();
                    // API returns array directly, not { users: [...] }
                    setUsers(Array.isArray(data) ? data : []);
                    setSelectedIndex(0);
                }
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchUsers, 150);
        return () => clearTimeout(debounceTimer);
    }, [query, workspaceId]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % users.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + users.length) % users.length);
            } else if (e.key === 'Enter' && users.length > 0) {
                e.preventDefault();
                onSelect(users[selectedIndex]);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [users, selectedIndex, onSelect, onClose]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (users.length === 0 && !isLoading) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className="absolute z-50 w-64 overflow-hidden rounded-lg border bg-popover shadow-lg"
            style={position ? { top: position.top, left: position.left, position: 'fixed' } : undefined}
        >
            <div className="p-1">
                {isLoading ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>
                ) : (
                    users.map((user, index) => {
                        const initials = user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2);

                        return (
                            <button
                                key={user.id}
                                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                                    index === selectedIndex
                                        ? 'bg-accent text-accent-foreground'
                                        : 'hover:bg-accent/50'
                                }`}
                                onClick={() => onSelect(user)}
                            >
                                <Avatar className="size-6">
                                    <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 truncate">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
