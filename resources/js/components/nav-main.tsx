import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, Folder, LayoutGrid, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage<SharedData>();
    const { sidebarProjects } = page.props;
    const [projectSearch, setProjectSearch] = useState('');

    const filteredProjects = useMemo(() => {
        if (!sidebarProjects) return [];
        if (!projectSearch.trim()) return sidebarProjects;
        const search = projectSearch.toLowerCase();
        return sidebarProjects.filter(
            (p) => p.name.toLowerCase().includes(search) || p.key.toLowerCase().includes(search)
        );
    }, [sidebarProjects, projectSearch]);

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isProjectsItem = item.title === 'Projects';
                    const isActive = page.url.startsWith(resolveUrl(item.href));

                    // Regular nav item (non-expandable)
                    if (!isProjectsItem) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    // Projects item with expandable sub-menu
                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        isActive={isActive}
                                        tooltip={{ children: item.title }}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {/* Search input */}
                                        {sidebarProjects && sidebarProjects.length > 3 && (
                                            <div className="px-2 pb-1.5">
                                                <div className="relative">
                                                    <Search className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Search..."
                                                        value={projectSearch}
                                                        onChange={(e) => setProjectSearch(e.target.value)}
                                                        className="h-7 pl-7 text-xs"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {/* All Projects link */}
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={page.url === '/projects'}
                                            >
                                                <Link href="/projects" prefetch>
                                                    <LayoutGrid className="size-3.5" />
                                                    <span>All Projects</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        {/* Individual projects */}
                                        {filteredProjects.map((project) => (
                                            <SidebarMenuSubItem key={project.id}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={page.url.startsWith(`/projects/${project.id}`)}
                                                >
                                                    <Link href={`/projects/${project.id}`} prefetch>
                                                        <Folder className="size-3.5" />
                                                        <span className="truncate">{project.name}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                        {sidebarProjects && sidebarProjects.length > 0 && filteredProjects.length === 0 && (
                                            <SidebarMenuSubItem>
                                                <span className="px-2 py-1.5 text-xs text-muted-foreground">
                                                    No matches found
                                                </span>
                                            </SidebarMenuSubItem>
                                        )}
                                        {(!sidebarProjects || sidebarProjects.length === 0) && (
                                            <SidebarMenuSubItem>
                                                <span className="px-2 py-1.5 text-xs text-muted-foreground">
                                                    No projects yet
                                                </span>
                                            </SidebarMenuSubItem>
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
