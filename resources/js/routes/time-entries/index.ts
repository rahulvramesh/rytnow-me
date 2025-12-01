import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::index
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:12
* @route '/api/v1/tasks/{task}/time-entries'
*/
export const index = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/tasks/{task}/time-entries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::index
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:12
* @route '/api/v1/tasks/{task}/time-entries'
*/
index.url = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return index.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::index
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:12
* @route '/api/v1/tasks/{task}/time-entries'
*/
index.get = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::index
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:12
* @route '/api/v1/tasks/{task}/time-entries'
*/
index.head = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::index
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:12
* @route '/api/v1/tasks/{task}/time-entries'
*/
const indexForm = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::index
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:12
* @route '/api/v1/tasks/{task}/time-entries'
*/
indexForm.get = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::index
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:12
* @route '/api/v1/tasks/{task}/time-entries'
*/
indexForm.head = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::store
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:26
* @route '/api/v1/tasks/{task}/time-entries'
*/
export const store = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/tasks/{task}/time-entries',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::store
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:26
* @route '/api/v1/tasks/{task}/time-entries'
*/
store.url = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { task: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { task: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            task: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return store.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::store
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:26
* @route '/api/v1/tasks/{task}/time-entries'
*/
store.post = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::store
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:26
* @route '/api/v1/tasks/{task}/time-entries'
*/
const storeForm = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::store
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:26
* @route '/api/v1/tasks/{task}/time-entries'
*/
storeForm.post = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::show
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:46
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
export const show = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/tasks/{task}/time-entries/{time_entry}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::show
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:46
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
show.url = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            time_entry: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        time_entry: args.time_entry,
    }

    return show.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{time_entry}', parsedArgs.time_entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::show
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:46
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
show.get = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::show
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:46
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
show.head = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::show
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:46
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
const showForm = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::show
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:46
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
showForm.get = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::show
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:46
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
showForm.head = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::update
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:55
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
export const update = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/tasks/{task}/time-entries/{time_entry}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::update
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:55
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
update.url = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            time_entry: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        time_entry: args.time_entry,
    }

    return update.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{time_entry}', parsedArgs.time_entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::update
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:55
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
update.put = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::update
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:55
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
update.patch = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::update
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:55
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
const updateForm = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::update
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:55
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
updateForm.put = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::update
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:55
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
updateForm.patch = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::destroy
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:78
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
export const destroy = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/tasks/{task}/time-entries/{time_entry}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::destroy
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:78
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
destroy.url = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            time_entry: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        time_entry: args.time_entry,
    }

    return destroy.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{time_entry}', parsedArgs.time_entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::destroy
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:78
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
destroy.delete = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::destroy
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:78
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
const destroyForm = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TimeEntryController::destroy
* @see app/Http/Controllers/Api/V1/TimeEntryController.php:78
* @route '/api/v1/tasks/{task}/time-entries/{time_entry}'
*/
destroyForm.delete = (args: { task: number | { id: number }, time_entry: string | number } | [task: number | { id: number }, time_entry: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const timeEntries = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default timeEntries