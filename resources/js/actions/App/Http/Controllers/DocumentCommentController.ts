import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentCommentController::index
* @see app/Http/Controllers/DocumentCommentController.php:26
* @route '/projects/{project}/docs/{document}/comments'
*/
export const index = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/docs/{document}/comments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentCommentController::index
* @see app/Http/Controllers/DocumentCommentController.php:26
* @route '/projects/{project}/docs/{document}/comments'
*/
index.url = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            document: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
    }

    return index.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentCommentController::index
* @see app/Http/Controllers/DocumentCommentController.php:26
* @route '/projects/{project}/docs/{document}/comments'
*/
index.get = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::index
* @see app/Http/Controllers/DocumentCommentController.php:26
* @route '/projects/{project}/docs/{document}/comments'
*/
index.head = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::index
* @see app/Http/Controllers/DocumentCommentController.php:26
* @route '/projects/{project}/docs/{document}/comments'
*/
const indexForm = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::index
* @see app/Http/Controllers/DocumentCommentController.php:26
* @route '/projects/{project}/docs/{document}/comments'
*/
indexForm.get = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::index
* @see app/Http/Controllers/DocumentCommentController.php:26
* @route '/projects/{project}/docs/{document}/comments'
*/
indexForm.head = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DocumentCommentController::store
* @see app/Http/Controllers/DocumentCommentController.php:55
* @route '/projects/{project}/docs/{document}/comments'
*/
export const store = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/docs/{document}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentCommentController::store
* @see app/Http/Controllers/DocumentCommentController.php:55
* @route '/projects/{project}/docs/{document}/comments'
*/
store.url = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            document: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
    }

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentCommentController::store
* @see app/Http/Controllers/DocumentCommentController.php:55
* @route '/projects/{project}/docs/{document}/comments'
*/
store.post = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::store
* @see app/Http/Controllers/DocumentCommentController.php:55
* @route '/projects/{project}/docs/{document}/comments'
*/
const storeForm = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::store
* @see app/Http/Controllers/DocumentCommentController.php:55
* @route '/projects/{project}/docs/{document}/comments'
*/
storeForm.post = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DocumentCommentController::update
* @see app/Http/Controllers/DocumentCommentController.php:107
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
export const update = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/docs/{document}/comments/{comment}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DocumentCommentController::update
* @see app/Http/Controllers/DocumentCommentController.php:107
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
update.url = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            document: args[1],
            comment: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentCommentController::update
* @see app/Http/Controllers/DocumentCommentController.php:107
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
update.put = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::update
* @see app/Http/Controllers/DocumentCommentController.php:107
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
const updateForm = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::update
* @see app/Http/Controllers/DocumentCommentController.php:107
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
updateForm.put = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DocumentCommentController::destroy
* @see app/Http/Controllers/DocumentCommentController.php:143
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
export const destroy = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/docs/{document}/comments/{comment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DocumentCommentController::destroy
* @see app/Http/Controllers/DocumentCommentController.php:143
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
destroy.url = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            document: args[1],
            comment: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentCommentController::destroy
* @see app/Http/Controllers/DocumentCommentController.php:143
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
destroy.delete = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::destroy
* @see app/Http/Controllers/DocumentCommentController.php:143
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
const destroyForm = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::destroy
* @see app/Http/Controllers/DocumentCommentController.php:143
* @route '/projects/{project}/docs/{document}/comments/{comment}'
*/
destroyForm.delete = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DocumentCommentController::resolve
* @see app/Http/Controllers/DocumentCommentController.php:167
* @route '/projects/{project}/docs/{document}/comments/{comment}/resolve'
*/
export const resolve = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

resolve.definition = {
    methods: ["patch"],
    url: '/projects/{project}/docs/{document}/comments/{comment}/resolve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\DocumentCommentController::resolve
* @see app/Http/Controllers/DocumentCommentController.php:167
* @route '/projects/{project}/docs/{document}/comments/{comment}/resolve'
*/
resolve.url = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            document: args[1],
            comment: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return resolve.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentCommentController::resolve
* @see app/Http/Controllers/DocumentCommentController.php:167
* @route '/projects/{project}/docs/{document}/comments/{comment}/resolve'
*/
resolve.patch = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resolve.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::resolve
* @see app/Http/Controllers/DocumentCommentController.php:167
* @route '/projects/{project}/docs/{document}/comments/{comment}/resolve'
*/
const resolveForm = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::resolve
* @see app/Http/Controllers/DocumentCommentController.php:167
* @route '/projects/{project}/docs/{document}/comments/{comment}/resolve'
*/
resolveForm.patch = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

resolve.form = resolveForm

/**
* @see \App\Http\Controllers\DocumentCommentController::unresolve
* @see app/Http/Controllers/DocumentCommentController.php:196
* @route '/projects/{project}/docs/{document}/comments/{comment}/unresolve'
*/
export const unresolve = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: unresolve.url(args, options),
    method: 'patch',
})

unresolve.definition = {
    methods: ["patch"],
    url: '/projects/{project}/docs/{document}/comments/{comment}/unresolve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\DocumentCommentController::unresolve
* @see app/Http/Controllers/DocumentCommentController.php:196
* @route '/projects/{project}/docs/{document}/comments/{comment}/unresolve'
*/
unresolve.url = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            document: args[1],
            comment: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        document: typeof args.document === 'object'
        ? args.document.id
        : args.document,
        comment: typeof args.comment === 'object'
        ? args.comment.id
        : args.comment,
    }

    return unresolve.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace('{comment}', parsedArgs.comment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentCommentController::unresolve
* @see app/Http/Controllers/DocumentCommentController.php:196
* @route '/projects/{project}/docs/{document}/comments/{comment}/unresolve'
*/
unresolve.patch = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: unresolve.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::unresolve
* @see app/Http/Controllers/DocumentCommentController.php:196
* @route '/projects/{project}/docs/{document}/comments/{comment}/unresolve'
*/
const unresolveForm = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unresolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentCommentController::unresolve
* @see app/Http/Controllers/DocumentCommentController.php:196
* @route '/projects/{project}/docs/{document}/comments/{comment}/unresolve'
*/
unresolveForm.patch = (args: { project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } } | [project: number | { id: number }, document: number | { id: number }, comment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unresolve.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

unresolve.form = unresolveForm

const DocumentCommentController = { index, store, update, destroy, resolve, unresolve }

export default DocumentCommentController