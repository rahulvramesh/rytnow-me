import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:11
* @route '/api/v1/workspaces/{workspace}/projects'
*/
export const index = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/workspaces/{workspace}/projects',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:11
* @route '/api/v1/workspaces/{workspace}/projects'
*/
index.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workspace: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
    }

    return index.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:11
* @route '/api/v1/workspaces/{workspace}/projects'
*/
index.get = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:11
* @route '/api/v1/workspaces/{workspace}/projects'
*/
index.head = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:11
* @route '/api/v1/workspaces/{workspace}/projects'
*/
const indexForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:11
* @route '/api/v1/workspaces/{workspace}/projects'
*/
indexForm.get = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::index
* @see app/Http/Controllers/Api/V1/ProjectController.php:11
* @route '/api/v1/workspaces/{workspace}/projects'
*/
indexForm.head = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:27
* @route '/api/v1/workspaces/{workspace}/projects'
*/
export const store = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/workspaces/{workspace}/projects',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:27
* @route '/api/v1/workspaces/{workspace}/projects'
*/
store.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { workspace: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
    }

    return store.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:27
* @route '/api/v1/workspaces/{workspace}/projects'
*/
store.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:27
* @route '/api/v1/workspaces/{workspace}/projects'
*/
const storeForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::store
* @see app/Http/Controllers/Api/V1/ProjectController.php:27
* @route '/api/v1/workspaces/{workspace}/projects'
*/
storeForm.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:46
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
export const show = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/workspaces/{workspace}/projects/{project}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:46
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
show.url = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            project: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
    }

    return show.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:46
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
show.get = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:46
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
show.head = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:46
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
const showForm = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:46
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
showForm.get = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::show
* @see app/Http/Controllers/Api/V1/ProjectController.php:46
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
showForm.head = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:55
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
export const update = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/workspaces/{workspace}/projects/{project}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:55
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
update.url = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            project: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
    }

    return update.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:55
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
update.put = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:55
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
update.patch = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:55
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
const updateForm = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:55
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
updateForm.put = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::update
* @see app/Http/Controllers/Api/V1/ProjectController.php:55
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
updateForm.patch = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:74
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
export const destroy = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/workspaces/{workspace}/projects/{project}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:74
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
destroy.url = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            project: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
    }

    return destroy.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:74
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
destroy.delete = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:74
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
const destroyForm = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\ProjectController::destroy
* @see app/Http/Controllers/Api/V1/ProjectController.php:74
* @route '/api/v1/workspaces/{workspace}/projects/{project}'
*/
destroyForm.delete = (args: { workspace: string | number | { id: string | number }, project: string | number | { id: string | number } } | [workspace: string | number | { id: string | number }, project: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const ProjectController = { index, store, show, update, destroy }

export default ProjectController