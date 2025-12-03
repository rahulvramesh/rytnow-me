import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Zen Mode Button */}
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link
                            href="/zen"
                            className="group relative inline-flex h-8 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-3 text-sm font-medium transition-all hover:from-indigo-500/20 hover:to-purple-500/20 hover:shadow-md hover:shadow-indigo-500/10"
                        >
                            <Sparkles className="size-4 text-indigo-500" />
                            <span className="hidden text-xs font-medium sm:inline">
                                Zen Mode
                            </span>
                            <kbd className="hidden rounded border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 font-mono text-[10px] text-indigo-600 dark:text-indigo-400 md:inline">
                                ⌘⇧Z
                            </kbd>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="flex flex-col gap-1">
                        <p className="font-medium">Enter Zen Mode</p>
                        <p className="text-xs text-muted-foreground">
                            Distraction-free focus on today's tasks
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </header>
    );
}
