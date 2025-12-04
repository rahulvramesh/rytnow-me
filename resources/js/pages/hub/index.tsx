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
import type { BreadcrumbItem } from '@/types';
import type {
    HubPageProps,
    HubTask,
    HubViewMode,
    WorkspaceStat,
} from '@/types/hub';
import { Head } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Grid3X3,
    Home,
    Kanban,
    LayoutList,
    Search,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { HubCalendarView } from './components/hub-calendar-view';
import { HubGridView } from './components/hub-grid-view';
import { HubKanbanView } from './components/hub-kanban-view';
import { HubTimelineView } from './components/hub-timeline-view';

function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
}

export default function HubIndex({
    tasks,
    timeEntries,
    workspaceStats,
    stats,
}: HubPageProps) {
    const [viewMode, setViewMode] = useState<HubViewMode>('kanban');
    const [search, setSearch] = useState('');
    const [workspaceFilter, setWorkspaceFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    const breadcrumbs: BreadcrumbItem[] = [{ title: 'My Hub', href: '/hub' }];

    // Filter tasks based on search and filters
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const matchesSearch =
                !search ||
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description?.toLowerCase().includes(search.toLowerCase());

            const matchesWorkspace =
                workspaceFilter === 'all' ||
                task.project?.workspace_id?.toString() === workspaceFilter;

            const matchesPriority =
                priorityFilter === 'all' || task.priority === priorityFilter;

            return matchesSearch && matchesWorkspace && matchesPriority;
        });
    }, [tasks, search, workspaceFilter, priorityFilter]);

    const hasFilters =
        search || workspaceFilter !== 'all' || priorityFilter !== 'all';

    const clearFilters = () => {
        setSearch('');
        setWorkspaceFilter('all');
        setPriorityFilter('all');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Hub" />
            <div className="flex h-full flex-1 flex-col">
                <PageHeader
                    title="My Hub"
                    description="Your personal work across all workspaces"
                    icon={<Home className="size-5" />}
                >
                    <div className="flex items-center gap-6 text-sm">
                        {stats.overdue_tasks > 0 && (
                            <div className="flex items-center gap-1.5 text-red-500">
                                <AlertCircle className="size-4" />
                                <span className="font-medium">
                                    {stats.overdue_tasks} overdue
                                </span>
                            </div>
                        )}
                        <div className="text-right">
                            <p className="text-2xl font-bold tabular-nums">
                                {stats.completed_tasks}/{stats.total_tasks}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                tasks completed
                            </p>
                        </div>
                        {stats.total_time_tracked > 0 && (
                            <div className="text-right">
                                <p className="text-2xl font-bold tabular-nums">
                                    {formatDuration(stats.total_time_tracked)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    time tracked
                                </p>
                            </div>
                        )}
                    </div>
                </PageHeader>

                {/* Stats badges */}
                <div className="flex flex-wrap gap-2 border-b px-4 py-2 sm:px-6">
                    <Badge
                        variant={stats.due_today > 0 ? 'default' : 'secondary'}
                        className="text-xs"
                    >
                        {stats.due_today} due today
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                        {stats.due_this_week} due this week
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                        {stats.in_progress_tasks} in progress
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {workspaceStats.length} workspace
                        {workspaceStats.length !== 1 ? 's' : ''}
                    </Badge>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 sm:gap-3 sm:px-6">
                    {/* View switcher */}
                    <div className="order-first flex items-center rounded-lg border p-0.5 sm:order-none">
                        <Button
                            variant={
                                viewMode === 'kanban' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('kanban')}
                            title="Kanban board"
                        >
                            <Kanban className="size-4" />
                        </Button>
                        <Button
                            variant={
                                viewMode === 'grid' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('grid')}
                            title="Workspace grid"
                        >
                            <Grid3X3 className="size-4" />
                        </Button>
                        <Button
                            variant={
                                viewMode === 'timeline' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('timeline')}
                            title="Activity timeline"
                        >
                            <LayoutList className="size-4" />
                        </Button>
                        <Button
                            variant={
                                viewMode === 'calendar' ? 'secondary' : 'ghost'
                            }
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('calendar')}
                            title="Calendar view"
                        >
                            <Calendar className="size-4" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative order-1 max-w-xs min-w-[120px] flex-1 sm:order-none">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-9 pl-9"
                        />
                    </div>

                    {/* Workspace filter */}
                    <Select
                        value={workspaceFilter}
                        onValueChange={setWorkspaceFilter}
                    >
                        <SelectTrigger className="hidden h-9 w-[160px] sm:flex">
                            <SelectValue placeholder="Workspace" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All workspaces</SelectItem>
                            {workspaceStats.map((ws) => (
                                <SelectItem key={ws.id} value={ws.id.toString()}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="size-2 rounded-full"
                                            style={{ backgroundColor: ws.color }}
                                        />
                                        {ws.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Priority filter */}
                    <Select
                        value={priorityFilter}
                        onValueChange={setPriorityFilter}
                    >
                        <SelectTrigger className="hidden h-9 w-[120px] sm:flex">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All priority</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                    </Select>

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
                        {filteredTasks.length} task
                        {filteredTasks.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* View content */}
                <div className="min-h-0 flex-1 overflow-hidden">
                    {viewMode === 'kanban' && (
                        <HubKanbanView tasks={filteredTasks} />
                    )}
                    {viewMode === 'grid' && (
                        <HubGridView
                            tasks={filteredTasks}
                            workspaceStats={workspaceStats}
                        />
                    )}
                    {viewMode === 'timeline' && (
                        <HubTimelineView
                            tasks={filteredTasks}
                            timeEntries={timeEntries}
                        />
                    )}
                    {viewMode === 'calendar' && (
                        <HubCalendarView tasks={filteredTasks} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
