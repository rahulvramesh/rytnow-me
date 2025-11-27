<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentWorkspace
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->current_workspace_id) {
            // If user has no current workspace, set their first owned workspace
            $defaultWorkspace = $user->ownedWorkspaces()->first()
                             ?? $user->workspaces()->first();

            if ($defaultWorkspace) {
                $user->update(['current_workspace_id' => $defaultWorkspace->id]);
            }
        }

        return $next($request);
    }
}
