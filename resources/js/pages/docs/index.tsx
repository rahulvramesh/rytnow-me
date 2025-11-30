import { DocsSidebar } from '@/components/docs-sidebar';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { DocFolder, DocumentSummary } from '@/types/document';
import type { Project } from '@/types/project';
import { Head, router } from '@inertiajs/react';
import { File, Plus } from 'lucide-react';

interface Props {
    project: Project;
    folders: DocFolder[];
    rootDocuments: DocumentSummary[];
}

export default function DocsIndex({ project, folders, rootDocuments }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Docs', href: `/projects/${project.id}/docs` },
    ];

    const handleCreateDocument = () => {
        router.post(`/projects/${project.id}/docs`, {
            title: 'Untitled Document',
        });
    };

    const totalDocs =
        rootDocuments.length +
        folders.reduce((acc, f) => acc + (f.documents?.length || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Docs - ${project.name}`} />
            <div className="flex h-full flex-1">
                <DocsSidebar
                    projectId={project.id}
                    folders={folders}
                    rootDocuments={rootDocuments}
                />
                <div className="flex flex-1 items-center justify-center p-8">
                    <div className="max-w-md text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                            <File className="size-8 text-muted-foreground" />
                        </div>
                        <h2 className="mb-2 text-xl font-semibold">
                            Project Documentation
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            {totalDocs === 0
                                ? 'Create your first document to get started with project documentation.'
                                : `You have ${totalDocs} document${totalDocs === 1 ? '' : 's'}. Select one from the sidebar or create a new one.`}
                        </p>
                        <Button onClick={handleCreateDocument}>
                            <Plus className="mr-2 size-4" />
                            New Document
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
