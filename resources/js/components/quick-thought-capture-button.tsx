import { QuickThoughtInput } from '@/components/quick-thought-input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { PiLightbulbFilamentDuotone, PiSparkleDuotone } from 'react-icons/pi';

export function QuickThoughtCaptureButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                title="Capture a quick thought"
                className="fixed bottom-6 right-6 z-50 group"
            >
                {/* Glow ring - visible on hover */}
                <span
                    className={`absolute inset-[-6px] rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 blur-md transition-opacity duration-300 ${
                        isHovered ? 'opacity-70' : 'opacity-0'
                    }`}
                />

                {/* Main button */}
                <span
                    className={`relative flex items-center justify-center size-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 transition-all duration-300 ${
                        isHovered ? 'scale-110 shadow-xl shadow-amber-500/50 rotate-12' : ''
                    }`}
                >
                    {/* Lightbulb duotone icon */}
                    <PiLightbulbFilamentDuotone
                        className={`text-2xl transition-all duration-300 ${
                            isHovered ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''
                        }`}
                    />

                    {/* Sparkles - visible on hover */}
                    <PiSparkleDuotone
                        className={`absolute -top-1 -right-1 text-lg text-yellow-200 transition-all duration-300 ${
                            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}
                    />
                    <PiSparkleDuotone
                        className={`absolute -bottom-0.5 -left-1 text-sm text-yellow-200 transition-all duration-300 delay-75 ${
                            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}
                    />
                </span>

                {/* Tooltip on hover */}
                <span
                    className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap transition-all duration-300 ${
                        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
                    }`}
                >
                    Capture idea
                    <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-gray-900" />
                </span>
            </button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="flex items-center justify-center size-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                                <PiLightbulbFilamentDuotone className="text-base text-white" />
                            </span>
                            Quick Thought
                        </DialogTitle>
                    </DialogHeader>
                    <QuickThoughtInput
                        compact
                        autoFocus
                        onSuccess={() => setIsOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
