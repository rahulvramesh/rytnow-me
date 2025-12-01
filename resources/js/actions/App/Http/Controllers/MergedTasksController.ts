import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MergedTasksController::index
* @see app/Http/Controllers/MergedTasksController.php:14
* @route '/tasks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MergedTasksController::index
* @see app/Http/Controllers/MergedTasksController.php:14
* @route '/tasks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MergedTasksController::index
* @see app/Http/Controllers/MergedTasksController.php:14
* @route '/tasks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MergedTasksController::index
* @see app/Http/Controllers/MergedTasksController.php:14
* @route '/tasks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MergedTasksController::index
* @see app/Http/Controllers/MergedTasksController.php:14
* @route '/tasks'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MergedTasksController::index
* @see app/Http/Controllers/MergedTasksController.php:14
* @route '/tasks'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MergedTasksController::index
* @see app/Http/Controllers/MergedTasksController.php:14
* @route '/tasks'
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

const MergedTasksController = { index }

export default MergedTasksController