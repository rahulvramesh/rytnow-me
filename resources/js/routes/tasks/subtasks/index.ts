import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SubtaskController::store
* @see app/Http/Controllers/SubtaskController.php:13
* @route '/projects/{project}/tasks/{task}/subtasks'
*/
export const store = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/subtasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubtaskController::store
* @see app/Http/Controllers/SubtaskController.php:13
* @route '/projects/{project}/tasks/{task}/subtasks'
*/
store.url = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubtaskController::store
* @see app/Http/Controllers/SubtaskController.php:13
* @route '/projects/{project}/tasks/{task}/subtasks'
*/
store.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubtaskController::store
* @see app/Http/Controllers/SubtaskController.php:13
* @route '/projects/{project}/tasks/{task}/subtasks'
*/
const storeForm = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubtaskController::store
* @see app/Http/Controllers/SubtaskController.php:13
* @route '/projects/{project}/tasks/{task}/subtasks'
*/
storeForm.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\SubtaskController::update
* @see app/Http/Controllers/SubtaskController.php:43
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
export const update = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/tasks/{task}/subtasks/{subtask}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SubtaskController::update
* @see app/Http/Controllers/SubtaskController.php:43
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
update.url = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
            subtask: args[2],
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
        subtask: typeof args.subtask === 'object'
        ? args.subtask.id
        : args.subtask,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace('{subtask}', parsedArgs.subtask.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubtaskController::update
* @see app/Http/Controllers/SubtaskController.php:43
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
update.put = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\SubtaskController::update
* @see app/Http/Controllers/SubtaskController.php:43
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
const updateForm = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubtaskController::update
* @see app/Http/Controllers/SubtaskController.php:43
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
updateForm.put = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SubtaskController::destroy
* @see app/Http/Controllers/SubtaskController.php:76
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
export const destroy = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/tasks/{task}/subtasks/{subtask}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SubtaskController::destroy
* @see app/Http/Controllers/SubtaskController.php:76
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
destroy.url = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
            subtask: args[2],
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
        subtask: typeof args.subtask === 'object'
        ? args.subtask.id
        : args.subtask,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace('{subtask}', parsedArgs.subtask.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubtaskController::destroy
* @see app/Http/Controllers/SubtaskController.php:76
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
destroy.delete = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\SubtaskController::destroy
* @see app/Http/Controllers/SubtaskController.php:76
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
const destroyForm = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubtaskController::destroy
* @see app/Http/Controllers/SubtaskController.php:76
* @route '/projects/{project}/tasks/{task}/subtasks/{subtask}'
*/
destroyForm.delete = (args: { project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, subtask: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SubtaskController::reorder
* @see app/Http/Controllers/SubtaskController.php:89
* @route '/projects/{project}/tasks/{task}/subtasks/reorder'
*/
export const reorder = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/subtasks/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubtaskController::reorder
* @see app/Http/Controllers/SubtaskController.php:89
* @route '/projects/{project}/tasks/{task}/subtasks/reorder'
*/
reorder.url = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return reorder.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubtaskController::reorder
* @see app/Http/Controllers/SubtaskController.php:89
* @route '/projects/{project}/tasks/{task}/subtasks/reorder'
*/
reorder.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubtaskController::reorder
* @see app/Http/Controllers/SubtaskController.php:89
* @route '/projects/{project}/tasks/{task}/subtasks/reorder'
*/
const reorderForm = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubtaskController::reorder
* @see app/Http/Controllers/SubtaskController.php:89
* @route '/projects/{project}/tasks/{task}/subtasks/reorder'
*/
reorderForm.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

reorder.form = reorderForm

const subtasks = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    reorder: Object.assign(reorder, reorder),
}

export default subtasks