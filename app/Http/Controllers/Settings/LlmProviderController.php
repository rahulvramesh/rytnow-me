<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\LlmProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class LlmProviderController extends Controller
{
    public function index(Request $request): Response
    {
        $providers = $request->user()
            ->llmProviders()
            ->orderBy('is_default', 'desc')
            ->orderBy('name')
            ->get()
            ->map(fn ($provider) => [
                'id' => $provider->id,
                'name' => $provider->name,
                'provider' => $provider->provider,
                'base_url' => $provider->base_url,
                'default_model' => $provider->default_model,
                'is_active' => $provider->is_active,
                'is_default' => $provider->is_default,
                'has_api_key' => $provider->hasApiKey(),
                'last_used_at' => $provider->last_used_at,
                'created_at' => $provider->created_at,
            ]);

        return Inertia::render('settings/llm-providers', [
            'providers' => $providers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider' => 'required|string|max:50',
            'base_url' => 'required|url|max:500',
            'api_key' => 'nullable|string|max:500',
            'default_model' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ]);

        $provider = $request->user()->llmProviders()->create([
            'name' => $validated['name'],
            'provider' => $validated['provider'],
            'base_url' => $validated['base_url'],
            'api_key' => $validated['api_key'] ?? null,
            'default_model' => $validated['default_model'] ?? null,
            'is_active' => true,
            'is_default' => false,
        ]);

        if ($validated['is_default'] ?? false) {
            $provider->setAsDefault();
        }

        return redirect()->back()->with('success', 'LLM provider added.');
    }

    public function update(Request $request, LlmProvider $provider): RedirectResponse
    {
        // Ensure user owns this provider
        if ($provider->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'provider' => 'sometimes|required|string|max:50',
            'base_url' => 'sometimes|required|url|max:500',
            'api_key' => 'nullable|string|max:500',
            'default_model' => 'nullable|string|max:100',
            'is_active' => 'sometimes|boolean',
            'is_default' => 'sometimes|boolean',
        ]);

        // Handle API key update (only update if provided)
        if (array_key_exists('api_key', $validated)) {
            if ($validated['api_key']) {
                $provider->api_key = $validated['api_key'];
            }
            unset($validated['api_key']);
        }

        $provider->update($validated);

        if ($validated['is_default'] ?? false) {
            $provider->setAsDefault();
        }

        return redirect()->back()->with('success', 'LLM provider updated.');
    }

    public function destroy(Request $request, LlmProvider $provider): RedirectResponse
    {
        if ($provider->user_id !== $request->user()->id) {
            abort(403);
        }

        $provider->delete();

        return redirect()->back()->with('success', 'LLM provider removed.');
    }

    public function setDefault(Request $request, LlmProvider $provider): RedirectResponse
    {
        if ($provider->user_id !== $request->user()->id) {
            abort(403);
        }

        $provider->setAsDefault();

        return redirect()->back()->with('success', 'Default provider updated.');
    }

    public function testConnection(Request $request, LlmProvider $provider): JsonResponse
    {
        if ($provider->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $headers = [
                'Content-Type' => 'application/json',
            ];

            if ($provider->hasApiKey()) {
                $headers['Authorization'] = 'Bearer '.$provider->getDecryptedApiKey();
            }

            // Try to get models list (OpenAI-compatible endpoint)
            $response = Http::withHeaders($headers)
                ->timeout(10)
                ->get($provider->getEndpoint('/v1/models'));

            if ($response->successful()) {
                $models = $response->json('data', []);
                $modelNames = collect($models)->pluck('id')->take(10)->values()->all();

                return response()->json([
                    'success' => true,
                    'message' => 'Connection successful!',
                    'models' => $modelNames,
                ]);
            }

            // Try chat completions endpoint as fallback test
            $chatResponse = Http::withHeaders($headers)
                ->timeout(10)
                ->post($provider->getEndpoint('/v1/chat/completions'), [
                    'model' => $provider->default_model ?? 'gpt-3.5-turbo',
                    'messages' => [
                        ['role' => 'user', 'content' => 'Hi'],
                    ],
                    'max_tokens' => 5,
                ]);

            if ($chatResponse->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Connection successful!',
                    'models' => [],
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Connection failed: '.($response->json('error.message') ?? 'Unknown error'),
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: '.$e->getMessage(),
            ], 400);
        }
    }

    public function fetchModels(Request $request, LlmProvider $provider): JsonResponse
    {
        if ($provider->user_id !== $request->user()->id) {
            abort(403);
        }

        try {
            $headers = [
                'Content-Type' => 'application/json',
            ];

            if ($provider->hasApiKey()) {
                $headers['Authorization'] = 'Bearer '.$provider->getDecryptedApiKey();
            }

            $response = Http::withHeaders($headers)
                ->timeout(10)
                ->get($provider->getEndpoint('/v1/models'));

            if ($response->successful()) {
                $models = $response->json('data', []);
                $modelNames = collect($models)->pluck('id')->sort()->values()->all();

                return response()->json([
                    'success' => true,
                    'models' => $modelNames,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch models',
                'models' => [],
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'models' => [],
            ], 400);
        }
    }

    /**
     * Fetch models from an arbitrary endpoint (before provider is saved)
     */
    public function fetchModelsFromEndpoint(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'base_url' => 'required|url',
            'api_key' => 'nullable|string',
        ]);

        try {
            $baseUrl = rtrim($validated['base_url'], '/');
            $headers = [
                'Content-Type' => 'application/json',
            ];

            if (! empty($validated['api_key'])) {
                $headers['Authorization'] = 'Bearer '.$validated['api_key'];
            }

            $response = Http::withHeaders($headers)
                ->timeout(10)
                ->get($baseUrl.'/v1/models');

            if ($response->successful()) {
                $models = $response->json('data', []);
                $modelNames = collect($models)->pluck('id')->sort()->values()->all();

                return response()->json([
                    'success' => true,
                    'models' => $modelNames,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch models: '.($response->json('error.message') ?? 'Unknown error'),
                'models' => [],
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: '.$e->getMessage(),
                'models' => [],
            ], 400);
        }
    }
}
