// Re-export from @liveblocks/react for simpler imports
export {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react";

export {
    useThreads,
    useOthers,
    useSelf,
} from "@liveblocks/react/suspense";

// Auth endpoint for Liveblocks
export const LIVEBLOCKS_AUTH_ENDPOINT = "/api/liveblocks-auth";

// Helper to check if Liveblocks is configured
export const isLiveblocksConfigured = (): boolean => {
    return true; // Auth endpoint is always available when logged in
};
