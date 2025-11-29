# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trakx is a full-stack project management application with real-time collaboration features built on Laravel 12 + React 19 + TypeScript. Uses Inertia.js for server-driven SPA routing, Laravel Reverb for WebSocket real-time sync, and Liveblocks for collaborative document editing.

## Common Commands

```bash
# Development (starts PHP server, Vite, Reverb, Queue, Logs)
composer dev

# Build frontend
npm run build

# Run tests
composer test

# Linting & formatting
npm run lint          # ESLint fix
npm run format        # Prettier
npm run types         # TypeScript check
vendor/bin/pint       # PHP code style

# First-time setup
composer setup
```

## Architecture

### Backend (Laravel)
- **Models**: `app/Models/` - Task, Project, Workspace, User, TimeEntry, Comment, Label, Document, QuickThought
- **Controllers**: `app/Http/Controllers/` - Standard Laravel controllers with Inertia responses
- **Events**: `app/Events/` - Real-time broadcasting events (Task/, Comment/, TimeEntry/)
- **API Routes**: `routes/api.php` - Versioned REST API at `/api/v1/` with Sanctum auth
- **Broadcast Channels**: `routes/channels.php` - Workspace, project, and task-scoped private channels

### Frontend (React + TypeScript)
- **Pages**: `resources/js/pages/` - Inertia page components
- **Components**: `resources/js/components/` - Reusable UI components
- **Stores**: `resources/js/stores/` - Zustand state (kanban-store, comments-store, timers-store)
- **Hooks**: `resources/js/hooks/` - Custom hooks including real-time channel hooks (use-task-channel.ts, use-workspace-channel.ts, use-project-channel.ts)
- **Types**: `resources/js/types/` - TypeScript definitions

### Real-Time Architecture
- **Laravel Reverb**: WebSocket server for real-time events
- **Laravel Echo**: Client-side broadcast listener (`resources/js/lib/echo.ts`)
- **Channel Pattern**: `workspace.{id}`, `workspace.{id}.project.{id}`, `workspace.{id}.task.{id}`
- **Liveblocks**: Optional collaborative editing for documents

### Multi-Tenancy
All data is scoped by `workspace_id`. Projects belong to workspaces, tasks belong to projects. Users can be members of multiple workspaces.

## Key Patterns

- Inertia form helpers for submissions (not traditional AJAX)
- Server-side rendering with `npm run build:ssr`
- Event broadcasting from controllers with `broadcast(new Event())->toOthers()`
- Tailwind CSS 4 with Radix UI primitives in `resources/js/components/ui/`

## Testing

```bash
# Run all tests
composer test

# Run specific test
./vendor/bin/phpunit tests/Feature/ExampleTest.php
```

Tests use SQLite in-memory database. Configuration in `phpunit.xml`.

## Code Style Preferences

- Dutone/two-tone icons are always first preference (Lucide React + React Icons)
- Use existing shadcn/ui components from `resources/js/components/ui/`
