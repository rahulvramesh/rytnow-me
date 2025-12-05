<?php

namespace App\Console\Commands;

use App\Exceptions\LlmException;
use App\Models\LlmProvider;
use App\Models\User;
use App\Services\LlmService;
use Illuminate\Console\Command;

class TestLlm extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'llm:test
        {--user= : User ID to test with}
        {--provider= : Provider ID to test with}
        {--prompt= : Custom prompt to test}
        {--stream : Test streaming response}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test LLM provider connection and response';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $service = $this->getService();

        if (! $service) {
            $this->error('No LLM provider available.');
            $this->info('Configure a provider at: /settings/llm-providers');

            return Command::FAILURE;
        }

        $provider = $service->getProvider();
        $this->info('Testing LLM Provider');
        $this->table(['Property', 'Value'], [
            ['Provider', $provider->name],
            ['Type', $provider->provider],
            ['Base URL', $provider->base_url],
            ['Model', $provider->default_model ?? 'default'],
            ['Active', $provider->is_active ? 'Yes' : 'No'],
        ]);

        // Test 1: Check availability
        $this->newLine();
        $this->info('1. Checking availability...');
        if (! $service->isAvailable()) {
            $this->error('   Provider is not active');

            return Command::FAILURE;
        }
        $this->line('   <fg=green>✓</> Provider is active');

        // Test 2: Fetch models
        $this->newLine();
        $this->info('2. Fetching available models...');
        try {
            $models = $service->getModels();
            if (count($models) > 0) {
                $this->line('   <fg=green>✓</> Found '.count($models).' models');
                $displayModels = array_slice($models, 0, 5);
                foreach ($displayModels as $model) {
                    $this->line("      - {$model}");
                }
                if (count($models) > 5) {
                    $this->line('      ... and '.(count($models) - 5).' more');
                }
            } else {
                $this->warn('   No models returned (some providers do not support /v1/models)');
            }
        } catch (LlmException $e) {
            $this->warn('   Could not fetch models: '.$e->getMessage());
        }

        // Test 3: Simple chat completion
        $this->newLine();
        $this->info('3. Testing chat completion...');
        $prompt = $this->option('prompt') ?? 'Say "Hello from '.$provider->name.'!" in a friendly way.';

        try {
            if ($this->option('stream')) {
                $this->line('   <fg=cyan>Streaming response:</>');
                $this->newLine();
                $content = '';
                foreach ($service->chatStream([
                    ['role' => 'user', 'content' => $prompt],
                ]) as $chunk) {
                    $this->output->write($chunk);
                    $content .= $chunk;
                }
                $this->newLine(2);
                $this->line('   <fg=green>✓</> Streaming successful ('.strlen($content).' chars)');
            } else {
                $response = $service->ask($prompt);
                $this->line('   <fg=cyan>Response:</>');
                $this->line('   '.str_replace("\n", "\n   ", $response));
                $this->newLine();
                $this->line('   <fg=green>✓</> Chat completion successful');
            }
        } catch (LlmException $e) {
            $this->error('   Chat failed: '.$e->getMessage());

            return Command::FAILURE;
        }

        $this->newLine();
        $this->info('All tests passed!');

        return Command::SUCCESS;
    }

    /**
     * Get the LLM service to test
     */
    protected function getService(): ?LlmService
    {
        if ($providerId = $this->option('provider')) {
            $provider = LlmProvider::find($providerId);
            if (! $provider) {
                $this->error("Provider ID {$providerId} not found");

                return null;
            }

            return LlmService::forProvider($provider);
        }

        if ($userId = $this->option('user')) {
            $user = User::find($userId);
            if (! $user) {
                $this->error("User ID {$userId} not found");

                return null;
            }

            return LlmService::forUser($user);
        }

        // Default: use first user's default provider
        $user = User::first();
        if (! $user) {
            return null;
        }

        return LlmService::forUser($user);
    }
}
