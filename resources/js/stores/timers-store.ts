import type { TimeEntry } from '@/types/time-entry';
import { create } from 'zustand';

interface ActiveTimer {
    timeEntryId: number;
    taskId: number;
    userId: number;
    userName: string;
    startedAt: string;
}

interface TimersStore {
    // State
    activeTimers: ActiveTimer[];
    myActiveTimer: TimeEntry | null;

    // Actions
    setActiveTimers: (timers: ActiveTimer[]) => void;
    addActiveTimer: (timer: ActiveTimer) => void;
    removeActiveTimer: (timeEntryId: number) => void;
    removeUserTimer: (userId: number) => void;
    setMyActiveTimer: (timer: TimeEntry | null) => void;
    reset: () => void;
}

export const useTimersStore = create<TimersStore>((set) => ({
    activeTimers: [],
    myActiveTimer: null,

    setActiveTimers: (timers) => set({ activeTimers: timers }),

    addActiveTimer: (timer) =>
        set((state) => ({
            // Remove any existing timer for this user first
            activeTimers: [
                ...state.activeTimers.filter((t) => t.userId !== timer.userId),
                timer,
            ],
        })),

    removeActiveTimer: (timeEntryId) =>
        set((state) => ({
            activeTimers: state.activeTimers.filter(
                (t) => t.timeEntryId !== timeEntryId,
            ),
        })),

    removeUserTimer: (userId) =>
        set((state) => ({
            activeTimers: state.activeTimers.filter((t) => t.userId !== userId),
        })),

    setMyActiveTimer: (timer) => set({ myActiveTimer: timer }),

    reset: () => set({ activeTimers: [], myActiveTimer: null }),
}));
