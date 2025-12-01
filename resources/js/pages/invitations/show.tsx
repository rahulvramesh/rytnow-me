import { Button } from '@/components/ui/button';
import { type WorkspaceInvitation } from '@/types/workspace-invitation';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, Check, Mail, Users, X } from 'lucide-react';

interface Props {
    invitation: WorkspaceInvitation;
    error?: string;
}

export default function InvitationShow({ invitation, error }: Props) {
    const handleAccept = () => {
        router.post(`/invitations/${invitation.token}/accept`);
    };

    const handleDecline = () => {
        if (
            confirm(
                'Are you sure you want to decline this invitation? This action cannot be undone.',
            )
        ) {
            router.post(`/invitations/${invitation.token}/decline`);
        }
    };

    const isExpiredOrUsed =
        invitation.status !== 'pending' || error !== undefined;

    const getExpiryText = () => {
        const expiresAt = new Date(invitation.expires_at);
        const now = new Date();
        const diffInDays = Math.ceil(
            (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffInDays < 0) return 'Expired';
        if (diffInDays === 0) return 'Expires today';
        if (diffInDays === 1) return 'Expires tomorrow';
        return `Expires in ${diffInDays} days`;
    };

    return (
        <>
            <Head title="Workspace Invitation" />
            <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
                <div className="w-full max-w-md">
                    {/* Logo/Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold">Trakx</h1>
                        <p className="mt-2 text-muted-foreground">
                            Team Workspace Invitation
                        </p>
                    </div>

                    {/* Invitation Card */}
                    <div className="rounded-lg border bg-background p-8 shadow-lg">
                        {error || isExpiredOrUsed ? (
                            // Error State
                            <div className="text-center">
                                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
                                    <AlertCircle className="size-8 text-destructive" />
                                </div>
                                <h2 className="mb-2 text-xl font-semibold">
                                    Invalid Invitation
                                </h2>
                                <p className="mb-6 text-muted-foreground">
                                    {error ||
                                        'This invitation has already been used or is no longer valid.'}
                                </p>
                                <Button asChild>
                                    <Link href="/login">Go to Login</Link>
                                </Button>
                            </div>
                        ) : (
                            // Valid Invitation
                            <>
                                {/* Workspace Info */}
                                <div className="mb-6 text-center">
                                    <div
                                        className="mx-auto mb-4 flex size-16 items-center justify-center rounded-lg text-2xl font-bold text-white"
                                        style={{
                                            backgroundColor:
                                                invitation.workspace?.color ||
                                                '#3b82f6',
                                        }}
                                    >
                                        {invitation.workspace?.name
                                            .charAt(0)
                                            .toUpperCase() || 'W'}
                                    </div>
                                    <h2 className="mb-2 text-2xl font-semibold">
                                        You're invited!
                                    </h2>
                                    <p className="text-muted-foreground">
                                        <strong>
                                            {invitation.invited_by_user?.name}
                                        </strong>{' '}
                                        has invited you to join
                                    </p>
                                    <p className="mt-1 text-lg font-medium">
                                        {invitation.workspace?.name}
                                    </p>
                                </div>

                                {/* Workspace Details */}
                                {invitation.workspace?.description && (
                                    <div className="mb-6 rounded-lg bg-muted/50 p-4">
                                        <p className="text-sm text-muted-foreground">
                                            {invitation.workspace.description}
                                        </p>
                                    </div>
                                )}

                                {/* Invitation Details */}
                                <div className="mb-6 space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="size-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            Invited as
                                        </span>
                                        <span className="font-medium">
                                            {invitation.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="size-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            Role
                                        </span>
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                            {invitation.role
                                                .charAt(0)
                                                .toUpperCase() +
                                                invitation.role.slice(1)}
                                        </span>
                                    </div>
                                    {invitation.workspace?.members_count !==
                                        undefined && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Users className="size-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Team size
                                            </span>
                                            <span className="font-medium">
                                                {
                                                    invitation.workspace
                                                        .members_count
                                                }{' '}
                                                member
                                                {invitation.workspace
                                                    .members_count !== 1
                                                    ? 's'
                                                    : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Expiry Warning */}
                                {new Date(invitation.expires_at).getTime() -
                                    new Date().getTime() <
                                    24 * 60 * 60 * 1000 && (
                                    <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-200">
                                        <AlertCircle className="mr-2 inline size-4" />
                                        {getExpiryText()}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="space-y-3">
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleAccept}
                                    >
                                        <Check className="mr-2 size-5" />
                                        Accept Invitation
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={handleDecline}
                                    >
                                        <X className="mr-2 size-4" />
                                        Decline
                                    </Button>
                                </div>

                                {/* Footer */}
                                <p className="mt-6 text-center text-xs text-muted-foreground">
                                    Don't have an account?{' '}
                                    <Link
                                        href="/register"
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Create one
                                    </Link>{' '}
                                    to accept this invitation
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
