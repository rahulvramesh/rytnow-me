import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun, LucideIcon } from 'lucide-react';

export function SidebarThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    // When collapsed, show a simple cycling button
    if (isCollapsed) {
        const cycleTheme = () => {
            if (appearance === 'light') {
                updateAppearance('dark');
            } else if (appearance === 'dark') {
                updateAppearance('system');
            } else {
                updateAppearance('light');
            }
        };

        const currentTab = tabs.find((t) => t.value === appearance) || tabs[2];
        const Icon = currentTab.icon;

        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <button
                        onClick={cycleTheme}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-200/60 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100"
                        title={`Theme: ${currentTab.label}`}
                    >
                        <Icon className="size-4" />
                    </button>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className="flex w-full gap-1 rounded-lg bg-neutral-200/60 p-1 dark:bg-neutral-800">
                    {tabs.map(({ value, icon: Icon, label }) => (
                        <button
                            key={value}
                            onClick={() => updateAppearance(value)}
                            className={cn(
                                'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors',
                                appearance === value
                                    ? 'bg-white shadow-sm dark:bg-neutral-700 dark:text-neutral-100'
                                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200',
                            )}
                            title={label}
                        >
                            <Icon className="size-3.5" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
