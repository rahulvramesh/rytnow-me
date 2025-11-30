import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import {
    Bot,
    Check,
    ChevronDown,
    Loader2,
    MoreVertical,
    Pencil,
    Plus,
    RefreshCw,
    Star,
    Trash2,
    Wifi,
    WifiOff,
} from 'lucide-react';
import { fetchHeaders } from '@/lib/csrf';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

interface Provider {
    id: number;
    name: string;
    provider: string;
    base_url: string;
    default_model: string | null;
    is_active: boolean;
    is_default: boolean;
    has_api_key: boolean;
    last_used_at: string | null;
    created_at: string;
}

interface PageProps {
    providers: Provider[];
}

const PROVIDER_PRESETS = [
    { value: 'openai', label: 'OpenAI', baseUrl: 'https://api.openai.com' },
    { value: 'anthropic', label: 'Anthropic', baseUrl: 'https://api.anthropic.com' },
    { value: 'groq', label: 'Groq', baseUrl: 'https://api.groq.com/openai' },
    { value: 'together', label: 'Together AI', baseUrl: 'https://api.together.xyz' },
    { value: 'openrouter', label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api' },
    { value: 'ollama', label: 'Ollama (Local)', baseUrl: 'http://localhost:11434' },
    { value: 'lmstudio', label: 'LM Studio (Local)', baseUrl: 'http://localhost:1234' },
    { value: 'custom', label: 'Custom Endpoint', baseUrl: '' },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'LLM Providers',
        href: '/settings/llm-providers',
    },
];

export default function LlmProviders({ providers }: PageProps) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
    const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);
    const [testingProvider, setTestingProvider] = useState<number | null>(null);
    const [testResult, setTestResult] = useState<{ id: number; success: boolean; message: string } | null>(null);
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [fetchingModels, setFetchingModels] = useState(false);
    const [modelsError, setModelsError] = useState<string | null>(null);

    const { data, setData, post, patch, processing, reset, errors } = useForm({
        name: '',
        provider: 'openai',
        base_url: 'https://api.openai.com',
        api_key: '',
        default_model: '',
        is_default: false,
    });

    const handleProviderChange = (value: string) => {
        const preset = PROVIDER_PRESETS.find((p) => p.value === value);
        setData({
            ...data,
            provider: value,
            base_url: preset?.baseUrl || data.base_url,
            default_model: '',
        });
        setAvailableModels([]);
        setModelsError(null);
    };

    const fetchModelsFromEndpoint = useCallback(async () => {
        if (!data.base_url) return;

        setFetchingModels(true);
        setModelsError(null);

        try {
            const response = await fetch('/settings/llm-providers/fetch-models', {
                method: 'POST',
                headers: fetchHeaders(),
                body: JSON.stringify({
                    base_url: data.base_url,
                    api_key: data.api_key || null,
                }),
            });

            const result = await response.json();

            if (result.success && result.models?.length > 0) {
                setAvailableModels(result.models);
                // Auto-select first model if none selected
                if (!data.default_model) {
                    setData('default_model', result.models[0]);
                }
            } else {
                setModelsError(result.message || 'No models found');
                setAvailableModels([]);
            }
        } catch {
            setModelsError('Failed to fetch models');
            setAvailableModels([]);
        } finally {
            setFetchingModels(false);
        }
    }, [data.base_url, data.api_key, data.default_model, setData]);

    const fetchModelsForProvider = useCallback(async (providerId: number) => {
        setFetchingModels(true);
        setModelsError(null);

        try {
            const response = await fetch(`/settings/llm-providers/${providerId}/models`, {
                headers: fetchHeaders(),
            });

            const result = await response.json();

            if (result.success && result.models?.length > 0) {
                setAvailableModels(result.models);
            } else {
                setModelsError(result.message || 'No models found');
                setAvailableModels([]);
            }
        } catch {
            setModelsError('Failed to fetch models');
            setAvailableModels([]);
        } finally {
            setFetchingModels(false);
        }
    }, []);

    const handleAddProvider = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/llm-providers', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setAvailableModels([]);
                setModelsError(null);
                setShowAddModal(false);
            },
        });
    };

    const closeAddModal = () => {
        reset();
        setAvailableModels([]);
        setModelsError(null);
        setShowAddModal(false);
    };

    const handleEditProvider = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProvider) return;

        patch(`/settings/llm-providers/${editingProvider.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setAvailableModels([]);
                setModelsError(null);
                setEditingProvider(null);
            },
        });
    };

    const closeEditModal = () => {
        reset();
        setAvailableModels([]);
        setModelsError(null);
        setEditingProvider(null);
    };

    const handleDeleteProvider = () => {
        if (!providerToDelete) return;

        router.delete(`/settings/llm-providers/${providerToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setProviderToDelete(null);
            },
        });
    };

    const handleSetDefault = (provider: Provider) => {
        router.post(`/settings/llm-providers/${provider.id}/default`, {}, {
            preserveScroll: true,
        });
    };

    const handleToggleActive = (provider: Provider) => {
        router.patch(`/settings/llm-providers/${provider.id}`, {
            is_active: !provider.is_active,
        }, {
            preserveScroll: true,
        });
    };

    const handleTestConnection = async (provider: Provider) => {
        setTestingProvider(provider.id);
        setTestResult(null);

        try {
            const response = await fetch(`/settings/llm-providers/${provider.id}/test`, {
                method: 'POST',
                headers: fetchHeaders(),
            });

            const result = await response.json();
            setTestResult({
                id: provider.id,
                success: result.success,
                message: result.message,
            });
        } catch {
            setTestResult({
                id: provider.id,
                success: false,
                message: 'Failed to test connection',
            });
        } finally {
            setTestingProvider(null);
        }
    };

    const openEditModal = (provider: Provider) => {
        setData({
            name: provider.name,
            provider: provider.provider,
            base_url: provider.base_url,
            api_key: '', // Don't populate existing key
            default_model: provider.default_model || '',
            is_default: provider.is_default,
        });
        setAvailableModels([]);
        setModelsError(null);
        setEditingProvider(provider);
        // Fetch models for existing provider
        fetchModelsForProvider(provider.id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="LLM Providers" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="LLM Providers"
                        description="Configure AI language model providers for intelligent features"
                    />

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                Connect OpenAI-compatible LLM endpoints to enable AI-powered features.
                            </p>
                            <Button onClick={() => setShowAddModal(true)} size="sm">
                                <Plus className="size-4 mr-2" />
                                Add Provider
                            </Button>
                        </div>

                        {providers.length === 0 ? (
                            <div className="border rounded-lg p-8 text-center">
                                <Bot className="size-12 mx-auto text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground">No LLM providers configured</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Add a provider to enable AI features
                                </p>
                            </div>
                        ) : (
                            <div className="border rounded-lg divide-y">
                                {providers.map((provider) => (
                                    <div
                                        key={provider.id}
                                        className="flex items-center justify-between p-4"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`size-10 rounded-lg flex items-center justify-center ${
                                                provider.is_active ? 'bg-primary/10' : 'bg-muted'
                                            }`}>
                                                <Bot className={`size-5 ${
                                                    provider.is_active ? 'text-primary' : 'text-muted-foreground'
                                                }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium truncate">{provider.name}</p>
                                                    {provider.is_default && (
                                                        <Badge variant="secondary" className="shrink-0">
                                                            <Star className="size-3 mr-1" />
                                                            Default
                                                        </Badge>
                                                    )}
                                                    {!provider.is_active && (
                                                        <Badge variant="outline" className="shrink-0 text-muted-foreground">
                                                            Disabled
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {provider.base_url}
                                                    {provider.default_model && (
                                                        <span className="ml-2">· {provider.default_model}</span>
                                                    )}
                                                </p>
                                                {testResult?.id === provider.id && (
                                                    <p className={`text-sm mt-1 ${
                                                        testResult.success ? 'text-green-600' : 'text-destructive'
                                                    }`}>
                                                        {testResult.success ? (
                                                            <Check className="size-3 inline mr-1" />
                                                        ) : (
                                                            <WifiOff className="size-3 inline mr-1" />
                                                        )}
                                                        {testResult.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleTestConnection(provider)}
                                                disabled={testingProvider === provider.id}
                                            >
                                                {testingProvider === provider.id ? (
                                                    <Loader2 className="size-4 animate-spin" />
                                                ) : (
                                                    <Wifi className="size-4" />
                                                )}
                                                <span className="ml-1 hidden sm:inline">Test</span>
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditModal(provider)}>
                                                        <Pencil className="size-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {!provider.is_default && (
                                                        <DropdownMenuItem onClick={() => handleSetDefault(provider)}>
                                                            <Star className="size-4 mr-2" />
                                                            Set as Default
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem onClick={() => handleToggleActive(provider)}>
                                                        {provider.is_active ? (
                                                            <>
                                                                <WifiOff className="size-4 mr-2" />
                                                                Disable
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Wifi className="size-4 mr-2" />
                                                                Enable
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => setProviderToDelete(provider)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="size-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Supported Providers</h4>
                            <div className="bg-muted rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-3">
                                    Any OpenAI-compatible API endpoint is supported, including:
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {PROVIDER_PRESETS.filter(p => p.value !== 'custom').map((preset) => (
                                        <div key={preset.value} className="flex items-center gap-2">
                                            <Bot className="size-4 text-muted-foreground" />
                                            <span>{preset.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsLayout>

            {/* Add Provider Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleAddProvider}>
                        <DialogHeader>
                            <DialogTitle>Add LLM Provider</DialogTitle>
                            <DialogDescription>
                                Configure a new AI language model endpoint.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="provider">Provider</Label>
                                <Select value={data.provider} onValueChange={handleProviderChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROVIDER_PRESETS.map((preset) => (
                                            <SelectItem key={preset.value} value={preset.value}>
                                                {preset.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., My OpenAI, Local Ollama"
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="base_url">Base URL</Label>
                                <Input
                                    id="base_url"
                                    value={data.base_url}
                                    onChange={(e) => setData('base_url', e.target.value)}
                                    placeholder="https://api.openai.com"
                                />
                                {errors.base_url && (
                                    <p className="text-sm text-destructive">{errors.base_url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="api_key">API Key</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="api_key"
                                        type="password"
                                        value={data.api_key}
                                        onChange={(e) => setData('api_key', e.target.value)}
                                        placeholder="sk-..."
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={fetchModelsFromEndpoint}
                                        disabled={fetchingModels || !data.base_url}
                                        title="Fetch available models"
                                    >
                                        {fetchingModels ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="size-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Enter API key and click refresh to fetch available models.
                                </p>
                                {errors.api_key && (
                                    <p className="text-sm text-destructive">{errors.api_key}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="default_model">Default Model</Label>
                                {availableModels.length > 0 ? (
                                    <Select value={data.default_model} onValueChange={(v) => setData('default_model', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableModels.map((model) => (
                                                <SelectItem key={model} value={model}>
                                                    {model}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        id="default_model"
                                        value={data.default_model}
                                        onChange={(e) => setData('default_model', e.target.value)}
                                        placeholder="e.g., gpt-4, llama2"
                                    />
                                )}
                                {modelsError && (
                                    <p className="text-xs text-amber-600">{modelsError}</p>
                                )}
                                {errors.default_model && (
                                    <p className="text-sm text-destructive">{errors.default_model}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="is_default">Set as default provider</Label>
                                <Switch
                                    id="is_default"
                                    checked={data.is_default}
                                    onCheckedChange={(checked) => setData('is_default', checked)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeAddModal}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing || !data.name || !data.base_url}>
                                Add Provider
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Provider Modal */}
            <Dialog open={!!editingProvider} onOpenChange={(open) => {
                if (!open) closeEditModal();
            }}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleEditProvider}>
                        <DialogHeader>
                            <DialogTitle>Edit LLM Provider</DialogTitle>
                            <DialogDescription>
                                Update provider configuration.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-provider">Provider</Label>
                                <Select value={data.provider} onValueChange={handleProviderChange}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROVIDER_PRESETS.map((preset) => (
                                            <SelectItem key={preset.value} value={preset.value}>
                                                {preset.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Display Name</Label>
                                <Input
                                    id="edit-name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-base_url">Base URL</Label>
                                <Input
                                    id="edit-base_url"
                                    value={data.base_url}
                                    onChange={(e) => setData('base_url', e.target.value)}
                                />
                                {errors.base_url && (
                                    <p className="text-sm text-destructive">{errors.base_url}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-api_key">API Key</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="edit-api_key"
                                        type="password"
                                        value={data.api_key}
                                        onChange={(e) => setData('api_key', e.target.value)}
                                        placeholder={editingProvider?.has_api_key ? '••••••••' : 'Enter API key'}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => editingProvider && fetchModelsForProvider(editingProvider.id)}
                                        disabled={fetchingModels}
                                        title="Refresh available models"
                                    >
                                        {fetchingModels ? (
                                            <Loader2 className="size-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="size-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {editingProvider?.has_api_key
                                        ? 'Leave empty to keep existing key, or enter a new one to update.'
                                        : 'Enter API key for authentication.'}
                                </p>
                                {errors.api_key && (
                                    <p className="text-sm text-destructive">{errors.api_key}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-default_model">Default Model</Label>
                                {availableModels.length > 0 ? (
                                    <Select value={data.default_model} onValueChange={(v) => setData('default_model', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableModels.map((model) => (
                                                <SelectItem key={model} value={model}>
                                                    {model}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        id="edit-default_model"
                                        value={data.default_model}
                                        onChange={(e) => setData('default_model', e.target.value)}
                                        placeholder="e.g., gpt-4, llama2"
                                    />
                                )}
                                {fetchingModels && (
                                    <p className="text-xs text-muted-foreground">Loading models...</p>
                                )}
                                {modelsError && !fetchingModels && (
                                    <p className="text-xs text-amber-600">{modelsError}</p>
                                )}
                                {errors.default_model && (
                                    <p className="text-sm text-destructive">{errors.default_model}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="edit-is_default">Set as default provider</Label>
                                <Switch
                                    id="edit-is_default"
                                    checked={data.is_default}
                                    onCheckedChange={(checked) => setData('is_default', checked)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeEditModal}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing || !data.name || !data.base_url}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!providerToDelete} onOpenChange={(open) => !open && setProviderToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Provider</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{providerToDelete?.name}"?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProvider}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Provider
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
