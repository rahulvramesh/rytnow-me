import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { DocFolder, DocumentSummary } from '@/types/document';
import { router } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronRight,
    File,
    Folder,
    FolderOpen,
    MoreHorizontal,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface DocsSidebarProps {
    projectId: number;
    folders: DocFolder[];
    rootDocuments: DocumentSummary[];
    activeDocumentId?: number;
}

export function DocsSidebar({
    projectId,
    folders,
    rootDocuments,
    activeDocumentId,
}: DocsSidebarProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
        new Set(folders.map((f) => f.id)),
    );
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
    const [editingFolderName, setEditingFolderName] = useState('');

    const toggleFolder = (folderId: number) => {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            if (next.has(folderId)) {
                next.delete(folderId);
            } else {
                next.add(folderId);
            }
            return next;
        });
    };

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;
        router.post(
            `/projects/${projectId}/docs/folders`,
            {
                name: newFolderName.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewFolderName('');
                    setIsCreatingFolder(false);
                },
            },
        );
    };

    const handleCreateDocument = (folderId?: number) => {
        router.post(`/projects/${projectId}/docs`, {
            title: 'Untitled Document',
            doc_folder_id: folderId || null,
        });
    };

    const handleRenameFolder = (folder: DocFolder) => {
        if (!editingFolderName.trim() || editingFolderName === folder.name) {
            setEditingFolderId(null);
            return;
        }
        router.put(
            `/projects/${projectId}/docs/folders/${folder.id}`,
            {
                name: editingFolderName.trim(),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingFolderId(null);
                },
            },
        );
    };

    const handleDeleteFolder = (folderId: number) => {
        if (!confirm('Delete this folder? Documents will be moved to root.'))
            return;
        router.delete(`/projects/${projectId}/docs/folders/${folderId}`, {
            preserveScroll: true,
        });
    };

    const handleDeleteDocument = (documentId: number) => {
        if (!confirm('Delete this document?')) return;
        router.delete(`/projects/${projectId}/docs/${documentId}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="flex h-full w-64 flex-shrink-0 flex-col border-r bg-muted/20">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-3">
                <span className="text-sm font-medium">Documents</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                            <Plus className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => handleCreateDocument()}
                        >
                            <File className="mr-2 size-4" />
                            New Document
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setIsCreatingFolder(true)}
                        >
                            <Folder className="mr-2 size-4" />
                            New Folder
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Create Folder Input */}
            {isCreatingFolder && (
                <div className="border-b p-2">
                    <Input
                        placeholder="Folder name..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateFolder();
                            if (e.key === 'Escape') {
                                setIsCreatingFolder(false);
                                setNewFolderName('');
                            }
                        }}
                        autoFocus
                        className="h-8 text-sm"
                    />
                </div>
            )}

            {/* Document Tree */}
            <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
                {/* Folders */}
                {folders.map((folder) => (
                    <div key={folder.id}>
                        {/* Folder Header */}
                        <div className="group flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-muted/50">
                            <button
                                onClick={() => toggleFolder(folder.id)}
                                className="rounded p-0.5 hover:bg-muted"
                            >
                                {expandedFolders.has(folder.id) ? (
                                    <ChevronDown className="size-3.5 text-muted-foreground" />
                                ) : (
                                    <ChevronRight className="size-3.5 text-muted-foreground" />
                                )}
                            </button>
                            {expandedFolders.has(folder.id) ? (
                                <FolderOpen className="size-4 text-muted-foreground" />
                            ) : (
                                <Folder className="size-4 text-muted-foreground" />
                            )}
                            {editingFolderId === folder.id ? (
                                <Input
                                    value={editingFolderName}
                                    onChange={(e) =>
                                        setEditingFolderName(e.target.value)
                                    }
                                    onBlur={() => handleRenameFolder(folder)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            handleRenameFolder(folder);
                                        if (e.key === 'Escape')
                                            setEditingFolderId(null);
                                    }}
                                    autoFocus
                                    className="h-6 flex-1 text-sm"
                                />
                            ) : (
                                <span className="flex-1 truncate text-sm">
                                    {folder.name}
                                </span>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-6 opacity-0 group-hover:opacity-100"
                                    >
                                        <MoreHorizontal className="size-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleCreateDocument(folder.id)
                                        }
                                    >
                                        <Plus className="mr-2 size-4" />
                                        New Document
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setEditingFolderId(folder.id);
                                            setEditingFolderName(folder.name);
                                        }}
                                    >
                                        <Pencil className="mr-2 size-4" />
                                        Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            handleDeleteFolder(folder.id)
                                        }
                                        className="text-destructive"
                                    >
                                        <Trash2 className="mr-2 size-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Folder Documents */}
                        {expandedFolders.has(folder.id) && folder.documents && (
                            <div className="ml-4 space-y-0.5">
                                {folder.documents.map((doc) => (
                                    <DocumentItem
                                        key={doc.id}
                                        document={doc}
                                        projectId={projectId}
                                        isActive={doc.id === activeDocumentId}
                                        onDelete={() =>
                                            handleDeleteDocument(doc.id)
                                        }
                                    />
                                ))}
                                {folder.documents.length === 0 && (
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                                        No documents
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Root Documents */}
                {rootDocuments.length > 0 && (
                    <>
                        {folders.length > 0 && (
                            <div className="my-2 h-px bg-border" />
                        )}
                        {rootDocuments.map((doc) => (
                            <DocumentItem
                                key={doc.id}
                                document={doc}
                                projectId={projectId}
                                isActive={doc.id === activeDocumentId}
                                onDelete={() => handleDeleteDocument(doc.id)}
                            />
                        ))}
                    </>
                )}

                {/* Empty State */}
                {folders.length === 0 && rootDocuments.length === 0 && (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                        <File className="mx-auto mb-2 size-8 opacity-50" />
                        <p>No documents yet</p>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => handleCreateDocument()}
                            className="mt-1"
                        >
                            Create your first document
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

interface DocumentItemProps {
    document: DocumentSummary;
    projectId: number;
    isActive: boolean;
    onDelete: () => void;
}

function DocumentItem({
    document,
    projectId,
    isActive,
    onDelete,
}: DocumentItemProps) {
    return (
        <div
            className={`group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 ${
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
            }`}
            onClick={() =>
                router.visit(`/projects/${projectId}/docs/${document.id}`)
            }
        >
            <File
                className={`size-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            />
            <span className="flex-1 truncate text-sm">{document.title}</span>
            <DropdownMenu>
                <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 opacity-0 group-hover:opacity-100"
                    >
                        <MoreHorizontal className="size-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="text-destructive"
                    >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
