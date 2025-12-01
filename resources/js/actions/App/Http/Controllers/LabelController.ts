import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LabelController::attachToTask
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
export const attachToTask = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attachToTask.url(args, options),
    method: 'post',
})

attachToTask.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/labels',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LabelController::attachToTask
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
attachToTask.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
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

    return attachToTask.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LabelController::attachToTask
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
attachToTask.post = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attachToTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabelController::attachToTask
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
const attachToTaskForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attachToTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabelController::attachToTask
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
attachToTaskForm.post = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attachToTask.url(args, options),
    method: 'post',
})

attachToTask.form = attachToTaskForm

/**
* @see \App\Http\Controllers\LabelController::index
* @see app/Http/Controllers/LabelController.php:17
* @route '/projects/{project}/labels'
*/
export const index = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/labels',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LabelController::index
* @see app/Http/Controllers/LabelController.php:17
* @route '/projects/{project}/labels'
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
* @see \App\Http\Controllers\LabelController::index
* @see app/Http/Controllers/LabelController.php:17
* @route '/projects/{project}/labels'
*/
index.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LabelController::index
* @see app/Http/Controllers/LabelController.php:17
* @route '/projects/{project}/labels'
*/
index.head = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LabelController::index
* @see app/Http/Controllers/LabelController.php:17
* @route '/projects/{project}/labels'
*/
const indexForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LabelController::index
* @see app/Http/Controllers/LabelController.php:17
* @route '/projects/{project}/labels'
*/
indexForm.get = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LabelController::index
* @see app/Http/Controllers/LabelController.php:17
* @route '/projects/{project}/labels'
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
* @see \App\Http\Controllers\LabelController::store
* @see app/Http/Controllers/LabelController.php:24
* @route '/projects/{project}/labels'
*/
export const store = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/labels',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LabelController::store
* @see app/Http/Controllers/LabelController.php:24
* @route '/projects/{project}/labels'
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
* @see \App\Http\Controllers\LabelController::store
* @see app/Http/Controllers/LabelController.php:24
* @route '/projects/{project}/labels'
*/
store.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabelController::store
* @see app/Http/Controllers/LabelController.php:24
* @route '/projects/{project}/labels'
*/
const storeForm = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabelController::store
* @see app/Http/Controllers/LabelController.php:24
* @route '/projects/{project}/labels'
*/
storeForm.post = (args: { project: string | number | { id: string | number } } | [project: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\LabelController::update
* @see app/Http/Controllers/LabelController.php:42
* @route '/projects/{project}/labels/{label}'
*/
export const update = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/labels/{label}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\LabelController::update
* @see app/Http/Controllers/LabelController.php:42
* @route '/projects/{project}/labels/{label}'
*/
update.url = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            label: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        label: typeof args.label === 'object'
        ? args.label.id
        : args.label,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{label}', parsedArgs.label.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LabelController::update
* @see app/Http/Controllers/LabelController.php:42
* @route '/projects/{project}/labels/{label}'
*/
update.put = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\LabelController::update
* @see app/Http/Controllers/LabelController.php:42
* @route '/projects/{project}/labels/{label}'
*/
const updateForm = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabelController::update
* @see app/Http/Controllers/LabelController.php:42
* @route '/projects/{project}/labels/{label}'
*/
updateForm.put = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LabelController::destroy
* @see app/Http/Controllers/LabelController.php:60
* @route '/projects/{project}/labels/{label}'
*/
export const destroy = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/labels/{label}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LabelController::destroy
* @see app/Http/Controllers/LabelController.php:60
* @route '/projects/{project}/labels/{label}'
*/
destroy.url = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            label: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        label: typeof args.label === 'object'
        ? args.label.id
        : args.label,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{label}', parsedArgs.label.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LabelController::destroy
* @see app/Http/Controllers/LabelController.php:60
* @route '/projects/{project}/labels/{label}'
*/
destroy.delete = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LabelController::destroy
* @see app/Http/Controllers/LabelController.php:60
* @route '/projects/{project}/labels/{label}'
*/
const destroyForm = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabelController::destroy
* @see app/Http/Controllers/LabelController.php:60
* @route '/projects/{project}/labels/{label}'
*/
destroyForm.delete = (args: { project: string | number | { id: string | number }, label: string | number | { id: string | number } } | [project: string | number | { id: string | number }, label: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const LabelController = { attachToTask, index, store, update, destroy }

export default LabelController