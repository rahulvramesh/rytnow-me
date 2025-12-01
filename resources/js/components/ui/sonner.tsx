import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            style={
                {
                    '--normal-bg': 'hsl(var(--popover))',
                    '--normal-text': 'hsl(var(--popover-foreground))',
                    '--normal-border': 'hsl(var(--border))',
                    '--success-bg': 'hsl(142.1 76.2% 36.3%)',
                    '--success-text': 'hsl(var(--popover-foreground))',
                    '--error-bg': 'hsl(var(--destructive))',
                    '--error-text': 'hsl(var(--destructive-foreground))',
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-[var(--normal-bg)] group-[.toaster]:text-[var(--normal-text)] group-[.toaster]:border-[var(--normal-border)] group-[.toaster]:shadow-lg',
                    description: 'group-[.toast]:text-muted-foreground',
                    actionButton:
                        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton:
                        'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                    success:
                        'group-[.toaster]:bg-[var(--success-bg)] group-[.toaster]:text-white group-[.toaster]:border-[var(--success-bg)]',
                    error: 'group-[.toaster]:bg-[var(--error-bg)] group-[.toaster]:text-[var(--error-text)] group-[.toaster]:border-[var(--error-bg)]',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
