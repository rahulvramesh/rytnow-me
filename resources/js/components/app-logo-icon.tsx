import { ImgHTMLAttributes } from 'react';

interface AppLogoIconProps extends ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
}

export default function AppLogoIcon({ className = '', ...props }: AppLogoIconProps) {
    return (
        <img
            src="https://w1yxxhbh1a.ufs.sh/f/1Z5zXGwiCQ9ZHrhzHSRv7Ftlas0bKnTExgIWCd2Awc8y1LrG"
            alt="Rytnow"
            className={className}
            {...props}
        />
    );
}
