import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:19
* @route '/projects/{project}/tasks/{task}/comments'
*/
export const store = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:19
* @route '/projects/{project}/tasks/{task}/comments'
*/
store.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:19
* @route '/projects/{project}/tasks/{task}/comments'
*/
store.post = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:19
* @route '/projects/{project}/tasks/{task}/comments'
*/
const storeForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:19
* @route '/projects/{project}/tasks/{task}/comments'
*/
storeForm.post = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:38
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
export const update = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/tasks/{task}/comments/{comment}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:38
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
update.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
            comment: args[2],
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
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:38
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
update.put = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:38
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
const updateForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:38
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
updateForm.put = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:58
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
export const destroy = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/tasks/{task}/comments/{comment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:58
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
destroy.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
            comment: args[2],
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
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:58
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
destroy.delete = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:58
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
const destroyForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:58
* @route '/projects/{project}/tasks/{task}/comments/{comment}'
*/
destroyForm.delete = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const CommentController = { store, update, destroy }

export default CommentController