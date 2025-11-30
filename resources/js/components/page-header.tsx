import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { cn, hexToRgba } from '@/lib/utils';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useMemo } from 'react';

interface PageHeaderProps {
    title: string;
    titleExtra?: ReactNode;
    description?: string | ReactNode;
    icon?: ReactNode;
    iconText?: string;
    children?: ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    titleExtra,
    description,
    icon,
    iconText,
    children,
    className,
}: PageHeaderProps) {
    const { currentWorkspace } = usePage<SharedData>().props;
    const workspaceColor = currentWorkspace?.color ?? '#6366f1';

    const dotColors = useMemo(
        () => ({
            color: hexToRgba(workspaceColor, 0.25),
            darkColor: hexToRgba(workspaceColor, 0.3),
            glowColor: hexToRgba(workspaceColor, 0.5),
            darkGlowColor: hexToRgba(workspaceColor, 0.6),
        }),
        [workspaceColor],
    );

    const showIconBox = icon || iconText;

    return (
        <div
            className={cn(
                'relative overflow-hidden border-b px-6 py-4',
                className,
            )}
        >
            <DottedGlowBackground
                gap={14}
                radius={1.5}
                color={dotColors.color}
                darkColor={dotColors.darkColor}
                glowColor={dotColors.glowColor}
                darkGlowColor={dotColors.darkGlowColor}
                opacity={0.4}
                speedMin={0.3}
                speedMax={0.9}
                speedScale={0.8}
            />
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showIconBox && (
                        <div
                            className="flex size-10 items-center justify-center rounded-lg"
                            style={{
                                backgroundColor: hexToRgba(
                                    workspaceColor,
                                    0.15,
                                ),
                            }}
                        >
                            {icon ? (
                                <span style={{ color: workspaceColor }}>
                                    {icon}
                                </span>
                            ) : iconText ? (
                                <span
                                    className="text-base font-semibold"
                                    style={{ color: workspaceColor }}
                                >
                                    {iconText}
                                </span>
                            ) : null}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-semibold">{title}</h1>
                            {titleExtra}
                        </div>
                        {description &&
                            (typeof description === 'string' ? (
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {description}
                                </p>
                            ) : (
                                <div className="mt-0.5 text-sm text-muted-foreground">
                                    {description}
                                </div>
                            ))}
                    </div>
                </div>
                {children && (
                    <div className="flex items-center gap-2">{children}</div>
                )}
            </div>
        </div>
    );
}
