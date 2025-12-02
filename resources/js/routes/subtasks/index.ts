import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::index
* @see app/Http/Controllers/Api/V1/SubtaskController.php:11
* @route '/api/v1/tasks/{task}/subtasks'
*/
export const index = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/tasks/{task}/subtasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::index
* @see app/Http/Controllers/Api/V1/SubtaskController.php:11
* @route '/api/v1/tasks/{task}/subtasks'
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
* @see \App\Http\Controllers\Api\V1\SubtaskController::index
* @see app/Http/Controllers/Api/V1/SubtaskController.php:11
* @route '/api/v1/tasks/{task}/subtasks'
*/
index.get = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::index
* @see app/Http/Controllers/Api/V1/SubtaskController.php:11
* @route '/api/v1/tasks/{task}/subtasks'
*/
index.head = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::index
* @see app/Http/Controllers/Api/V1/SubtaskController.php:11
* @route '/api/v1/tasks/{task}/subtasks'
*/
const indexForm = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::index
* @see app/Http/Controllers/Api/V1/SubtaskController.php:11
* @route '/api/v1/tasks/{task}/subtasks'
*/
indexForm.get = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::index
* @see app/Http/Controllers/Api/V1/SubtaskController.php:11
* @route '/api/v1/tasks/{task}/subtasks'
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
* @see \App\Http\Controllers\Api\V1\SubtaskController::store
* @see app/Http/Controllers/Api/V1/SubtaskController.php:25
* @route '/api/v1/tasks/{task}/subtasks'
*/
export const store = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/tasks/{task}/subtasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::store
* @see app/Http/Controllers/Api/V1/SubtaskController.php:25
* @route '/api/v1/tasks/{task}/subtasks'
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
* @see \App\Http\Controllers\Api\V1\SubtaskController::store
* @see app/Http/Controllers/Api/V1/SubtaskController.php:25
* @route '/api/v1/tasks/{task}/subtasks'
*/
store.post = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::store
* @see app/Http/Controllers/Api/V1/SubtaskController.php:25
* @route '/api/v1/tasks/{task}/subtasks'
*/
const storeForm = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::store
* @see app/Http/Controllers/Api/V1/SubtaskController.php:25
* @route '/api/v1/tasks/{task}/subtasks'
*/
storeForm.post = (args: { task: number | { id: number } } | [task: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::show
* @see app/Http/Controllers/Api/V1/SubtaskController.php:43
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
export const show = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/tasks/{task}/subtasks/{subtask}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::show
* @see app/Http/Controllers/Api/V1/SubtaskController.php:43
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
show.url = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            subtask: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        subtask: typeof args.subtask === 'object'
        ? args.subtask.id
        : args.subtask,
    }

    return show.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{subtask}', parsedArgs.subtask.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::show
* @see app/Http/Controllers/Api/V1/SubtaskController.php:43
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
show.get = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::show
* @see app/Http/Controllers/Api/V1/SubtaskController.php:43
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
show.head = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::show
* @see app/Http/Controllers/Api/V1/SubtaskController.php:43
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
const showForm = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::show
* @see app/Http/Controllers/Api/V1/SubtaskController.php:43
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
showForm.get = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::show
* @see app/Http/Controllers/Api/V1/SubtaskController.php:43
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
showForm.head = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\SubtaskController::update
* @see app/Http/Controllers/Api/V1/SubtaskController.php:52
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
export const update = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/tasks/{task}/subtasks/{subtask}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::update
* @see app/Http/Controllers/Api/V1/SubtaskController.php:52
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
update.url = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            subtask: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        subtask: typeof args.subtask === 'object'
        ? args.subtask.id
        : args.subtask,
    }

    return update.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{subtask}', parsedArgs.subtask.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::update
* @see app/Http/Controllers/Api/V1/SubtaskController.php:52
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
update.put = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::update
* @see app/Http/Controllers/Api/V1/SubtaskController.php:52
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
update.patch = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::update
* @see app/Http/Controllers/Api/V1/SubtaskController.php:52
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
const updateForm = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::update
* @see app/Http/Controllers/Api/V1/SubtaskController.php:52
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
updateForm.put = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::update
* @see app/Http/Controllers/Api/V1/SubtaskController.php:52
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
updateForm.patch = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\SubtaskController::destroy
* @see app/Http/Controllers/Api/V1/SubtaskController.php:70
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
export const destroy = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/tasks/{task}/subtasks/{subtask}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::destroy
* @see app/Http/Controllers/Api/V1/SubtaskController.php:70
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
destroy.url = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            subtask: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        subtask: typeof args.subtask === 'object'
        ? args.subtask.id
        : args.subtask,
    }

    return destroy.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{subtask}', parsedArgs.subtask.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::destroy
* @see app/Http/Controllers/Api/V1/SubtaskController.php:70
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
destroy.delete = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::destroy
* @see app/Http/Controllers/Api/V1/SubtaskController.php:70
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
const destroyForm = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\SubtaskController::destroy
* @see app/Http/Controllers/Api/V1/SubtaskController.php:70
* @route '/api/v1/tasks/{task}/subtasks/{subtask}'
*/
destroyForm.delete = (args: { task: number | { id: number }, subtask: number | { id: number } } | [task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const subtasks = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default subtasks