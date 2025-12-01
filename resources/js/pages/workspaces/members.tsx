import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Workspace, type WorkspaceMember } from '@/types/workspace';
import { type WorkspaceInvitation } from '@/types/workspace-invitation';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Mail,
    MoreVertical,
    Shield,
    Trash2,
    UserPlus,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    workspace: Workspace;
    members: WorkspaceMember[];
    pendingInvitations: WorkspaceInvitation[];
    canManage: boolean;
}

export default function WorkspaceMembers({
    workspace,
    members,
    pendingInvitations,
    canManage,
}: Props) {
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [memberToRemove, setMemberToRemove] =
        useState<WorkspaceMember | null>(null);
    const [bulkMode, setBulkMode] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: workspace.name, href: `/workspaces/${workspace.id}/edit` },
        { title: 'Members', href: `/workspaces/${workspace.id}/members` },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        emails: '',
        role: 'member' as 'admin' | 'member' | 'viewer',
    });

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (bulkMode) {
            post(`/workspaces/${workspace.id}/invitations/bulk`, {
                onSuccess: () => {
                    reset();
                    setBulkMode(false);
                },
            });
        } else {
            post(`/workspaces/${workspace.id}/invitations`, {
                onSuccess: () => reset(),
            });
        }
    };

    const handleRemoveMember = () => {
        if (!memberToRemove) return;

        router.delete(
            `/workspaces/${workspace.id}/members/${memberToRemove.id}`,
            {
                onSuccess: () => {
                    setShowRemoveDialog(false);
                    setMemberToRemove(null);
                },
            },
        );
    };

    const handleChangeRole = (memberId: number, newRole: string) => {
        router.patch(`/workspaces/${workspace.id}/members/${memberId}/role`, {
            role: newRole,
        });
    };

    const handleResendInvitation = (invitationId: number) => {
        router.post(
            `/workspaces/${workspace.id}/invitations/${invitationId}/resend`,
        );
    };

    const handleCancelInvitation = (invitationId: number) => {
        router.delete(
            `/workspaces/${workspace.id}/invitations/${invitationId}`,
        );
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'owner':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
            case 'admin':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            case 'member':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'viewer':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        if (diffInDays < 365)
            return `${Math.floor(diffInDays / 30)} months ago`;
        return date.toLocaleDateString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${workspace.name} - Members`} />
            <div className="flex h-full flex-1 flex-col">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            asChild
                        >
                            <Link href={`/workspaces/${workspace.id}/edit`}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold">
                                Team Members
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Manage who has access to {workspace.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-4xl space-y-8 p-6">
                        {/* Invite Form */}
                        {canManage && (
                            <div className="rounded-lg border bg-muted/30 p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <UserPlus className="size-5 text-primary" />
                                        <h2 className="text-lg font-medium">
                                            Invite New Member
                                            {bulkMode ? 's' : ''}
                                        </h2>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setBulkMode(!bulkMode)}
                                    >
                                        {bulkMode
                                            ? 'Single Invite'
                                            : 'Bulk Invite'}
                                    </Button>
                                </div>
                                <form
                                    onSubmit={handleInvite}
                                    className="space-y-4"
                                >
                                    {bulkMode ? (
                                        <div>
                                            <Label htmlFor="emails">
                                                Email addresses (comma, space,
                                                or newline separated)
                                            </Label>
                                            <Textarea
                                                id="emails"
                                                placeholder="email1@example.com, email2@example.com
email3@example.com"
                                                value={data.emails}
                                                onChange={(e) =>
                                                    setData(
                                                        'emails',
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-32"
                                                required
                                            />
                                            {errors.emails && (
                                                <p className="mt-1 text-sm text-destructive">
                                                    {errors.emails}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <Label
                                                htmlFor="email"
                                                className="sr-only"
                                            >
                                                Email
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="email@example.com"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-destructive">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <div className="flex-1">
                                            <Label htmlFor="role">Role</Label>
                                            <Select
                                                value={data.role}
                                                onValueChange={(
                                                    value:
                                                        | 'admin'
                                                        | 'member'
                                                        | 'viewer',
                                                ) => setData('role', value)}
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">
                                                        Admin
                                                    </SelectItem>
                                                    <SelectItem value="member">
                                                        Member
                                                    </SelectItem>
                                                    <SelectItem value="viewer">
                                                        Viewer
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="sm:pt-6">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-11 w-full sm:w-auto"
                                            >
                                                <Mail className="mr-2 size-4" />
                                                {processing
                                                    ? 'Sending...'
                                                    : bulkMode
                                                      ? 'Send Invites'
                                                      : 'Send Invite'}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Current Members */}
                        <div>
                            <h2 className="mb-4 text-lg font-medium">
                                Members ({members.length})
                            </h2>
                            <div className="space-y-2">
                                {members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-4 rounded-lg border bg-background p-4"
                                    >
                                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                            {member.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium">
                                                {member.name}
                                            </p>
                                            <p className="truncate text-sm text-muted-foreground">
                                                {member.email}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {canManage &&
                                            member.pivot.role !== 'owner' ? (
                                                <Select
                                                    value={member.pivot.role}
                                                    onValueChange={(value) =>
                                                        handleChangeRole(
                                                            member.id,
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="h-8 w-28">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">
                                                            Admin
                                                        </SelectItem>
                                                        <SelectItem value="member">
                                                            Member
                                                        </SelectItem>
                                                        <SelectItem value="viewer">
                                                            Viewer
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(member.pivot.role)}`}
                                                >
                                                    {member.pivot.role ===
                                                        'owner' && (
                                                        <Shield className="mr-1 size-3" />
                                                    )}
                                                    {member.pivot.role
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        member.pivot.role.slice(
                                                            1,
                                                        )}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(
                                                    member.pivot.joined_at,
                                                )}
                                            </span>
                                            {canManage &&
                                                member.pivot.role !==
                                                    'owner' && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8"
                                                            >
                                                                <MoreVertical className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => {
                                                                    setMemberToRemove(
                                                                        member,
                                                                    );
                                                                    setShowRemoveDialog(
                                                                        true,
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2 className="mr-2 size-4" />
                                                                Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pending Invitations */}
                        {pendingInvitations.length > 0 && (
                            <div>
                                <h2 className="mb-4 text-lg font-medium">
                                    Pending Invitations (
                                    {pendingInvitations.length})
                                </h2>
                                <div className="space-y-2">
                                    {pendingInvitations.map((invitation) => (
                                        <div
                                            key={invitation.id}
                                            className="flex items-center gap-4 rounded-lg border border-dashed bg-muted/20 p-4"
                                        >
                                            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                                                <Mail className="size-5 text-muted-foreground" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium">
                                                    {invitation.email}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Invited by{' '}
                                                    {
                                                        invitation
                                                            .invited_by_user
                                                            ?.name
                                                    }{' '}
                                                    •{' '}
                                                    {formatDate(
                                                        invitation.created_at,
                                                    )}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(invitation.role)}`}
                                            >
                                                {invitation.role
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    invitation.role.slice(1)}
                                            </span>
                                            {canManage && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleResendInvitation(
                                                                invitation.id,
                                                            )
                                                        }
                                                    >
                                                        <Clock className="mr-1 size-3" />
                                                        Resend
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-destructive hover:text-destructive"
                                                        onClick={() =>
                                                            handleCancelInvitation(
                                                                invitation.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Remove Member Dialog */}
            <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove{' '}
                            <strong className="text-foreground">
                                {memberToRemove?.name}
                            </strong>{' '}
                            from this workspace? They will lose access to all
                            projects and tasks.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowRemoveDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleRemoveMember}
                        >
                            Remove Member
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
