import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\QuickThoughtController::index
* @see app/Http/Controllers/QuickThoughtController.php:17
* @route '/quick-thoughts'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/quick-thoughts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\QuickThoughtController::index
* @see app/Http/Controllers/QuickThoughtController.php:17
* @route '/quick-thoughts'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuickThoughtController::index
* @see app/Http/Controllers/QuickThoughtController.php:17
* @route '/quick-thoughts'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::index
* @see app/Http/Controllers/QuickThoughtController.php:17
* @route '/quick-thoughts'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::index
* @see app/Http/Controllers/QuickThoughtController.php:17
* @route '/quick-thoughts'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::index
* @see app/Http/Controllers/QuickThoughtController.php:17
* @route '/quick-thoughts'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::index
* @see app/Http/Controllers/QuickThoughtController.php:17
* @route '/quick-thoughts'
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

/**
* @see \App\Http\Controllers\QuickThoughtController::store
* @see app/Http/Controllers/QuickThoughtController.php:36
* @route '/quick-thoughts'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/quick-thoughts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\QuickThoughtController::store
* @see app/Http/Controllers/QuickThoughtController.php:36
* @route '/quick-thoughts'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuickThoughtController::store
* @see app/Http/Controllers/QuickThoughtController.php:36
* @route '/quick-thoughts'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::store
* @see app/Http/Controllers/QuickThoughtController.php:36
* @route '/quick-thoughts'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::store
* @see app/Http/Controllers/QuickThoughtController.php:36
* @route '/quick-thoughts'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\QuickThoughtController::update
* @see app/Http/Controllers/QuickThoughtController.php:73
* @route '/quick-thoughts/{quickThought}'
*/
export const update = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/quick-thoughts/{quickThought}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\QuickThoughtController::update
* @see app/Http/Controllers/QuickThoughtController.php:73
* @route '/quick-thoughts/{quickThought}'
*/
update.url = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { quickThought: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { quickThought: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            quickThought: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        quickThought: typeof args.quickThought === 'object'
        ? args.quickThought.id
        : args.quickThought,
    }

    return update.definition.url
            .replace('{quickThought}', parsedArgs.quickThought.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuickThoughtController::update
* @see app/Http/Controllers/QuickThoughtController.php:73
* @route '/quick-thoughts/{quickThought}'
*/
update.put = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::update
* @see app/Http/Controllers/QuickThoughtController.php:73
* @route '/quick-thoughts/{quickThought}'
*/
const updateForm = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::update
* @see app/Http/Controllers/QuickThoughtController.php:73
* @route '/quick-thoughts/{quickThought}'
*/
updateForm.put = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\QuickThoughtController::destroy
* @see app/Http/Controllers/QuickThoughtController.php:91
* @route '/quick-thoughts/{quickThought}'
*/
export const destroy = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/quick-thoughts/{quickThought}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\QuickThoughtController::destroy
* @see app/Http/Controllers/QuickThoughtController.php:91
* @route '/quick-thoughts/{quickThought}'
*/
destroy.url = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { quickThought: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { quickThought: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            quickThought: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        quickThought: typeof args.quickThought === 'object'
        ? args.quickThought.id
        : args.quickThought,
    }

    return destroy.definition.url
            .replace('{quickThought}', parsedArgs.quickThought.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuickThoughtController::destroy
* @see app/Http/Controllers/QuickThoughtController.php:91
* @route '/quick-thoughts/{quickThought}'
*/
destroy.delete = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::destroy
* @see app/Http/Controllers/QuickThoughtController.php:91
* @route '/quick-thoughts/{quickThought}'
*/
const destroyForm = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::destroy
* @see app/Http/Controllers/QuickThoughtController.php:91
* @route '/quick-thoughts/{quickThought}'
*/
destroyForm.delete = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\QuickThoughtController::convertToTask
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
export const convertToTask = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertToTask.url(args, options),
    method: 'post',
})

convertToTask.definition = {
    methods: ["post"],
    url: '/quick-thoughts/{quickThought}/convert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\QuickThoughtController::convertToTask
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
convertToTask.url = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { quickThought: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { quickThought: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            quickThought: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        quickThought: typeof args.quickThought === 'object'
        ? args.quickThought.id
        : args.quickThought,
    }

    return convertToTask.definition.url
            .replace('{quickThought}', parsedArgs.quickThought.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuickThoughtController::convertToTask
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
convertToTask.post = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertToTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::convertToTask
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
const convertToTaskForm = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convertToTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::convertToTask
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
convertToTaskForm.post = (args: { quickThought: number | { id: number } } | [quickThought: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convertToTask.url(args, options),
    method: 'post',
})

convertToTask.form = convertToTaskForm

const QuickThoughtController = { index, store, update, destroy, convertToTask }

export default QuickThoughtController