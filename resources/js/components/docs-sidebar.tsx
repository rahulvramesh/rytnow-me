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

export function DocsSidebar({ projectId, folders, rootDocuments, activeDocumentId }: DocsSidebarProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set(folders.map((f) => f.id)));
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
        router.post(`/projects/${projectId}/docs/folders`, {
            name: newFolderName.trim(),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewFolderName('');
                setIsCreatingFolder(false);
            },
        });
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
        router.put(`/projects/${projectId}/docs/folders/${folder.id}`, {
            name: editingFolderName.trim(),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingFolderId(null);
            },
        });
    };

    const handleDeleteFolder = (folderId: number) => {
        if (!confirm('Delete this folder? Documents will be moved to root.')) return;
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
        <div className="w-64 flex-shrink-0 border-r bg-muted/20 flex flex-col h-full">
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between">
                <span className="font-medium text-sm">Documents</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                            <Plus className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCreateDocument()}>
                            <File className="size-4 mr-2" />
                            New Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsCreatingFolder(true)}>
                            <Folder className="size-4 mr-2" />
                            New Folder
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Create Folder Input */}
            {isCreatingFolder && (
                <div className="p-2 border-b">
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
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {/* Folders */}
                {folders.map((folder) => (
                    <div key={folder.id}>
                        {/* Folder Header */}
                        <div className="group flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-muted/50">
                            <button
                                onClick={() => toggleFolder(folder.id)}
                                className="p-0.5 hover:bg-muted rounded"
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
                                    onChange={(e) => setEditingFolderName(e.target.value)}
                                    onBlur={() => handleRenameFolder(folder)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRenameFolder(folder);
                                        if (e.key === 'Escape') setEditingFolderId(null);
                                    }}
                                    autoFocus
                                    className="h-6 text-sm flex-1"
                                />
                            ) : (
                                <span className="text-sm flex-1 truncate">{folder.name}</span>
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
                                    <DropdownMenuItem onClick={() => handleCreateDocument(folder.id)}>
                                        <Plus className="size-4 mr-2" />
                                        New Document
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            setEditingFolderId(folder.id);
                                            setEditingFolderName(folder.name);
                                        }}
                                    >
                                        <Pencil className="size-4 mr-2" />
                                        Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteFolder(folder.id)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="size-4 mr-2" />
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
                        {folders.length > 0 && <div className="h-px bg-border my-2" />}
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
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        <File className="size-8 mx-auto mb-2 opacity-50" />
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

function DocumentItem({ document, projectId, isActive, onDelete }: DocumentItemProps) {
    return (
        <div
            className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer ${
                isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
            }`}
            onClick={() => router.visit(`/projects/${projectId}/docs/${document.id}`)}
        >
            <File className={`size-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="text-sm flex-1 truncate">{document.title}</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 opacity-0 group-hover:opacity-100"
                    >
                        <MoreHorizontal className="size-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                        <Trash2 className="size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
