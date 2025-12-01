import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\CommentController::index
* @see app/Http/Controllers/Api/V1/CommentController.php:11
* @route '/api/v1/tasks/{task}/comments'
*/
export const index = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/tasks/{task}/comments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\CommentController::index
* @see app/Http/Controllers/Api/V1/CommentController.php:11
* @route '/api/v1/tasks/{task}/comments'
*/
index.url = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\Api\V1\CommentController::index
* @see app/Http/Controllers/Api/V1/CommentController.php:11
* @route '/api/v1/tasks/{task}/comments'
*/
index.get = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::index
* @see app/Http/Controllers/Api/V1/CommentController.php:11
* @route '/api/v1/tasks/{task}/comments'
*/
index.head = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::index
* @see app/Http/Controllers/Api/V1/CommentController.php:11
* @route '/api/v1/tasks/{task}/comments'
*/
const indexForm = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::index
* @see app/Http/Controllers/Api/V1/CommentController.php:11
* @route '/api/v1/tasks/{task}/comments'
*/
indexForm.get = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::index
* @see app/Http/Controllers/Api/V1/CommentController.php:11
* @route '/api/v1/tasks/{task}/comments'
*/
indexForm.head = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\CommentController::store
* @see app/Http/Controllers/Api/V1/CommentController.php:25
* @route '/api/v1/tasks/{task}/comments'
*/
export const store = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/tasks/{task}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\CommentController::store
* @see app/Http/Controllers/Api/V1/CommentController.php:25
* @route '/api/v1/tasks/{task}/comments'
*/
store.url = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\Api\V1\CommentController::store
* @see app/Http/Controllers/Api/V1/CommentController.php:25
* @route '/api/v1/tasks/{task}/comments'
*/
store.post = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::store
* @see app/Http/Controllers/Api/V1/CommentController.php:25
* @route '/api/v1/tasks/{task}/comments'
*/
const storeForm = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::store
* @see app/Http/Controllers/Api/V1/CommentController.php:25
* @route '/api/v1/tasks/{task}/comments'
*/
storeForm.post = (args: { task: string | number | { id: string | number } } | [task: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\CommentController::show
* @see app/Http/Controllers/Api/V1/CommentController.php:44
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
export const show = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/tasks/{task}/comments/{comment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\CommentController::show
* @see app/Http/Controllers/Api/V1/CommentController.php:44
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
show.url = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            comment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return show.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\CommentController::show
* @see app/Http/Controllers/Api/V1/CommentController.php:44
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
show.get = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::show
* @see app/Http/Controllers/Api/V1/CommentController.php:44
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
show.head = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::show
* @see app/Http/Controllers/Api/V1/CommentController.php:44
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
const showForm = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::show
* @see app/Http/Controllers/Api/V1/CommentController.php:44
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
showForm.get = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::show
* @see app/Http/Controllers/Api/V1/CommentController.php:44
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
showForm.head = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\CommentController::update
* @see app/Http/Controllers/Api/V1/CommentController.php:53
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
export const update = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/tasks/{task}/comments/{comment}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\CommentController::update
* @see app/Http/Controllers/Api/V1/CommentController.php:53
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
update.url = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            comment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return update.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\CommentController::update
* @see app/Http/Controllers/Api/V1/CommentController.php:53
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
update.put = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::update
* @see app/Http/Controllers/Api/V1/CommentController.php:53
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
update.patch = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::update
* @see app/Http/Controllers/Api/V1/CommentController.php:53
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
const updateForm = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::update
* @see app/Http/Controllers/Api/V1/CommentController.php:53
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
updateForm.put = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::update
* @see app/Http/Controllers/Api/V1/CommentController.php:53
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
updateForm.patch = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\CommentController::destroy
* @see app/Http/Controllers/Api/V1/CommentController.php:73
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
export const destroy = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/tasks/{task}/comments/{comment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\CommentController::destroy
* @see app/Http/Controllers/Api/V1/CommentController.php:73
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
destroy.url = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            task: args[0],
            comment: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return destroy.definition.url
            .replace('{task}', parsedArgs.task.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\CommentController::destroy
* @see app/Http/Controllers/Api/V1/CommentController.php:73
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
destroy.delete = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::destroy
* @see app/Http/Controllers/Api/V1/CommentController.php:73
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
const destroyForm = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\CommentController::destroy
* @see app/Http/Controllers/Api/V1/CommentController.php:73
* @route '/api/v1/tasks/{task}/comments/{comment}'
*/
destroyForm.delete = (args: { task: string | number | { id: string | number }, comment: string | number | { id: string | number } } | [task: string | number | { id: string | number }, comment: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const CommentController = { index, store, show, update, destroy }

export default CommentController