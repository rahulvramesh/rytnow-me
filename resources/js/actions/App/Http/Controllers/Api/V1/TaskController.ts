import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\TaskController::index
* @see app/Http/Controllers/Api/V1/TaskController.php:11
* @route '/api/v1/projects/{project}/tasks'
*/
export const index = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/projects/{project}/tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\TaskController::index
* @see app/Http/Controllers/Api/V1/TaskController.php:11
* @route '/api/v1/projects/{project}/tasks'
*/
index.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { project: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            project: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
    }

    return index.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TaskController::index
* @see app/Http/Controllers/Api/V1/TaskController.php:11
* @route '/api/v1/projects/{project}/tasks'
*/
index.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::index
* @see app/Http/Controllers/Api/V1/TaskController.php:11
* @route '/api/v1/projects/{project}/tasks'
*/
index.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::index
* @see app/Http/Controllers/Api/V1/TaskController.php:11
* @route '/api/v1/projects/{project}/tasks'
*/
const indexForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::index
* @see app/Http/Controllers/Api/V1/TaskController.php:11
* @route '/api/v1/projects/{project}/tasks'
*/
indexForm.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::index
* @see app/Http/Controllers/Api/V1/TaskController.php:11
* @route '/api/v1/projects/{project}/tasks'
*/
indexForm.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\TaskController::store
* @see app/Http/Controllers/Api/V1/TaskController.php:29
* @route '/api/v1/projects/{project}/tasks'
*/
export const store = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/projects/{project}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\TaskController::store
* @see app/Http/Controllers/Api/V1/TaskController.php:29
* @route '/api/v1/projects/{project}/tasks'
*/
store.url = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { project: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            project: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
    }

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TaskController::store
* @see app/Http/Controllers/Api/V1/TaskController.php:29
* @route '/api/v1/projects/{project}/tasks'
*/
store.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::store
* @see app/Http/Controllers/Api/V1/TaskController.php:29
* @route '/api/v1/projects/{project}/tasks'
*/
const storeForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::store
* @see app/Http/Controllers/Api/V1/TaskController.php:29
* @route '/api/v1/projects/{project}/tasks'
*/
storeForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\TaskController::show
* @see app/Http/Controllers/Api/V1/TaskController.php:59
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
export const show = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/projects/{project}/tasks/{task}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\TaskController::show
* @see app/Http/Controllers/Api/V1/TaskController.php:59
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
show.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TaskController::show
* @see app/Http/Controllers/Api/V1/TaskController.php:59
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
show.get = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::show
* @see app/Http/Controllers/Api/V1/TaskController.php:59
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
show.head = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::show
* @see app/Http/Controllers/Api/V1/TaskController.php:59
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
const showForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::show
* @see app/Http/Controllers/Api/V1/TaskController.php:59
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
showForm.get = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::show
* @see app/Http/Controllers/Api/V1/TaskController.php:59
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
showForm.head = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\TaskController::update
* @see app/Http/Controllers/Api/V1/TaskController.php:73
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
export const update = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/projects/{project}/tasks/{task}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\TaskController::update
* @see app/Http/Controllers/Api/V1/TaskController.php:73
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
update.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TaskController::update
* @see app/Http/Controllers/Api/V1/TaskController.php:73
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
update.put = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::update
* @see app/Http/Controllers/Api/V1/TaskController.php:73
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
update.patch = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::update
* @see app/Http/Controllers/Api/V1/TaskController.php:73
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
const updateForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::update
* @see app/Http/Controllers/Api/V1/TaskController.php:73
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
updateForm.put = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::update
* @see app/Http/Controllers/Api/V1/TaskController.php:73
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
updateForm.patch = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\TaskController::destroy
* @see app/Http/Controllers/Api/V1/TaskController.php:100
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
export const destroy = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/projects/{project}/tasks/{task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\TaskController::destroy
* @see app/Http/Controllers/Api/V1/TaskController.php:100
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
destroy.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TaskController::destroy
* @see app/Http/Controllers/Api/V1/TaskController.php:100
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
destroy.delete = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::destroy
* @see app/Http/Controllers/Api/V1/TaskController.php:100
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
const destroyForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::destroy
* @see app/Http/Controllers/Api/V1/TaskController.php:100
* @route '/api/v1/projects/{project}/tasks/{task}'
*/
destroyForm.delete = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\TaskController::updateStatus
* @see app/Http/Controllers/Api/V1/TaskController.php:111
* @route '/api/v1/projects/{project}/tasks/{task}/status'
*/
export const updateStatus = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/api/v1/projects/{project}/tasks/{task}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\V1\TaskController::updateStatus
* @see app/Http/Controllers/Api/V1/TaskController.php:111
* @route '/api/v1/projects/{project}/tasks/{task}/status'
*/
updateStatus.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return updateStatus.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\TaskController::updateStatus
* @see app/Http/Controllers/Api/V1/TaskController.php:111
* @route '/api/v1/projects/{project}/tasks/{task}/status'
*/
updateStatus.patch = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::updateStatus
* @see app/Http/Controllers/Api/V1/TaskController.php:111
* @route '/api/v1/projects/{project}/tasks/{task}/status'
*/
const updateStatusForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\TaskController::updateStatus
* @see app/Http/Controllers/Api/V1/TaskController.php:111
* @route '/api/v1/projects/{project}/tasks/{task}/status'
*/
updateStatusForm.patch = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateStatus.form = updateStatusForm

const TaskController = { index, store, show, update, destroy, updateStatus }

export default TaskController