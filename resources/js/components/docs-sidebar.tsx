import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
import { useState, type DragEvent } from 'react';

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
    const [draggedDocId, setDraggedDocId] = useState<number | null>(null);
    const [dropTargetFolderId, setDropTargetFolderId] = useState<number | null | 'root'>(null);

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

    // Drag and drop handlers
    const handleDragStart = (e: DragEvent, documentId: number) => {
        setDraggedDocId(documentId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(documentId));
    };

    const handleDragEnd = () => {
        setDraggedDocId(null);
        setDropTargetFolderId(null);
    };

    const handleDragOver = (e: DragEvent, folderId: number | 'root') => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDropTargetFolderId(folderId);
    };

    const handleDragLeave = () => {
        setDropTargetFolderId(null);
    };

    const handleDrop = (e: DragEvent, targetFolderId: number | null) => {
        e.preventDefault();
        const documentId = draggedDocId;

        if (!documentId) return;

        router.patch(
            `/projects/${projectId}/docs/${documentId}/move`,
            { doc_folder_id: targetFolderId },
            {
                preserveScroll: true,
                onFinish: () => {
                    setDraggedDocId(null);
                    setDropTargetFolderId(null);
                },
            }
        );
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
                        <div
                            className={cn(
                                'group flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-muted/50 transition-colors',
                                dropTargetFolderId === folder.id && 'bg-primary/20 ring-2 ring-primary/50'
                            )}
                            onDragOver={(e) => handleDragOver(e, folder.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, folder.id)}
                        >
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
                                        onDelete={() => handleDeleteDocument(doc.id)}
                                        onDragStart={(e) => handleDragStart(e, doc.id)}
                                        onDragEnd={handleDragEnd}
                                        isDragging={draggedDocId === doc.id}
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

                {/* Root Documents Drop Zone */}
                <div
                    className={cn(
                        'min-h-[20px] rounded-md transition-colors',
                        folders.length > 0 && rootDocuments.length === 0 && draggedDocId && 'my-2 border-2 border-dashed border-muted-foreground/30 p-2',
                        dropTargetFolderId === 'root' && 'bg-primary/20 ring-2 ring-primary/50'
                    )}
                    onDragOver={(e) => handleDragOver(e, 'root')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, null)}
                >
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
                                    onDragStart={(e) => handleDragStart(e, doc.id)}
                                    onDragEnd={handleDragEnd}
                                    isDragging={draggedDocId === doc.id}
                                />
                            ))}
                        </>
                    )}
                    {folders.length > 0 && rootDocuments.length === 0 && draggedDocId && (
                        <p className="text-center text-xs text-muted-foreground">
                            Drop here to move to root
                        </p>
                    )}
                </div>

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
    onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
    onDragEnd?: () => void;
    isDragging?: boolean;
}

function DocumentItem({
    document,
    projectId,
    isActive,
    onDelete,
    onDragStart,
    onDragEnd,
    isDragging,
}: DocumentItemProps) {
    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={cn(
                'group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-all',
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50',
                isDragging && 'opacity-50 ring-2 ring-primary'
            )}
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
