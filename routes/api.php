<?php

use App\Http\Controllers\Api\LiveblocksController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CommentController;
use App\Http\Controllers\Api\V1\LabelController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\SubtaskController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\TimeEntryController;
use App\Http\Controllers\Api\V1\WorkspaceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// ==========================================================================
// API v1 Routes
// ==========================================================================
Route::prefix('v1')->middleware('throttle:api')->group(function () {
    // Public: Get token
    Route::post('/auth/token', [AuthController::class, 'createToken']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::get('/auth/user', [AuthController::class, 'user']);
        Route::get('/auth/tokens', [AuthController::class, 'tokens']);
        Route::delete('/auth/token', [AuthController::class, 'revokeToken']);
        Route::delete('/auth/tokens/{token}', [AuthController::class, 'revokeTokenById']);

        // Workspaces
        Route::apiResource('workspaces', WorkspaceController::class)
            ->names('api.workspaces');
        Route::get('workspaces/{workspace}/members', [WorkspaceController::class, 'members']);

        // Projects (scoped to workspace)
        Route::apiResource('workspaces/{workspace}/projects', ProjectController::class)
            ->names('api.projects');

        // Tasks (scoped to project)
        Route::apiResource('projects/{project}/tasks', TaskController::class)
            ->names('api.tasks');
        Route::patch('projects/{project}/tasks/{task}/status', [TaskController::class, 'updateStatus'])
            ->name('api.tasks.updateStatus');

        // Time Entries
        Route::apiResource('tasks/{task}/time-entries', TimeEntryController::class);
        Route::post('tasks/{task}/time-entries/start', [TimeEntryController::class, 'start']);
        Route::post('tasks/{task}/time-entries/stop', [TimeEntryController::class, 'stop']);

        // Comments
        Route::apiResource('tasks/{task}/comments', CommentController::class);

        // Labels (scoped to project)
        Route::apiResource('projects/{project}/labels', LabelController::class)
            ->names('api.labels');

        // Subtasks
        Route::apiResource('tasks/{task}/subtasks', SubtaskController::class);
        Route::patch('tasks/{task}/subtasks/{subtask}/toggle', [SubtaskController::class, 'toggle']);
    });
});

// ==========================================================================
// Legacy/Internal Routes (session-based auth for frontend)
// ==========================================================================

// Liveblocks authentication - requires user to be logged in
// Using web middleware for session-based auth (same session as Inertia frontend)
Route::post('/liveblocks-auth', [LiveblocksController::class, 'auth'])
    ->middleware(['web', 'auth']);

// User endpoints for Liveblocks collaboration features
Route::middleware(['web', 'auth'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/search', [UserController::class, 'search']);
});
