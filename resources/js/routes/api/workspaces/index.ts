import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::index
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:10
* @route '/api/v1/workspaces'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/workspaces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::index
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:10
* @route '/api/v1/workspaces'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::index
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:10
* @route '/api/v1/workspaces'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::index
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:10
* @route '/api/v1/workspaces'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::index
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:10
* @route '/api/v1/workspaces'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::index
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:10
* @route '/api/v1/workspaces'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::index
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:10
* @route '/api/v1/workspaces'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::store
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:19
* @route '/api/v1/workspaces'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/workspaces',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::store
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:19
* @route '/api/v1/workspaces'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::store
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:19
* @route '/api/v1/workspaces'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::store
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:19
* @route '/api/v1/workspaces'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::store
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:19
* @route '/api/v1/workspaces'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::show
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:40
* @route '/api/v1/workspaces/{workspace}'
*/
export const show = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/workspaces/{workspace}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::show
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:40
* @route '/api/v1/workspaces/{workspace}'
*/
show.url = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::show
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:40
* @route '/api/v1/workspaces/{workspace}'
*/
show.get = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::show
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:40
* @route '/api/v1/workspaces/{workspace}'
*/
show.head = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::show
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:40
* @route '/api/v1/workspaces/{workspace}'
*/
const showForm = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::show
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:40
* @route '/api/v1/workspaces/{workspace}'
*/
showForm.get = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::show
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:40
* @route '/api/v1/workspaces/{workspace}'
*/
showForm.head = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\V1\WorkspaceController::update
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:49
* @route '/api/v1/workspaces/{workspace}'
*/
export const update = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/workspaces/{workspace}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::update
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:49
* @route '/api/v1/workspaces/{workspace}'
*/
update.url = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::update
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:49
* @route '/api/v1/workspaces/{workspace}'
*/
update.put = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::update
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:49
* @route '/api/v1/workspaces/{workspace}'
*/
update.patch = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::update
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:49
* @route '/api/v1/workspaces/{workspace}'
*/
const updateForm = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::update
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:49
* @route '/api/v1/workspaces/{workspace}'
*/
updateForm.put = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::update
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:49
* @route '/api/v1/workspaces/{workspace}'
*/
updateForm.patch = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\WorkspaceController::destroy
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:66
* @route '/api/v1/workspaces/{workspace}'
*/
export const destroy = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/workspaces/{workspace}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::destroy
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:66
* @route '/api/v1/workspaces/{workspace}'
*/
destroy.url = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::destroy
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:66
* @route '/api/v1/workspaces/{workspace}'
*/
destroy.delete = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::destroy
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:66
* @route '/api/v1/workspaces/{workspace}'
*/
const destroyForm = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\WorkspaceController::destroy
* @see app/Http/Controllers/Api/V1/WorkspaceController.php:66
* @route '/api/v1/workspaces/{workspace}'
*/
destroyForm.delete = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const workspaces = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default workspaces