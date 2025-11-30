import { DocListItem } from '@/components/doc-list-item';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type DocProject, type Document } from '@/types/document';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    FileText,
    FolderKanban,
    LayoutList,
    List,
    Search,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type ViewMode = 'flat' | 'grouped';

interface Props {
    documents: Document[];
    projects: DocProject[];
}

export default function WorkspaceDocsIndex({ documents, projects }: Props) {
    const { currentWorkspace } = usePage<SharedData>().props;
    const [search, setSearch] = useState('');
    const [projectFilter, setProjectFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('flat');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Documents', href: '/docs' },
    ];

    const filteredDocuments = useMemo(() => {
        return documents.filter((doc) => {
            const matchesSearch =
                !search ||
                doc.title.toLowerCase().includes(search.toLowerCase());

            const matchesProject =
                projectFilter === 'all' ||
                doc.project_id.toString() === projectFilter;

            return matchesSearch && matchesProject;
        });
    }, [documents, search, projectFilter]);

    const documentsByProject = useMemo(() => {
        const grouped: Record<
            number,
            { project: DocProject; documents: Document[] }
        > = {};
        filteredDocuments.forEach((doc) => {
            if (!grouped[doc.project_id]) {
                grouped[doc.project_id] = {
                    project: doc.project || {
                        id: doc.project_id,
                        name: 'Unknown',
                        status: 'active',
                    },
                    documents: [],
                };
            }
            grouped[doc.project_id].documents.push(doc);
        });
        return Object.values(grouped);
    }, [filteredDocuments]);

    const hasFilters = search || projectFilter !== 'all';

    const clearFilters = () => {
        setSearch('');
        setProjectFilter('all');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documents" />
            <div className="flex h-full flex-1 flex-col">
                <PageHeader
                    title="All Documents"
                    description={`View all documents across projects in ${currentWorkspace?.name || 'your workspace'}`}
                    icon={<FileText className="size-5" />}
                >
                    <div className="text-right">
                        <p className="text-2xl font-bold tabular-nums">
                            {documents.length}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            total documents
                        </p>
                    </div>
                </PageHeader>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 sm:gap-3 sm:px-6">
                    {/* View switcher */}
                    <div className="order-first flex items-center rounded-lg border p-0.5 sm:order-none">
                        <Button
                            variant={
                                viewMode === 'flat' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('flat')}
                            title="List view"
                        >
                            <List className="size-4" />
                        </Button>
                        <Button
                            variant={
                                viewMode === 'grouped' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('grouped')}
                            title="Group by project"
                        >
                            <LayoutList className="size-4" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative order-1 max-w-xs min-w-[120px] flex-1 sm:order-none">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 pl-9"
                        />
                    </div>

                    {/* Project filter */}
                    <Select
                        value={projectFilter}
                        onValueChange={setProjectFilter}
                    >
                        <SelectTrigger className="hidden h-9 w-[150px] sm:flex">
                            <SelectValue placeholder="Project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All projects</SelectItem>
                            {projects.map((project) => (
                                <SelectItem
                                    key={project.id}
                                    value={project.id.toString()}
                                >
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Clear filters */}
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                        >
                            <X className="mr-1 size-4" />
                            Clear
                        </Button>
                    )}

                    <div className="hidden flex-1 sm:block" />
                    <span className="hidden text-sm text-muted-foreground tabular-nums sm:inline">
                        {filteredDocuments.length} document
                        {filteredDocuments.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Content */}
                {filteredDocuments.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center">
                            <FileText className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                            <h3 className="mb-1 text-lg font-medium">
                                No documents found
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {hasFilters
                                    ? 'Try adjusting your filters'
                                    : 'Create a document from one of your projects'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Flat List View */}
                        {viewMode === 'flat' && (
                            <div className="flex-1 overflow-y-auto p-3">
                                <div className="space-y-1.5">
                                    {filteredDocuments.map((doc) => (
                                        <DocListItem
                                            key={doc.id}
                                            document={doc}
                                            showProject
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Grouped by Project View */}
                        {viewMode === 'grouped' && (
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="mx-auto max-w-4xl space-y-8">
                                    {documentsByProject.map(
                                        ({
                                            project,
                                            documents: projectDocs,
                                        }) => (
                                            <div key={project.id}>
                                                <div className="mb-3 flex items-center gap-2">
                                                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                                                        <FolderKanban className="size-4 text-primary" />
                                                    </div>
                                                    <Link
                                                        href={`/projects/${project.id}/docs`}
                                                        className="font-medium transition-colors hover:text-primary"
                                                    >
                                                        {project.name}
                                                    </Link>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {projectDocs.length} doc
                                                        {projectDocs.length !==
                                                        1
                                                            ? 's'
                                                            : ''}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1.5 pl-10">
                                                    {projectDocs.map((doc) => (
                                                        <DocListItem
                                                            key={doc.id}
                                                            document={doc}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
