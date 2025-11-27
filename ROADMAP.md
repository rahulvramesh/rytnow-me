# Trakx Roadmap

## Current Sprint: UI Enhancements (Completed)

### 1. Drag & Drop for Kanban Board ✅
- [x] Install and configure @dnd-kit/core and @dnd-kit/sortable
- [x] Make task cards draggable within columns
- [x] Enable moving tasks between columns (status change)
- [x] Add drop indicators and visual feedback
- [x] Persist position changes to backend
- [x] Add reorder API endpoint

### 2. Keyboard Shortcuts ✅
- [x] Create keyboard shortcut provider
- [x] Implement shortcuts:
  - `n` - New task (when on project page)
  - `p` - New project
  - `/` or `Cmd+K` - Open command palette
  - `Escape` - Close modals/panels
  - `?` - Show keyboard shortcuts help
  - `g p` - Go to projects
  - `g d` - Go to dashboard
- [x] Add keyboard shortcut help modal
- [x] Show shortcut hints in command palette

### 3. Global Search / Command Palette ✅
- [x] Create search API endpoint (search projects + tasks)
- [x] Build command palette component (Cmd+K style)
- [x] Fuzzy search with debouncing
- [x] Quick actions from search (create task, go to project)
- [x] Search result categories (Projects, Tasks)
- [x] Keyboard navigation (arrow keys, enter to select)

### 4. Labels/Tags for Tasks ✅
- [x] Create labels migration (id, name, color, project_id)
- [x] Create Label model and relationships
- [x] Add labels CRUD API
- [x] Add label attach/sync endpoint for tasks
- [ ] Create label management UI in project settings
- [ ] Add label picker to task forms
- [ ] Display labels on task cards
- [ ] Filter tasks by label

---

## Future Features

### Collaboration
- Team members / user invites
- Task assignments
- Activity feed
- Real-time updates (websockets)
- @mentions in comments

### Productivity
- Due date reminders / notifications
- Recurring tasks
- Task templates
- Subtasks / checklists
- Time estimates

### Polish
- Mobile responsive improvements
- Dark mode refinements
- Bulk actions (multi-select tasks)
- Import/export functionality
