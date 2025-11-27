<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        // Create default workspace for new user
        $workspace = Workspace::create([
            'name' => 'Earth',
            'description' => 'Your default workspace',
            'color' => '#6366f1',
            'owner_id' => $user->id,
        ]);

        // Add user as owner member
        $workspace->members()->attach($user->id, [
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        // Set as current workspace
        $user->update(['current_workspace_id' => $workspace->id]);

        return $user;
    }
}
