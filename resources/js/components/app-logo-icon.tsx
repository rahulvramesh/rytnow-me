import { ImgHTMLAttributes } from 'react';

interface AppLogoIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
    variant?: 'auto' | 'light' | 'dark';
}

const LOGO_LIGHT = 'https://w1yxxhbh1a.ufs.sh/f/1Z5zXGwiCQ9Z6cJNq5QmpROrQ5hx9d1EA3JFikTqb7NSgYKM';
const LOGO_DARK = 'https://w1yxxhbh1a.ufs.sh/f/1Z5zXGwiCQ9ZKbApHumhb8sQaSpFOWAuNjUC43ZDKdzl1fBq';

export default function AppLogoIcon({ className = '', variant = 'auto', ...props }: AppLogoIconProps) {
    if (variant === 'auto') {
        return (
            <>
                <img
                    src={LOGO_LIGHT}
                    alt="Rytnow"
                    className={`dark:hidden ${className}`}
                    {...props}
                />
                <img
                    src={LOGO_DARK}
                    alt="Rytnow"
                    className={`hidden dark:block ${className}`}
                    {...props}
                />
            </>
        );
    }

    return (
        <img
            src={variant === 'dark' ? LOGO_DARK : LOGO_LIGHT}
            alt="Rytnow"
            className={className}
            {...props}
        />
    );
}
