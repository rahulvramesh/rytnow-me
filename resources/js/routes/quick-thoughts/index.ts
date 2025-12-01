import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import recordings from './recordings'
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
export const update = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
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
update.url = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
update.put = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::update
* @see app/Http/Controllers/QuickThoughtController.php:73
* @route '/quick-thoughts/{quickThought}'
*/
const updateForm = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
updateForm.put = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
export const destroy = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
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
destroy.url = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
destroy.delete = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::destroy
* @see app/Http/Controllers/QuickThoughtController.php:91
* @route '/quick-thoughts/{quickThought}'
*/
const destroyForm = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
destroyForm.delete = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\QuickThoughtController::convert
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
export const convert = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convert.url(args, options),
    method: 'post',
})

convert.definition = {
    methods: ["post"],
    url: '/quick-thoughts/{quickThought}/convert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\QuickThoughtController::convert
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
convert.url = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return convert.definition.url
            .replace('{quickThought}', parsedArgs.quickThought.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuickThoughtController::convert
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
convert.post = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convert.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::convert
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
const convertForm = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convert.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtController::convert
* @see app/Http/Controllers/QuickThoughtController.php:108
* @route '/quick-thoughts/{quickThought}/convert'
*/
convertForm.post = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: convert.url(args, options),
    method: 'post',
})

convert.form = convertForm

const quickThoughts = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    convert: Object.assign(convert, convert),
    recordings: Object.assign(recordings, recordings),
}

export default quickThoughts