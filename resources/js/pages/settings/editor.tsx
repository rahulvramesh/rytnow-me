import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { type BreadcrumbItem, type SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Editor settings',
        href: '/settings/editor',
    },
];

interface EditorPageProps {
    status?: string;
}

export default function Editor({ status }: EditorPageProps) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        editor_preference: auth.user.editor_preference || 'tiptap',
        collaboration_enabled: auth.user.collaboration_enabled ?? true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/settings/editor');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editor settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Editor settings"
                        description="Choose your preferred text editor and collaboration settings"
                    />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Editor Choice */}
                        <div className="space-y-4">
                            <Label className="text-base font-medium">Text Editor</Label>
                            <p className="text-sm text-muted-foreground">
                                Select which editor to use for writing descriptions and content
                            </p>
                            <RadioGroup
                                value={data.editor_preference}
                                onValueChange={(value: 'tiptap' | 'lexical') =>
                                    setData('editor_preference', value)
                                }
                                className="grid gap-4"
                            >
                                <div className="flex items-start space-x-3 rounded-lg border p-4">
                                    <RadioGroupItem value="tiptap" id="tiptap" className="mt-1" />
                                    <div className="space-y-1">
                                        <Label htmlFor="tiptap" className="font-medium cursor-pointer">
                                            TipTap Editor
                                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                                Recommended
                                            </span>
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Modern editor with real-time collaboration support, floating menus, and a clean interface
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 rounded-lg border p-4">
                                    <RadioGroupItem value="lexical" id="lexical" className="mt-1" />
                                    <div className="space-y-1">
                                        <Label htmlFor="lexical" className="font-medium cursor-pointer">
                                            Lexical Editor
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Lightweight editor by Meta with excellent performance and extensibility
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Collaboration Toggle */}
                        <div className="space-y-4">
                            <Label className="text-base font-medium">Real-time Collaboration</Label>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1">
                                    <Label htmlFor="collaboration" className="font-medium cursor-pointer">
                                        Enable collaboration features
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        See other users editing in real-time with live cursors, presence indicators, and comments
                                    </p>
                                </div>
                                <Switch
                                    id="collaboration"
                                    checked={data.collaboration_enabled}
                                    onCheckedChange={(checked) =>
                                        setData('collaboration_enabled', checked)
                                    }
                                />
                            </div>
                            {data.editor_preference === 'lexical' && data.collaboration_enabled && (
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    Note: Real-time collaboration is currently only available with the TipTap editor
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save preferences
                            </Button>
                            {recentlySuccessful && (
                                <p className="text-sm text-muted-foreground">Saved.</p>
                            )}
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
