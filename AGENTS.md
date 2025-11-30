# AGENTS.md - Coding Agent Guidelines

## Commands
- **Run all tests**: `composer test` (or `php artisan test`)
- **Run single test**: `./vendor/bin/phpunit tests/Feature/ExampleTest.php` (or `php artisan test --filter=TestName`)
- **PHP lint**: `vendor/bin/pint` (Laravel Pint)
- **JS/TS lint**: `npm run lint` (ESLint with auto-fix)
- **Format**: `npm run format` (Prettier with organize-imports + tailwind)
- **Type check**: `npm run types` (TypeScript)
- **Dev server**: `composer dev` (starts PHP, Vite, Reverb, Queue, Logs)

## Code Style

### PHP (Laravel 12)
- Use strict types, type hints, and return types on all methods
- Follow PSR-12 via Laravel Pint; use camelCase for methods, snake_case for DB columns
- Models in `app/Models/`, controllers return Inertia responses, broadcast events with `broadcast(new Event())->toOthers()`
- All data scoped by `workspace_id`; validate workspace membership for assignments
- Use policies for authorization (`$this->authorize()`)

### TypeScript/React 19
- **Strict mode**: All types required, no implicit `any`
- **Imports**: Prettier auto-organizes; use `@/` alias for `resources/js/`
- **Formatting**: 4-space tabs (JS/TS), single quotes, 80 char width, semicolons
- **Components**: Functional components with explicit prop types; use existing shadcn/ui from `@/components/ui/`
- **Icons**: Prefer duo-tone/two-tone from Lucide React + React Icons
- **State**: Zustand stores in `@/stores/`; Inertia forms (no AJAX)
- **Naming**: kebab-case files, PascalCase components, camelCase functions/vars
- **Real-time**: Use custom channel hooks (`use-task-channel.ts`, `use-workspace-channel.ts`) with Laravel Echo

### Error Handling
- PHP: Validate requests, return `back()->withErrors()` for validation, throw exceptions for critical errors
- TS: Handle nullable values explicitly, use optional chaining, catch async errors

## Architecture Notes
- Inertia.js for SSR/SPA routing; types shared in `resources/js/types/`
- Reverb channels: `workspace.{id}`, `workspace.{id}.project.{id}`, `workspace.{id}.task.{id}`
- Database: SQLite in-memory for tests (see `phpunit.xml`)
