import { ConvertToTaskDialog } from '@/components/convert-to-task-dialog';
import { PageHeader } from '@/components/page-header';
import { QuickThoughtCard } from '@/components/quick-thought-card';
import { QuickThoughtInput } from '@/components/quick-thought-input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type QuickThought } from '@/types/quick-thought';
import { Head } from '@inertiajs/react';
import { Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface Project {
    id: number;
    name: string;
    key: string;
}

interface Props {
    thoughts: QuickThought[];
    projects: Project[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Quick Thoughts', href: '/quick-thoughts' },
];

export default function QuickThoughtsIndex({ thoughts, projects }: Props) {
    const [convertingThought, setConvertingThought] =
        useState<QuickThought | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quick Thoughts" />

            <div className="flex h-full flex-1 flex-col">
                <PageHeader
                    title="Quick Thoughts"
                    description="Capture ideas quickly, convert them to tasks later"
                    icon={<Lightbulb className="size-5" />}
                />

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-2xl space-y-6">
                        {/* Input */}
                        <QuickThoughtInput autoFocus />

                        {/* Thoughts list */}
                        {thoughts.length === 0 ? (
                            <div className="py-12 text-center">
                                <Lightbulb className="mx-auto mb-4 size-12 text-muted-foreground/30" />
                                <h3 className="mb-1 text-lg font-medium text-muted-foreground">
                                    No thoughts yet
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Capture your first idea above - text, voice,
                                    or both!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    {thoughts.length} thought
                                    {thoughts.length !== 1 ? 's' : ''}
                                </h2>
                                {thoughts.map((thought) => (
                                    <QuickThoughtCard
                                        key={thought.id}
                                        thought={thought}
                                        onConvert={setConvertingThought}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Convert to Task Dialog */}
            <ConvertToTaskDialog
                thought={convertingThought}
                projects={projects}
                open={!!convertingThought}
                onOpenChange={(open) => !open && setConvertingThought(null)}
            />
        </AppLayout>
    );
}
