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
            className="block bg-background border border-border/50 rounded-md hover:bg-muted/50 hover:border-border transition-colors"
        >
            <div className="px-4 py-2.5">
                <div className="flex items-center gap-3">
                    {/* Document icon */}
                    <div className="flex-shrink-0">
                        <FileText className="size-4 text-muted-foreground" />
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                                {document.title || 'Untitled Document'}
                            </p>
                        </div>
                    </div>

                    {/* Metadata section - right aligned */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Folder badge */}
                        {document.folder && (
                            <div
                                className="flex items-center gap-1 text-[10px] text-muted-foreground"
                                title={`In folder: ${document.folder.name}`}
                            >
                                <Folder className="size-3.5" />
                                <span className="truncate max-w-[80px]">{document.folder.name}</span>
                            </div>
                        )}

                        {/* Project badge */}
                        {showProject && document.project && (
                            <div
                                className="flex items-center gap-1 text-[10px] text-muted-foreground"
                                title={document.project.name}
                            >
                                <FolderKanban className="size-3.5" />
                                <span className="truncate max-w-[80px]">{document.project.name}</span>
                            </div>
                        )}

                        {/* Updated timestamp */}
                        <div
                            className={`text-[10px] min-w-[70px] ${isRecent ? 'text-primary' : 'text-muted-foreground'}`}
                            title={`Updated ${updatedDate.toLocaleString()}`}
                        >
                            {updatedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>

                        {/* Creator */}
                        {document.creator ? (
                            <div
                                className="flex items-center gap-1.5 min-w-[100px]"
                                title={`Created by ${document.creator.name}`}
                            >
                                <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary">
                                    {document.creator.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[10px] text-muted-foreground truncate max-w-[75px]">
                                    {document.creator.name}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 min-w-[100px] text-[10px] text-muted-foreground/50">
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
