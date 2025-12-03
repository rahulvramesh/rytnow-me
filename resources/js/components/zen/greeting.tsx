import { useMemo } from 'react';

interface GreetingProps {
    userName: string;
    className?: string;
}

export function Greeting({ userName, className }: GreetingProps) {
    const { greeting, emoji } = useMemo(() => {
        const hour = new Date().getHours();

        if (hour < 5) {
            return { greeting: 'Good night', emoji: '🌙' };
        } else if (hour < 12) {
            return { greeting: 'Good morning', emoji: '☀️' };
        } else if (hour < 17) {
            return { greeting: 'Good afternoon', emoji: '🌤️' };
        } else if (hour < 21) {
            return { greeting: 'Good evening', emoji: '🌅' };
        } else {
            return { greeting: 'Good night', emoji: '🌙' };
        }
    }, []);

    const formattedDate = useMemo(() => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }, []);

    // Get first name only
    const firstName = userName.split(' ')[0];

    return (
        <div className={className}>
            <h1 className="mb-2 text-3xl font-light text-foreground">
                {greeting}, <span className="font-medium">{firstName}</span>
            </h1>
            <p className="text-muted-foreground">{formattedDate}</p>
        </div>
    );
}
