import { type Document } from '@/types/document';
import { Link } from '@inertiajs/react';
import { FileText, Folder, FolderKanban, User } from 'lucide-react';

interface DocListItemProps {
    document: Document;
    showProject?: boolean;
}

export function DocListItem({ document, showProject }: DocListItemProps) {
    const updatedDate = new Date(document.updated_at);
    const isRecent = Date.now() - updatedDate.getTime() < 24 * 60 * 60 * 1000; // Within 24 hours

    return (
        <Link
            href={`/projects/${document.project_id}/docs/${document.id}`}
            className="block rounded-md border border-border/50 bg-background transition-colors hover:border-border hover:bg-muted/50"
        >
            <div className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                    {/* Document icon */}
                    <div className="flex-shrink-0">
                        <FileText className="size-4 text-muted-foreground" />
                    </div>

                    {/* Title */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">
                                {document.title || 'Untitled Document'}
                            </p>
                        </div>
                    </div>

                    {/* Metadata section - right aligned */}
                    <div className="flex flex-shrink-0 items-center gap-3">
                        {/* Folder badge */}
                        {document.folder && (
                            <div
                                className="flex items-center gap-1 text-[10px] text-muted-foreground"
                                title={`In folder: ${document.folder.name}`}
                            >
                                <Folder className="size-3.5" />
                                <span className="max-w-[80px] truncate">
                                    {document.folder.name}
                                </span>
                            </div>
                        )}

                        {/* Project badge */}
                        {showProject && document.project && (
                            <div
                                className="flex items-center gap-1 text-[10px] text-muted-foreground"
                                title={document.project.name}
                            >
                                <FolderKanban className="size-3.5" />
                                <span className="max-w-[80px] truncate">
                                    {document.project.name}
                                </span>
                            </div>
                        )}

                        {/* Updated timestamp */}
                        <div
                            className={`min-w-[70px] text-[10px] ${isRecent ? 'text-primary' : 'text-muted-foreground'}`}
                            title={`Updated ${updatedDate.toLocaleString()}`}
                        >
                            {updatedDate.toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </div>

                        {/* Creator */}
                        {document.creator ? (
                            <div
                                className="flex min-w-[100px] items-center gap-1.5"
                                title={`Created by ${document.creator.name}`}
                            >
                                <div className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                                    {document.creator.name
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <span className="max-w-[75px] truncate text-[10px] text-muted-foreground">
                                    {document.creator.name}
                                </span>
                            </div>
                        ) : (
                            <div className="flex min-w-[100px] items-center gap-1.5 text-[10px] text-muted-foreground/50">
                                <User className="size-3.5" />
                                <span>Unknown</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
