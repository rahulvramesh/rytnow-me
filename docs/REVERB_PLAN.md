# Plan: Laravel Reverb Real-Time Integration

## Overview

Integrate Laravel Reverb for real-time WebSocket features while keeping Liveblocks as a toggleable option (like `editor_preference`). This enables team collaboration, activity awareness, and instant updates across the application.

**Scope:**
- Real-time comments
- Kanban board sync
- Live time tracking visibility
- Toast notifications
- Presence indicators (who's viewing)
- User preference for real-time provider

---

## 1. Installation & Configuration

### 1.1 Install Packages

```bash
# Backend
composer require laravel/reverb
php artisan reverb:install

# Frontend
npm install laravel-echo pusher-js sonner
```

### 1.2 Environment Variables

```env
# .env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=trakx-local
REVERB_APP_KEY=trakx-key
REVERB_APP_SECRET=trakx-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

### 1.3 Update Development Script

**composer.json** - Add Reverb to dev script:
```json
"dev": [
    "Composer\\Config::disableProcessTimeout",
    "npx concurrently -c \"#93c5fd,#c4b5fd,#fb7185,#fdba74,#86efac\" \"php artisan serve\" \"php artisan queue:listen --tries=1\" \"php artisan pail --timeout=0\" \"npm run dev\" \"php artisan reverb:start --debug\" --names=server,queue,logs,vite,reverb --kill-others"
]
```

### 1.4 Bootstrap Broadcasting Routes

**bootstrap/app.php** - Add channels routing:
```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    channels: __DIR__.'/../routes/channels.php', // ADD
    health: '/up',
)
```

---

## 2. Channel Architecture

### 2.1 Channel Naming Convention

```
private-workspace.{id}                    # Workspace-level events
private-workspace.{id}.project.{id}       # Project-level (Kanban sync)
private-workspace.{id}.task.{id}          # Task-level (comments, time)
private-user.{id}                         # User notifications
presence-workspace.{id}.task.{id}         # Who's viewing task
```

### 2.2 Channel Authorization

**routes/channels.php** (create new):
```php
<?php

use App\Models\{Project, Task, Workspace, User};
use Illuminate\Support\Facades\Broadcast;

// User's private notification channel
Broadcast::channel('user.{userId}', fn(User $user, int $userId) =>
    $user->id === $userId
);

// Workspace channel
Broadcast::channel('workspace.{workspaceId}', fn(User $user, int $workspaceId) =>
    Workspace::find($workspaceId)?->hasMember($user) ?? false
);

// Project channel
Broadcast::channel('workspace.{workspaceId}.project.{projectId}', function (User $user, int $workspaceId, int $projectId) {
    $workspace = Workspace::find($workspaceId);
    return $workspace?->hasMember($user) &&
           Project::where('id', $projectId)->where('workspace_id', $workspaceId)->exists();
});

// Task channel (private)
Broadcast::channel('workspace.{workspaceId}.task.{taskId}', function (User $user, int $workspaceId, int $taskId) {
    $workspace = Workspace::find($workspaceId);
    if (!$workspace?->hasMember($user)) return false;

    return Task::whereHas('project', fn($q) => $q->where('workspace_id', $workspaceId))
        ->where('id', $taskId)->exists();
});

// Task presence channel (returns user info)
Broadcast::channel('presence-workspace.{workspaceId}.task.{taskId}', function (User $user, int $workspaceId, int $taskId) {
    $workspace = Workspace::find($workspaceId);
    if (!$workspace?->hasMember($user)) return false;

    $hasAccess = Task::whereHas('project', fn($q) => $q->where('workspace_id', $workspaceId))
        ->where('id', $taskId)->exists();

    return $hasAccess ? [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
    ] : false;
});
```

---

## 3. Event Classes

### 3.1 Base Event

**app/Events/BaseWorkspaceEvent.php**:
```php
<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

abstract class BaseWorkspaceEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $workspaceId;
    public ?array $triggeredBy = null;
    public string $timestamp;

    public function __construct(int $workspaceId, ?User $user = null)
    {
        $this->workspaceId = $workspaceId;
        $this->timestamp = now()->toIso8601String();

        if ($user) {
            $this->triggeredBy = [
                'id' => $user->id,
                'name' => $user->name,
            ];
        }
    }

    abstract public function broadcastAs(): string;
    abstract public function broadcastWith(): array;
}
```

### 3.2 Event Classes to Create

| Event | Trigger | Channels |
|-------|---------|----------|
| `Task\TaskCreated` | TaskController@store | workspace, project |
| `Task\TaskUpdated` | TaskController@update | workspace, project, task |
| `Task\TaskStatusChanged` | TaskController@updateStatus | workspace, project |
| `Task\TaskDeleted` | TaskController@destroy | workspace, project |
| `Comment\CommentCreated` | CommentController@store | task |
| `Comment\CommentUpdated` | CommentController@update | task |
| `Comment\CommentDeleted` | CommentController@destroy | task |
| `TimeEntry\TimeEntryStarted` | TimeEntryController@start | task, project, workspace |
| `TimeEntry\TimeEntryStopped` | TimeEntryController@stop | task, project, workspace |
| `UserNotification` | Various triggers | user |

---

## 4. Frontend Integration

### 4.1 Echo Configuration

**resources/js/echo.ts** (create new):
```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

window.Pusher = Pusher;

export function createEcho(): Echo<'reverb'> {
    return new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: '/broadcasting/auth',
    });
}

export function isReverbConfigured(): boolean {
    return !!(import.meta.env.VITE_REVERB_APP_KEY && import.meta.env.VITE_REVERB_HOST);
}
```

### 4.2 Echo Provider

**resources/js/components/echo-provider.tsx** (create new):
```tsx
import { createEcho, isReverbConfigured } from '@/echo';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type Echo from 'laravel-echo';

interface EchoContextValue {
    echo: Echo<'reverb'> | null;
    isConnected: boolean;
}

const EchoContext = createContext<EchoContextValue>({ echo: null, isConnected: false });

export function EchoProvider({ children, userId, enabled = true }: {
    children: ReactNode;
    userId: number | null;
    enabled?: boolean;
}) {
    const [echo, setEcho] = useState<Echo<'reverb'> | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!userId || !enabled || !isReverbConfigured()) return;

        const echoInstance = createEcho();

        echoInstance.connector.pusher.connection.bind('connected', () => setIsConnected(true));
        echoInstance.connector.pusher.connection.bind('disconnected', () => setIsConnected(false));

        setEcho(echoInstance);
        window.Echo = echoInstance;

        return () => {
            echoInstance.disconnect();
            setEcho(null);
        };
    }, [userId, enabled]);

    return (
        <EchoContext.Provider value={{ echo, isConnected }}>
            {children}
        </EchoContext.Provider>
    );
}

export const useEcho = () => useContext(EchoContext);
```

### 4.3 React Hooks to Create

| Hook | Purpose | File |
|------|---------|------|
| `useWorkspaceChannel` | Task CRUD events across workspace | hooks/use-workspace-channel.ts |
| `useProjectChannel` | Kanban sync for project | hooks/use-project-channel.ts |
| `useTaskChannel` | Comments, time entries for task | hooks/use-task-channel.ts |
| `useUserNotifications` | User notification channel | hooks/use-user-notifications.ts |
| `useTaskPresence` | Who's viewing a task | hooks/use-task-presence.ts |
| `useActiveTimers` | Who's tracking time in workspace | hooks/use-active-timers.ts |

---

## 5. User Preference (Realtime Provider Toggle)

### 5.1 Migration

**database/migrations/xxxx_add_realtime_provider_to_users_table.php**:
```php
Schema::table('users', function (Blueprint $table) {
    $table->string('realtime_provider')->default('reverb')->after('collaboration_enabled');
    // Values: 'reverb' | 'liveblocks' | 'both'
});
```

### 5.2 Update User Model

**app/Models/User.php** - Add to $fillable:
```php
'realtime_provider',
```

### 5.3 Settings UI

Update **settings/editor.tsx** to include realtime provider selection:
- Radio group: "Reverb (Recommended)", "Liveblocks", "Both"
- Description explaining each option

---

## 6. Feature Implementation

### 6.1 Comments Real-time

**CommentController.php** updates:
```php
public function store(Request $request, Project $project, Task $task)
{
    // ... existing validation & creation ...

    broadcast(new CommentCreated($comment, $request->user()))->toOthers();

    return redirect()->back();
}
```

**CommentsSection.tsx** updates:
- Use `useTaskChannel` hook for real-time updates
- Optimistic UI: show comment immediately, confirm on server response
- Handle CommentCreated, CommentUpdated, CommentDeleted events

### 6.2 Kanban Board Sync

**TaskController.php** updates:
```php
public function updateStatus(Request $request, Project $project, Task $task)
{
    $oldStatus = $task->status;
    $task->update($validated);

    broadcast(new TaskStatusChanged($task, $oldStatus, $request->user()))->toOthers();

    return redirect()->back();
}
```

**projects/show.tsx** updates:
- Use `useProjectChannel` hook with useReducer for task state
- Optimistic move on drag-drop, server confirms
- Listen for TaskCreated, TaskStatusChanged, TaskDeleted

### 6.3 Time Tracking Live

**TimeEntryController.php** updates:
```php
public function start(Request $request, Project $project, Task $task)
{
    // ... existing logic ...

    broadcast(new TimeEntryStarted($timeEntry, $request->user()))->toOthers();
}

public function stop(Request $request, Project $project, Task $task)
{
    // ... existing logic ...

    broadcast(new TimeEntryStopped($timeEntry, $request->user()))->toOthers();
}
```

**New component**: `ActiveTimersIndicator` showing who's tracking time

### 6.4 Notifications

**New components**:
- `ToastProvider` using sonner
- `NotificationBell` with dropdown for notification list
- Unread count badge

**Backend**:
- Laravel Notification classes (TaskAssigned, MentionedInComment, DueDateReminder)
- Broadcast to `user.{id}` channel

### 6.5 Presence

**tasks/show.tsx** updates:
- Use `useTaskPresence` hook to show who's viewing
- `PresenceAvatars` component showing viewer avatars
- Optional: whisper events for "is typing" indicators

---

## 7. Implementation Order

| Phase | Tasks | Files |
|-------|-------|-------|
| **1. Core Setup** | Install Reverb, configure env, channels.php, bootstrap.php | config, routes, bootstrap |
| **2. Frontend Base** | Echo provider, TypeScript types, integrate in app-layout | echo.ts, echo-provider.tsx, app-layout.tsx |
| **3. Events** | Base event class, all event classes | app/Events/*.php |
| **4. Comments RT** | CommentController broadcast, useTaskChannel hook, update CommentsSection | CommentController.php, hooks/*.ts, comments-section.tsx |
| **5. Kanban Sync** | TaskController broadcasts, useProjectChannel hook, update projects/show | TaskController.php, projects/show.tsx |
| **6. Time Tracking** | TimeEntryController broadcasts, useActiveTimers hook, indicator component | TimeEntryController.php, components/*.tsx |
| **7. Notifications** | Notification classes, NotificationBell, ToastProvider, sonner integration | Notifications/*.php, notification-bell.tsx |
| **8. Presence** | useTaskPresence hook, PresenceAvatars component | hooks/*.ts, presence-avatars.tsx |
| **9. User Preference** | Migration, settings UI update, conditional provider in app-layout | migrations, settings/editor.tsx |

---

## 8. Critical Files to Modify

| File | Changes |
|------|---------|
| `bootstrap/app.php` | Add channels routing |
| `composer.json` | Add reverb to dev script |
| `app/Http/Controllers/CommentController.php` | Broadcast events |
| `app/Http/Controllers/TaskController.php` | Broadcast events |
| `app/Http/Controllers/TimeEntryController.php` | Broadcast events |
| `resources/js/layouts/app-layout.tsx` | Wrap with EchoProvider |
| `resources/js/pages/projects/show.tsx` | Add project channel hook |
| `resources/js/components/comments-section.tsx` | Add task channel hook |
| `resources/js/pages/tasks/show.tsx` | Add presence hook |
| `app/Models/User.php` | Add realtime_provider to fillable |

---

## 9. New Files to Create

```
routes/channels.php
app/Events/BaseWorkspaceEvent.php
app/Events/Task/TaskCreated.php
app/Events/Task/TaskUpdated.php
app/Events/Task/TaskStatusChanged.php
app/Events/Task/TaskDeleted.php
app/Events/Comment/CommentCreated.php
app/Events/Comment/CommentUpdated.php
app/Events/Comment/CommentDeleted.php
app/Events/TimeEntry/TimeEntryStarted.php
app/Events/TimeEntry/TimeEntryStopped.php
app/Events/UserNotification.php
app/Notifications/TaskAssigned.php
app/Notifications/MentionedInComment.php
resources/js/echo.ts
resources/js/components/echo-provider.tsx
resources/js/components/toast-provider.tsx
resources/js/components/notification-bell.tsx
resources/js/components/active-timers-indicator.tsx
resources/js/components/presence-avatars.tsx
resources/js/hooks/use-workspace-channel.ts
resources/js/hooks/use-project-channel.ts
resources/js/hooks/use-task-channel.ts
resources/js/hooks/use-user-notifications.ts
resources/js/hooks/use-task-presence.ts
resources/js/hooks/use-active-timers.ts
resources/js/types/events.d.ts
database/migrations/xxxx_add_realtime_provider_to_users_table.php
```

---

## 10. Testing Checklist

- [ ] Reverb server starts with `composer dev`
- [ ] Echo connects in browser (check console)
- [ ] Channel auth works (no 403 errors)
- [ ] Comments appear for other users without refresh
- [ ] Kanban drag-drop syncs across browser tabs
- [ ] Timer start/stop visible to teammates
- [ ] Notifications appear as toasts
- [ ] Presence shows who's viewing a task
- [ ] User can toggle realtime provider in settings
