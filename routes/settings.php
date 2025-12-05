<?php

use App\Http\Controllers\Settings\ApiTokenController;
use App\Http\Controllers\Settings\EditorController;
use App\Http\Controllers\Settings\IntegrationsController;
use App\Http\Controllers\Settings\LlmProviderController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    Route::get('settings/editor', [EditorController::class, 'edit'])->name('editor.edit');
    Route::patch('settings/editor', [EditorController::class, 'update'])->name('editor.update');

    Route::get('settings/api-tokens', [ApiTokenController::class, 'index'])->name('api-tokens.index');
    Route::post('settings/api-tokens', [ApiTokenController::class, 'store'])->name('api-tokens.store');
    Route::delete('settings/api-tokens/{token}', [ApiTokenController::class, 'destroy'])->name('api-tokens.destroy');

    // LLM Providers
    Route::get('settings/llm-providers', [LlmProviderController::class, 'index'])->name('llm-providers.index');
    Route::post('settings/llm-providers', [LlmProviderController::class, 'store'])->name('llm-providers.store');
    Route::post('settings/llm-providers/fetch-models', [LlmProviderController::class, 'fetchModelsFromEndpoint'])->name('llm-providers.fetch-models');
    Route::patch('settings/llm-providers/{provider}', [LlmProviderController::class, 'update'])->name('llm-providers.update');
    Route::delete('settings/llm-providers/{provider}', [LlmProviderController::class, 'destroy'])->name('llm-providers.destroy');
    Route::post('settings/llm-providers/{provider}/default', [LlmProviderController::class, 'setDefault'])->name('llm-providers.default');
    Route::post('settings/llm-providers/{provider}/test', [LlmProviderController::class, 'testConnection'])->name('llm-providers.test');
    Route::get('settings/llm-providers/{provider}/models', [LlmProviderController::class, 'fetchModels'])->name('llm-providers.models');

    // Integrations
    Route::get('settings/integrations', [IntegrationsController::class, 'index'])->name('integrations.index');
});
