import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Copy, Key, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface Token {
    id: number;
    name: string;
    last_used_at: string | null;
    created_at: string;
}

interface PageProps {
    tokens: Token[];
    flash?: {
        newToken?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'API Tokens',
        href: '/settings/api-tokens',
    },
];

export default function ApiTokens({ tokens }: PageProps) {
    const { props } = usePage<{ flash?: { newToken?: string } }>();
    const [showNewTokenModal, setShowNewTokenModal] = useState(false);
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [newToken, setNewToken] = useState<string | null>(null);
    const [tokenToDelete, setTokenToDelete] = useState<Token | null>(null);
    const [copied, setCopied] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
    });

    // Check if there's a new token in flash data
    const flashToken = props.flash?.newToken;
    if (flashToken && !newToken) {
        setNewToken(flashToken);
        setShowTokenModal(true);
    }

    const handleCreateToken = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/api-tokens', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowNewTokenModal(false);
            },
        });
    };

    const handleDeleteToken = () => {
        if (!tokenToDelete) return;

        router.delete(`/settings/api-tokens/${tokenToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setTokenToDelete(null);
            },
        });
    };

    const copyToClipboard = async () => {
        if (newToken) {
            await navigator.clipboard.writeText(newToken);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="API Tokens" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="API Tokens"
                        description="Manage your personal access tokens for API authentication"
                    />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                API tokens allow external applications to
                                authenticate with the API on your behalf.
                            </p>
                            <Button
                                onClick={() => setShowNewTokenModal(true)}
                                size="sm"
                            >
                                <Plus className="mr-2 size-4" />
                                Create Token
                            </Button>
                        </div>

                        {tokens.length === 0 ? (
                            <div className="rounded-lg border p-8 text-center">
                                <Key className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground">
                                    No API tokens yet
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Create a token to get started with the API
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y rounded-lg border">
                                {tokens.map((token) => (
                                    <div
                                        key={token.id}
                                        className="flex items-center justify-between p-4"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-medium">
                                                {token.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Created{' '}
                                                {formatDate(token.created_at)}
                                                {token.last_used_at && (
                                                    <>
                                                        {' '}
                                                        · Last used{' '}
                                                        {formatDate(
                                                            token.last_used_at,
                                                        )}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setTokenToDelete(token)
                                            }
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <h4 className="mb-2 text-sm font-medium">
                                API Usage
                            </h4>
                            <div className="rounded-lg bg-muted p-4">
                                <p className="mb-2 text-sm text-muted-foreground">
                                    Include your token in the Authorization
                                    header:
                                </p>
                                <code className="block overflow-x-auto rounded bg-background px-2 py-1 text-xs">
                                    Authorization: Bearer YOUR_TOKEN
                                </code>
                                <p className="mt-3 mb-2 text-sm text-muted-foreground">
                                    Example request:
                                </p>
                                <code className="block overflow-x-auto rounded bg-background px-2 py-1 text-xs whitespace-pre">
                                    {`curl -H "Authorization: Bearer YOUR_TOKEN" \\
     https://your-domain.com/api/v1/workspaces`}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsLayout>

            {/* Create Token Modal */}
            <Dialog
                open={showNewTokenModal}
                onOpenChange={setShowNewTokenModal}
            >
                <DialogContent>
                    <form onSubmit={handleCreateToken}>
                        <DialogHeader>
                            <DialogTitle>Create API Token</DialogTitle>
                            <DialogDescription>
                                Give your token a descriptive name to identify
                                its purpose.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="token-name">Token Name</Label>
                            <Input
                                id="token-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                placeholder="e.g., CLI Tool, Integration"
                                className="mt-2"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowNewTokenModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.name}
                            >
                                Create Token
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Display New Token Modal */}
            <Dialog
                open={showTokenModal}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowTokenModal(false);
                        setNewToken(null);
                        setCopied(false);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Token Created</DialogTitle>
                        <DialogDescription>
                            Make sure to copy your token now. You won't be able
                            to see it again.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex items-center gap-2">
                            <Input
                                value={newToken || ''}
                                readOnly
                                className="font-mono text-sm"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={copyToClipboard}
                            >
                                <Copy className="size-4" />
                            </Button>
                        </div>
                        {copied && (
                            <p className="mt-2 text-sm text-green-600">
                                Copied to clipboard!
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                setShowTokenModal(false);
                                setNewToken(null);
                                setCopied(false);
                            }}
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Token Confirmation */}
            <AlertDialog
                open={!!tokenToDelete}
                onOpenChange={(open) => !open && setTokenToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Token</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the token "
                            {tokenToDelete?.name}"? Any applications using this
                            token will no longer be able to access the API.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteToken}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Token
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
