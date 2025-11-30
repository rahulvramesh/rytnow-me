// Re-export from @liveblocks/react for simpler imports
export {
    ClientSideSuspense,
    LiveblocksProvider,
    RoomProvider,
} from '@liveblocks/react';

export { useOthers, useSelf, useThreads } from '@liveblocks/react/suspense';

// Auth endpoint for Liveblocks
export const LIVEBLOCKS_AUTH_ENDPOINT = '/api/liveblocks-auth';

// Helper to check if Liveblocks is configured
export const isLiveblocksConfigured = (): boolean => {
    return true; // Auth endpoint is always available when logged in
};
