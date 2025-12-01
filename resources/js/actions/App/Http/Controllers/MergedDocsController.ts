import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MergedDocsController::index
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/docs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MergedDocsController::index
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MergedDocsController::index
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MergedDocsController::index
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MergedDocsController::index
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MergedDocsController::index
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MergedDocsController::index
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
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

const MergedDocsController = { index }

export default MergedDocsController