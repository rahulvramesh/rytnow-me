<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IntegrationsController extends Controller
{
    public function index(Request $request)
    {
        $tokens = $request->user()->tokens()
            ->select(['id', 'name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('settings/integrations', [
            'tokens' => $tokens,
            'apiUrl' => config('app.url') . '/api/v1',
        ]);
    }
}
