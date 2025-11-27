# Collaborative Editor Roadmap

## Current Implementation Status

### What's Working
- TipTap editor with basic formatting (bold, italic, strike, headings, lists)
- Table support with resizing
- Liveblocks real-time sync (text changes sync across users)
- Floating toolbar (block selector + inline formatting)
- Offline support (experimental)
- Editor preference setting (TipTap vs Lexical)
- Collaboration toggle per user

### What's Not Yet Implemented
- Comments/threads (requires auth backend)
- @mentions in editor
- Live cursors with user labels
- Presence avatars (who's online)
- Task lists/checkboxes
- Code blocks with syntax highlighting
- Slash commands
- Version history

---

## Phase 1: Authentication Backend (Foundation)

### Goal
Set up Liveblocks authentication to enable full collaboration features.

### Implementation

**1. Create Laravel Auth Endpoint**
```php
// routes/api.php
Route::post('/liveblocks-auth', [LiveblocksController::class, 'auth'])
    ->middleware('auth:sanctum');
```

**2. LiveblocksController**
```php
// app/Http/Controllers/LiveblocksController.php
class LiveblocksController extends Controller
{
    public function auth(Request $request)
    {
        $user = $request->user();
        $room = $request->input('room');

        // Verify user has access to this room
        // Room format: "task-{id}-description" or "project-{id}-description"

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.liveblocks.secret_key'),
        ])->post('https://api.liveblocks.io/v2/authorize-user', [
            'userId' => (string) $user->id,
            'groupIds' => [], // Add team/org IDs if needed
            'userInfo' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar_url,
                'color' => $this->getUserColor($user->id),
            ],
        ]);

        return $response->json();
    }

    private function getUserColor(int $userId): string
    {
        $colors = ['#E57373', '#F06292', '#BA68C8', '#7986CB', '#64B5F6', '#4DB6AC', '#81C784', '#FFD54F'];
        return $colors[$userId % count($colors)];
    }
}
```

**3. Update Frontend Config**
```typescript
// resources/js/liveblocks.config.ts
import { createClient } from "@liveblocks/client";

const client = createClient({
    authEndpoint: "/api/liveblocks-auth",
});
```

**4. Environment Config**
```env
LIVEBLOCKS_SECRET_KEY=sk_dev_xxx
```

### Files to Create/Modify
- `app/Http/Controllers/LiveblocksController.php` (create)
- `routes/api.php` (add route)
- `config/services.php` (add liveblocks config)
- `resources/js/liveblocks.config.ts` (update to use authEndpoint)

---

## Phase 2: Comments & Threads

### Goal
Enable inline comments on selected text with @mentions.

### Implementation

**1. Update Collaborative Editor**
```tsx
// resources/js/components/collaborative-tiptap-editor.tsx
import {
    useLiveblocksExtension,
    FloatingToolbar,
    FloatingComposer,
    FloatingThreads,
    AnchoredThreads,
    Toolbar,
} from '@liveblocks/react-tiptap';
import { useThreads } from '@liveblocks/react/suspense';

export function CollaborativeTipTapEditor({ ... }) {
    const { threads } = useThreads({ query: { resolved: false } });

    return (
        <div className="collaborative-editor">
            <EditorContent editor={editor} />
            <FloatingToolbar editor={editor}>
                <Toolbar.BlockSelector />
                <Toolbar.SectionInline />
                <Toolbar.Separator />
                <Toolbar.SectionCollaboration />  {/* Adds comment button */}
            </FloatingToolbar>
            <FloatingComposer editor={editor} style={{ width: 350 }} />
            <AnchoredThreads editor={editor} threads={threads} style={{ width: 350 }} />
        </div>
    );
}
```

**2. Implement Mention Suggestions**
```typescript
// resources/js/layouts/app-layout.tsx
<LiveblocksProvider
    authEndpoint="/api/liveblocks-auth"
    resolveUsers={async ({ userIds }) => {
        const response = await fetch(`/api/users?ids=${userIds.join(',')}`);
        return response.json();
    }}
    resolveMentionSuggestions={async ({ text }) => {
        const response = await fetch(`/api/users/search?q=${text}`);
        const users = await response.json();
        return users.map(u => u.id.toString());
    }}
>
```

**3. User Search Endpoint**
```php
// app/Http/Controllers/Api/UserController.php
public function search(Request $request)
{
    $query = $request->input('q', '');
    return User::where('name', 'like', "%{$query}%")
        ->limit(10)
        ->get(['id', 'name', 'email', 'avatar_url']);
}
```

### Features Enabled
- Select text -> click comment button -> add comment
- @mention users in comments
- Reply to comments
- Resolve/unresolve threads
- Thread highlight on selected text

---

## Phase 3: Presence & Awareness

### Goal
Show live cursors, user avatars, and who's currently editing.

### Implementation

**1. Live Cursors with Labels**
Cursors are automatic with Liveblocks extension. Add styling:

```css
/* resources/css/app.css */
.lb-tiptap-cursor-caret {
    position: relative;
}

.lb-tiptap-cursor-label {
    position: absolute;
    top: -1.5em;
    left: 0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    color: white;
}
```

**2. Presence Avatars Component**
```tsx
// resources/js/components/presence-avatars.tsx
import { useOthers, useSelf } from '@liveblocks/react/suspense';

export function PresenceAvatars() {
    const others = useOthers();
    const self = useSelf();

    return (
        <div className="flex -space-x-2">
            {self && (
                <Avatar user={self.info} className="ring-2 ring-primary" />
            )}
            {others.map(({ connectionId, info }) => (
                <Avatar key={connectionId} user={info} />
            ))}
            {others.length > 3 && (
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs">
                    +{others.length - 3}
                </span>
            )}
        </div>
    );
}
```

**3. Add to Editor Header**
```tsx
// In task/project edit pages
<div className="flex items-center justify-between">
    <Label>Description</Label>
    <PresenceAvatars />
</div>
<EditorWrapper ... />
```

### Features Enabled
- See other users' cursors in real-time
- Cursor labels with user names
- Avatar stack showing who's online
- Smooth cursor animations

---

## Phase 4: Rich Editor Features

### Goal
Add task lists, code blocks, slash commands, and more.

### Implementation

**1. Install Additional Extensions**
```bash
npm install @tiptap/extension-task-list @tiptap/extension-task-item
npm install @tiptap/extension-code-block-lowlight lowlight
npm install @tiptap/extension-link
npm install @tiptap/extension-mention
npm install @tiptap/suggestion tippy.js
```

**2. Task Lists**
```tsx
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

const editor = useEditor({
    extensions: [
        // ... existing
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
    ],
});
```

**3. Code Blocks with Syntax Highlighting**
```tsx
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

const editor = useEditor({
    extensions: [
        // ... existing
        CodeBlockLowlight.configure({
            lowlight,
        }),
    ],
});
```

**4. Slash Commands**
```tsx
// resources/js/components/slash-command.tsx
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';

const SlashCommand = Extension.create({
    name: 'slashCommand',
    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }) => {
                    props.command({ editor, range });
                },
            },
        };
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

// Slash command items
const slashItems = [
    { title: 'Heading 1', command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { title: 'Heading 2', command: ({ editor }) => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { title: 'Bullet List', command: ({ editor }) => editor.chain().focus().toggleBulletList().run() },
    { title: 'Task List', command: ({ editor }) => editor.chain().focus().toggleTaskList().run() },
    { title: 'Code Block', command: ({ editor }) => editor.chain().focus().toggleCodeBlock().run() },
    { title: 'Quote', command: ({ editor }) => editor.chain().focus().toggleBlockquote().run() },
    { title: 'Divider', command: ({ editor }) => editor.chain().focus().setHorizontalRule().run() },
];
```

### Features Enabled
- `[ ]` and `[x]` task lists with checkboxes
- ``` code blocks with syntax highlighting
- `/` slash commands for quick formatting
- Links with preview

---

## Phase 5: Notifications (Optional)

### Goal
Notify users when they're mentioned or receive comment replies.

### Implementation

**1. Inbox Component**
```tsx
import { useInboxNotifications } from '@liveblocks/react/suspense';
import { InboxNotification, InboxNotificationList } from '@liveblocks/react-ui';

export function NotificationInbox() {
    const { inboxNotifications } = useInboxNotifications();

    return (
        <InboxNotificationList>
            {inboxNotifications.map((notification) => (
                <InboxNotification key={notification.id} inboxNotification={notification} />
            ))}
        </InboxNotificationList>
    );
}
```

**2. Notification Bell in Header**
```tsx
// Add to app header/nav
<Popover>
    <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
        </Button>
    </PopoverTrigger>
    <PopoverContent>
        <NotificationInbox />
    </PopoverContent>
</Popover>
```

### Features Enabled
- In-app notification bell
- @mention notifications
- Comment reply notifications
- Mark as read/unread

---

## Phase 6: Version History (Future)

### Goal
Track document versions and allow restoration.

### Implementation
```tsx
import { useHistoryVersions } from '@liveblocks/react/suspense';

export function VersionHistory({ roomId }) {
    const { versions } = useHistoryVersions();

    return (
        <div>
            {versions.map((version) => (
                <div key={version.id}>
                    <span>{version.createdAt}</span>
                    <span>{version.authors.join(', ')}</span>
                    <Button onClick={() => restoreVersion(version.id)}>
                        Restore
                    </Button>
                </div>
            ))}
        </div>
    );
}
```

---

## Implementation Priority

| Phase | Feature | Complexity | Impact |
|-------|---------|------------|--------|
| 1 | Auth Backend | Medium | Required for all |
| 2 | Comments & Threads | Medium | High |
| 3 | Presence & Avatars | Low | High |
| 4 | Rich Editor Features | Medium | High |
| 5 | Notifications | Medium | Medium |
| 6 | Version History | High | Medium |

---

## Files Summary

### New Files to Create
- `app/Http/Controllers/LiveblocksController.php`
- `app/Http/Controllers/Api/UserController.php`
- `resources/js/components/presence-avatars.tsx`
- `resources/js/components/slash-command.tsx`

### Files to Modify
- `routes/api.php`
- `config/services.php`
- `resources/js/liveblocks.config.ts`
- `resources/js/components/collaborative-tiptap-editor.tsx`
- `resources/js/layouts/app-layout.tsx`
- `resources/css/app.css`

---

## Resources

- [Liveblocks Documentation](https://liveblocks.io/docs)
- [TipTap Documentation](https://tiptap.dev/docs)
- [Liveblocks + TipTap Guide](https://liveblocks.io/docs/get-started/react-tiptap)
- [TipTap Extensions](https://tiptap.dev/docs/editor/extensions)
