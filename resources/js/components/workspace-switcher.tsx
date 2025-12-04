import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { type SharedData } from '@/types';
import { type Workspace } from '@/types/workspace';
import { Link, router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, Home, Plus, Settings, Users } from 'lucide-react';

export function WorkspaceSwitcher() {
    const { currentWorkspace, workspaces } = usePage<SharedData>().props;

    const handleSwitch = (workspace: Workspace) => {
        if (workspace.id === currentWorkspace?.id) return;

        router.post(
            `/workspaces/${workspace.id}/switch`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    if (!currentWorkspace) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div
                        className="flex aspect-square size-8 items-center justify-center rounded-lg font-semibold text-white"
                        style={{ backgroundColor: currentWorkspace.color }}
                    >
                        {currentWorkspace.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            {currentWorkspace.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {currentWorkspace.projects_count ?? 0} project
                            {(currentWorkspace.projects_count ?? 0) !== 1
                                ? 's'
                                : ''}{' '}
                            · {currentWorkspace.members_count ?? 0} member
                            {(currentWorkspace.members_count ?? 0) !== 1
                                ? 's'
                                : ''}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                align="start"
                side="bottom"
                sideOffset={4}
            >
                {/* My Hub - Cross-workspace view */}
                <DropdownMenuItem asChild className="gap-2 p-2">
                    <Link href="/hub" className="flex items-center">
                        <div className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                            <Home className="size-3.5" />
                        </div>
                        <div className="flex-1">
                            <span className="font-medium">My Hub</span>
                            <p className="text-[10px] text-muted-foreground">
                                All workspaces
                            </p>
                        </div>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Workspaces
                </DropdownMenuLabel>
                {workspaces.map((workspace) => (
                    <DropdownMenuItem
                        key={workspace.id}
                        onClick={() => handleSwitch(workspace)}
                        className="cursor-pointer gap-2 p-2"
                    >
                        <div
                            className="flex size-6 items-center justify-center rounded-md text-xs font-semibold text-white"
                            style={{ backgroundColor: workspace.color }}
                        >
                            {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="flex-1 truncate">
                            {workspace.name}
                        </span>
                        {workspace.id === currentWorkspace.id && (
                            <Check className="size-4" />
                        )}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="gap-2 p-2">
                    <Link href={`/workspaces/${currentWorkspace.id}/edit`}>
                        <Settings className="size-4" />
                        <span>Workspace settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 p-2">
                    <Link href={`/workspaces/${currentWorkspace.id}/members`}>
                        <Users className="size-4" />
                        <span>Members</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 p-2">
                    <Link href="/workspaces/create">
                        <Plus className="size-4" />
                        <span>Create workspace</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
