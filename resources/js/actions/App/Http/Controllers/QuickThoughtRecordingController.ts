import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::store
* @see app/Http/Controllers/QuickThoughtRecordingController.php:15
* @route '/quick-thoughts/{quickThought}/recordings'
*/
export const store = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/quick-thoughts/{quickThought}/recordings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::store
* @see app/Http/Controllers/QuickThoughtRecordingController.php:15
* @route '/quick-thoughts/{quickThought}/recordings'
*/
store.url = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{quickThought}', parsedArgs.quickThought.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::store
* @see app/Http/Controllers/QuickThoughtRecordingController.php:15
* @route '/quick-thoughts/{quickThought}/recordings'
*/
store.post = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::store
* @see app/Http/Controllers/QuickThoughtRecordingController.php:15
* @route '/quick-thoughts/{quickThought}/recordings'
*/
const storeForm = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::store
* @see app/Http/Controllers/QuickThoughtRecordingController.php:15
* @route '/quick-thoughts/{quickThought}/recordings'
*/
storeForm.post = (args: { quickThought: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::stream
* @see app/Http/Controllers/QuickThoughtRecordingController.php:43
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
export const stream = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

stream.definition = {
    methods: ["get","head"],
    url: '/quick-thoughts/{quickThought}/recordings/{recording}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::stream
* @see app/Http/Controllers/QuickThoughtRecordingController.php:43
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
stream.url = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            quickThought: args[0],
            recording: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        quickThought: typeof args.quickThought === 'object'
        ? args.quickThought.id
        : args.quickThought,
        recording: typeof args.recording === 'object'
        ? args.recording.id
        : args.recording,
    }

    return stream.definition.url
            .replace('{quickThought}', parsedArgs.quickThought.toString())
            .replace('{recording}', parsedArgs.recording.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::stream
* @see app/Http/Controllers/QuickThoughtRecordingController.php:43
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
stream.get = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::stream
* @see app/Http/Controllers/QuickThoughtRecordingController.php:43
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
stream.head = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stream.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::stream
* @see app/Http/Controllers/QuickThoughtRecordingController.php:43
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
const streamForm = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::stream
* @see app/Http/Controllers/QuickThoughtRecordingController.php:43
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
streamForm.get = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::stream
* @see app/Http/Controllers/QuickThoughtRecordingController.php:43
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
streamForm.head = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

stream.form = streamForm

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::destroy
* @see app/Http/Controllers/QuickThoughtRecordingController.php:66
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
export const destroy = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/quick-thoughts/{quickThought}/recordings/{recording}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::destroy
* @see app/Http/Controllers/QuickThoughtRecordingController.php:66
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
destroy.url = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            quickThought: args[0],
            recording: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        quickThought: typeof args.quickThought === 'object'
        ? args.quickThought.id
        : args.quickThought,
        recording: typeof args.recording === 'object'
        ? args.recording.id
        : args.recording,
    }

    return destroy.definition.url
            .replace('{quickThought}', parsedArgs.quickThought.toString())
            .replace('{recording}', parsedArgs.recording.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::destroy
* @see app/Http/Controllers/QuickThoughtRecordingController.php:66
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
destroy.delete = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::destroy
* @see app/Http/Controllers/QuickThoughtRecordingController.php:66
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
const destroyForm = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\QuickThoughtRecordingController::destroy
* @see app/Http/Controllers/QuickThoughtRecordingController.php:66
* @route '/quick-thoughts/{quickThought}/recordings/{recording}'
*/
destroyForm.delete = (args: { quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } } | [quickThought: string | number | { id: string | number }, recording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const QuickThoughtRecordingController = { store, stream, destroy }

export default QuickThoughtRecordingController