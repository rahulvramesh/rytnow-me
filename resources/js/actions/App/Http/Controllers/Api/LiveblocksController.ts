import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\LiveblocksController::auth
* @see app/Http/Controllers/Api/LiveblocksController.php:16
* @route '/api/liveblocks-auth'
*/
export const auth = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: auth.url(options),
    method: 'post',
})

auth.definition = {
    methods: ["post"],
    url: '/api/liveblocks-auth',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\LiveblocksController::auth
* @see app/Http/Controllers/Api/LiveblocksController.php:16
* @route '/api/liveblocks-auth'
*/
auth.url = (options?: RouteQueryOptions) => {
    return auth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\LiveblocksController::auth
* @see app/Http/Controllers/Api/LiveblocksController.php:16
* @route '/api/liveblocks-auth'
*/
auth.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: auth.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\LiveblocksController::auth
* @see app/Http/Controllers/Api/LiveblocksController.php:16
* @route '/api/liveblocks-auth'
*/
const authForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: auth.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\LiveblocksController::auth
* @see app/Http/Controllers/Api/LiveblocksController.php:16
* @route '/api/liveblocks-auth'
*/
authForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: auth.url(options),
    method: 'post',
})

auth.form = authForm

const LiveblocksController = { auth }

export default LiveblocksController