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
        document_width: (auth.user as { document_width?: string }).document_width || 'normal',
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
                            <Label className="text-base font-medium">
                                Text Editor
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Select which editor to use for writing
                                descriptions and content
                            </p>
                            <RadioGroup
                                value={data.editor_preference}
                                onValueChange={(value: 'tiptap' | 'lexical') =>
                                    setData('editor_preference', value)
                                }
                                className="grid gap-4"
                            >
                                <div className="flex items-start space-x-3 rounded-lg border p-4">
                                    <RadioGroupItem
                                        value="tiptap"
                                        id="tiptap"
                                        className="mt-1"
                                    />
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="tiptap"
                                            className="cursor-pointer font-medium"
                                        >
                                            TipTap Editor
                                            <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                                Recommended
                                            </span>
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Modern editor with real-time
                                            collaboration support, floating
                                            menus, and a clean interface
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 rounded-lg border p-4">
                                    <RadioGroupItem
                                        value="lexical"
                                        id="lexical"
                                        className="mt-1"
                                    />
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="lexical"
                                            className="cursor-pointer font-medium"
                                        >
                                            Lexical Editor
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Lightweight editor by Meta with
                                            excellent performance and
                                            extensibility
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Document Width */}
                        <div className="space-y-4">
                            <Label className="text-base font-medium">
                                Document Width
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Choose the default width for document editing
                            </p>
                            <RadioGroup
                                value={data.document_width}
                                onValueChange={(value: 'narrow' | 'normal' | 'full') =>
                                    setData('document_width', value)
                                }
                                className="grid gap-4"
                            >
                                <div className="flex items-start space-x-3 rounded-lg border p-4">
                                    <RadioGroupItem
                                        value="narrow"
                                        id="narrow"
                                        className="mt-1"
                                    />
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="narrow"
                                            className="cursor-pointer font-medium"
                                        >
                                            Narrow
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Focused reading and writing experience (768px max)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 rounded-lg border p-4">
                                    <RadioGroupItem
                                        value="normal"
                                        id="normal"
                                        className="mt-1"
                                    />
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="normal"
                                            className="cursor-pointer font-medium"
                                        >
                                            Normal
                                            <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                                Default
                                            </span>
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Balanced view for most content (1024px max)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 rounded-lg border p-4">
                                    <RadioGroupItem
                                        value="full"
                                        id="full"
                                        className="mt-1"
                                    />
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="full"
                                            className="cursor-pointer font-medium"
                                        >
                                            Full Width
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Maximum width for tables and wide content
                                        </p>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Collaboration Toggle */}
                        <div className="space-y-4">
                            <Label className="text-base font-medium">
                                Real-time Collaboration
                            </Label>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="collaboration"
                                        className="cursor-pointer font-medium"
                                    >
                                        Enable collaboration features
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        See other users editing in real-time
                                        with live cursors, presence indicators,
                                        and comments
                                    </p>
                                </div>
                                <Switch
                                    id="collaboration"
                                    checked={data.collaboration_enabled}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'collaboration_enabled',
                                            checked,
                                        )
                                    }
                                />
                            </div>
                            {data.editor_preference === 'lexical' &&
                                data.collaboration_enabled && (
                                    <p className="text-sm text-amber-600 dark:text-amber-400">
                                        Note: Real-time collaboration is
                                        currently only available with the TipTap
                                        editor
                                    </p>
                                )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                Save preferences
                            </Button>
                            {recentlySuccessful && (
                                <p className="text-sm text-muted-foreground">
                                    Saved.
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
