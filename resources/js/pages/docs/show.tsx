import { DocsSidebar } from '@/components/docs-sidebar';
import { DocumentEditor } from '@/components/document-editor';
import { Input } from '@/components/ui/input';
import { fetchHeaders } from '@/lib/csrf';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { DocFolder, Document, DocumentSummary } from '@/types/document';
import type { Project } from '@/types/project';
import { Head, router } from '@inertiajs/react';
import { Check, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
    project: Project;
    document: Document;
    folders: DocFolder[];
    rootDocuments: DocumentSummary[];
}

export default function DocShow({ project, document: doc, folders, rootDocuments }: Props) {
    const [title, setTitle] = useState(doc.title);
    const [content, setContent] = useState(doc.content || '');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingSaveRef = useRef<{ title: string; content: string } | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: project.name, href: `/projects/${project.id}` },
        { title: 'Docs', href: `/projects/${project.id}/docs` },
        { title: doc.title, href: `/projects/${project.id}/docs/${doc.id}` },
    ];

    // Save function
    const save = useCallback(async (titleToSave: string, contentToSave: string) => {
        setIsSaving(true);
        try {
            const response = await fetch(`/projects/${project.id}/docs/${doc.id}`, {
                method: 'PUT',
                headers: fetchHeaders(),
                body: JSON.stringify({
                    title: titleToSave,
                    content: contentToSave,
                }),
            });

            if (response.ok) {
                setLastSaved(new Date());
            }
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    }, [project.id, doc.id]);

    // Debounced auto-save
    const debouncedSave = useCallback((newTitle: string, newContent: string) => {
        pendingSaveRef.current = { title: newTitle, content: newContent };

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            if (pendingSaveRef.current) {
                save(pendingSaveRef.current.title, pendingSaveRef.current.content);
                pendingSaveRef.current = null;
            }
        }, 1000); // 1 second debounce
    }, [save]);

    // Handle title change
    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        debouncedSave(newTitle, content);
    };

    // Handle content change
    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        debouncedSave(title, newContent);
    };

    // Handle image upload
    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`/projects/${project.id}/docs/${doc.id}/upload-image`, {
            method: 'POST',
            headers: fetchHeaders('form'),
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            // Save any pending changes before unmounting
            if (pendingSaveRef.current) {
                save(pendingSaveRef.current.title, pendingSaveRef.current.content);
            }
        };
    }, [save]);

    // Save on Ctrl+S
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                save(title, content);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [save, title, content]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${doc.title} - Docs`} />
            <div className="flex h-full flex-1">
                <DocsSidebar
                    projectId={project.id}
                    folders={folders}
                    rootDocuments={rootDocuments}
                    activeDocumentId={doc.id}
                />
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {/* Document Header */}
                    <div className="border-b px-8 py-4 flex items-center gap-4">
                        <Input
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Document title..."
                            className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 px-0 h-auto"
                        />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {isSaving ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : lastSaved ? (
                                <>
                                    <Check className="size-4 text-green-500" />
                                    <span>Saved</span>
                                </>
                            ) : null}
                        </div>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 overflow-y-auto">
                        <DocumentEditor
                            content={content}
                            onChange={handleContentChange}
                            onImageUpload={handleImageUpload}
                            placeholder="Type '/' for commands, or start writing..."
                            className="border-0 rounded-none"
                        />
                    </div>

                    {/* Document Info Footer */}
                    <div className="border-t px-8 py-2 flex items-center justify-between text-xs text-muted-foreground">
                        <div>
                            {doc.creator && (
                                <span>Created by {doc.creator.name}</span>
                            )}
                            {doc.updater && doc.updater.id !== doc.creator?.id && (
                                <span> | Last edited by {doc.updater.name}</span>
                            )}
                        </div>
                        <div>
                            Last updated: {new Date(doc.updated_at).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
