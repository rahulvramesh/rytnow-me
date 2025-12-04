<?php

use App\Http\Controllers\AudioRecordingController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocFolderController;
use App\Http\Controllers\DocumentCommentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\MergedDocsController;
use App\Http\Controllers\MergedTasksController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\QuickThoughtController;
use App\Http\Controllers\QuickThoughtRecordingController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\SubtaskController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskDependencyController;
use App\Http\Controllers\TimeEntryController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\ZenController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('zen', [ZenController::class, 'index'])->name('zen');
    Route::get('search', [SearchController::class, 'search'])->name('search');

    // Workspace routes
    Route::resource('workspaces', WorkspaceController::class);
    Route::post('workspaces/{workspace}/switch', [WorkspaceController::class, 'switch'])
        ->name('workspaces.switch');
    Route::get('workspaces/{workspace}/members', [WorkspaceController::class, 'members'])
        ->name('workspaces.members');
    Route::delete('workspaces/{workspace}/members/{user}', [WorkspaceController::class, 'removeMember'])
        ->name('workspaces.members.remove');
    Route::patch('workspaces/{workspace}/members/{user}/role', [WorkspaceController::class, 'updateMemberRole'])
        ->name('workspaces.members.update-role');

    // Workspace invitations
    Route::post('workspaces/{workspace}/invitations', [InvitationController::class, 'store'])
        ->name('invitations.store');
    Route::post('workspaces/{workspace}/invitations/bulk', [InvitationController::class, 'bulkStore'])
        ->name('invitations.bulk');
    Route::post('workspaces/{workspace}/invitations/{invitation}/resend', [InvitationController::class, 'resend'])
        ->name('invitations.resend');
    Route::delete('workspaces/{workspace}/invitations/{invitation}', [InvitationController::class, 'destroy'])
        ->name('invitations.destroy');

    // Merged tasks view (all tasks across projects in current workspace)
    Route::get('tasks', [MergedTasksController::class, 'index'])->name('tasks.index');

    // Merged docs view (all documents across projects in current workspace)
    Route::get('docs', [MergedDocsController::class, 'index'])->name('docs.workspace');

    Route::resource('projects', ProjectController::class);

    Route::prefix('projects/{project}/tasks')->name('tasks.')->group(function () {
        Route::get('create', [TaskController::class, 'create'])->name('create');
        Route::post('/', [TaskController::class, 'store'])->name('store');
        Route::get('{task}', [TaskController::class, 'show'])->name('show');
        Route::get('{task}/edit', [TaskController::class, 'edit'])->name('edit');
        Route::put('{task}', [TaskController::class, 'update'])->name('update');
        Route::delete('{task}', [TaskController::class, 'destroy'])->name('destroy');
        Route::patch('{task}/status', [TaskController::class, 'updateStatus'])->name('status');
        Route::post('reorder', [TaskController::class, 'reorder'])->name('reorder');

        // Time tracking
        Route::post('{task}/time/start', [TimeEntryController::class, 'start'])->name('time.start');
        Route::post('{task}/time/stop', [TimeEntryController::class, 'stop'])->name('time.stop');
        Route::post('{task}/time', [TimeEntryController::class, 'store'])->name('time.store');
        Route::put('{task}/time/{timeEntry}', [TimeEntryController::class, 'update'])->name('time.update');
        Route::delete('{task}/time/{timeEntry}', [TimeEntryController::class, 'destroy'])->name('time.destroy');

        // Audio recordings
        Route::post('{task}/recordings', [AudioRecordingController::class, 'store'])->name('recordings.store');
        Route::get('{task}/recordings/{audioRecording}', [AudioRecordingController::class, 'stream'])->name('recordings.stream');
        Route::delete('{task}/recordings/{audioRecording}', [AudioRecordingController::class, 'destroy'])->name('recordings.destroy');

        // Comments
        Route::post('{task}/comments', [CommentController::class, 'store'])->name('comments.store');
        Route::put('{task}/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
        Route::delete('{task}/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

        // Task labels
        Route::post('{task}/labels', [LabelController::class, 'attachToTask'])->name('labels.attach');

        // Subtasks
        Route::post('{task}/subtasks', [SubtaskController::class, 'store'])->name('subtasks.store');
        Route::put('{task}/subtasks/{subtask}', [SubtaskController::class, 'update'])->name('subtasks.update');
        Route::delete('{task}/subtasks/{subtask}', [SubtaskController::class, 'destroy'])->name('subtasks.destroy');
        Route::post('{task}/subtasks/reorder', [SubtaskController::class, 'reorder'])->name('subtasks.reorder');

        // Task dependencies
        Route::get('{task}/dependencies', [TaskDependencyController::class, 'index'])->name('dependencies.index');
        Route::get('{task}/dependencies/search', [TaskDependencyController::class, 'search'])->name('dependencies.search');
        Route::post('{task}/dependencies', [TaskDependencyController::class, 'store'])->name('dependencies.store');
        Route::delete('{task}/dependencies/{dependency}', [TaskDependencyController::class, 'destroy'])->name('dependencies.destroy');
    });

    // Project labels
    Route::prefix('projects/{project}/labels')->name('labels.')->group(function () {
        Route::get('/', [LabelController::class, 'index'])->name('index');
        Route::post('/', [LabelController::class, 'store'])->name('store');
        Route::put('{label}', [LabelController::class, 'update'])->name('update');
        Route::delete('{label}', [LabelController::class, 'destroy'])->name('destroy');
    });

    // Project sprints
    Route::prefix('projects/{project}/sprints')->name('sprints.')->group(function () {
        Route::get('/', [SprintController::class, 'index'])->name('index');
        Route::get('create', [SprintController::class, 'create'])->name('create');
        Route::post('/', [SprintController::class, 'store'])->name('store');
        Route::get('backlog', [SprintController::class, 'backlog'])->name('backlog');
        Route::get('{sprint}', [SprintController::class, 'show'])->name('show');
        Route::get('{sprint}/edit', [SprintController::class, 'edit'])->name('edit');
        Route::put('{sprint}', [SprintController::class, 'update'])->name('update');
        Route::delete('{sprint}', [SprintController::class, 'destroy'])->name('destroy');
        Route::post('{sprint}/tasks', [SprintController::class, 'addTasks'])->name('tasks.add');
        Route::delete('{sprint}/tasks', [SprintController::class, 'removeTasks'])->name('tasks.remove');
    });

    // Project documents
    Route::prefix('projects/{project}/docs')->name('docs.')->group(function () {
        Route::get('/', [DocumentController::class, 'index'])->name('index');
        Route::post('/', [DocumentController::class, 'store'])->name('store');
        Route::get('{document}', [DocumentController::class, 'show'])->name('show');
        Route::put('{document}', [DocumentController::class, 'update'])->name('update');
        Route::delete('{document}', [DocumentController::class, 'destroy'])->name('destroy');
        Route::patch('{document}/move', [DocumentController::class, 'move'])->name('move');
        Route::post('reorder', [DocumentController::class, 'reorder'])->name('reorder');
        Route::post('{document}/upload-image', [DocumentController::class, 'uploadImage'])->name('upload-image');

        // Comments
        Route::prefix('{document}/comments')->name('comments.')->group(function () {
            Route::get('/', [DocumentCommentController::class, 'index'])->name('index');
            Route::post('/', [DocumentCommentController::class, 'store'])->name('store');
            Route::put('{comment}', [DocumentCommentController::class, 'update'])->name('update');
            Route::delete('{comment}', [DocumentCommentController::class, 'destroy'])->name('destroy');
            Route::patch('{comment}/resolve', [DocumentCommentController::class, 'resolve'])->name('resolve');
            Route::patch('{comment}/unresolve', [DocumentCommentController::class, 'unresolve'])->name('unresolve');
        });

        // Folders
        Route::post('folders', [DocFolderController::class, 'store'])->name('folders.store');
        Route::put('folders/{folder}', [DocFolderController::class, 'update'])->name('folders.update');
        Route::delete('folders/{folder}', [DocFolderController::class, 'destroy'])->name('folders.destroy');
        Route::post('folders/reorder', [DocFolderController::class, 'reorder'])->name('folders.reorder');
    });

    // Quick Thoughts
    Route::prefix('quick-thoughts')->name('quick-thoughts.')->group(function () {
        Route::get('/', [QuickThoughtController::class, 'index'])->name('index');
        Route::post('/', [QuickThoughtController::class, 'store'])->name('store');
        Route::put('{quickThought}', [QuickThoughtController::class, 'update'])->name('update');
        Route::delete('{quickThought}', [QuickThoughtController::class, 'destroy'])->name('destroy');
        Route::post('{quickThought}/convert', [QuickThoughtController::class, 'convertToTask'])->name('convert');

        // Quick Thought Recordings
        Route::post('{quickThought}/recordings', [QuickThoughtRecordingController::class, 'store'])->name('recordings.store');
        Route::get('{quickThought}/recordings/{recording}', [QuickThoughtRecordingController::class, 'stream'])->name('recordings.stream');
        Route::delete('{quickThought}/recordings/{recording}', [QuickThoughtRecordingController::class, 'destroy'])->name('recordings.destroy');
    });
});

// Public invitation routes (no auth required)
Route::get('invitations/{token}', [InvitationController::class, 'show'])
    ->name('invitations.show');
Route::post('invitations/{token}/accept', [InvitationController::class, 'accept'])
    ->name('invitations.accept');
Route::post('invitations/{token}/decline', [InvitationController::class, 'decline'])
    ->name('invitations.decline');

require __DIR__.'/settings.php';
