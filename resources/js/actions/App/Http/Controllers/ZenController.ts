import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ZenController::index
* @see app/Http/Controllers/ZenController.php:16
* @route '/zen'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/zen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ZenController::index
* @see app/Http/Controllers/ZenController.php:16
* @route '/zen'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ZenController::index
* @see app/Http/Controllers/ZenController.php:16
* @route '/zen'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ZenController::index
* @see app/Http/Controllers/ZenController.php:16
* @route '/zen'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ZenController::index
* @see app/Http/Controllers/ZenController.php:16
* @route '/zen'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ZenController::index
* @see app/Http/Controllers/ZenController.php:16
* @route '/zen'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ZenController::index
* @see app/Http/Controllers/ZenController.php:16
* @route '/zen'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const ZenController = { index }

export default ZenController