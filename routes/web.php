<?php

use App\Http\Controllers\AudioRecordingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TimeEntryController;
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

    Route::resource('projects', ProjectController::class);

    Route::prefix('projects/{project}/tasks')->name('tasks.')->group(function () {
        Route::get('create', [TaskController::class, 'create'])->name('create');
        Route::post('/', [TaskController::class, 'store'])->name('store');
        Route::get('{task}/edit', [TaskController::class, 'edit'])->name('edit');
        Route::put('{task}', [TaskController::class, 'update'])->name('update');
        Route::delete('{task}', [TaskController::class, 'destroy'])->name('destroy');
        Route::patch('{task}/status', [TaskController::class, 'updateStatus'])->name('status');

        // Time tracking
        Route::post('{task}/time/start', [TimeEntryController::class, 'start'])->name('time.start');
        Route::post('{task}/time/stop', [TimeEntryController::class, 'stop'])->name('time.stop');
        Route::post('{task}/time', [TimeEntryController::class, 'store'])->name('time.store');
        Route::delete('{task}/time/{timeEntry}', [TimeEntryController::class, 'destroy'])->name('time.destroy');

        // Audio recordings
        Route::post('{task}/recordings', [AudioRecordingController::class, 'store'])->name('recordings.store');
        Route::get('{task}/recordings/{audioRecording}', [AudioRecordingController::class, 'stream'])->name('recordings.stream');
        Route::delete('{task}/recordings/{audioRecording}', [AudioRecordingController::class, 'destroy'])->name('recordings.destroy');
    });
});

require __DIR__.'/settings.php';
