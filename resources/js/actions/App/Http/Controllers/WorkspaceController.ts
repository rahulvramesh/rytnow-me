import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:16
* @route '/workspaces'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workspaces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:16
* @route '/workspaces'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:16
* @route '/workspaces'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:16
* @route '/workspaces'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:16
* @route '/workspaces'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:16
* @route '/workspaces'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::index
* @see app/Http/Controllers/WorkspaceController.php:16
* @route '/workspaces'
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
* @see \App\Http\Controllers\WorkspaceController::create
* @see app/Http/Controllers/WorkspaceController.php:30
* @route '/workspaces/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/workspaces/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkspaceController::create
* @see app/Http/Controllers/WorkspaceController.php:30
* @route '/workspaces/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::create
* @see app/Http/Controllers/WorkspaceController.php:30
* @route '/workspaces/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::create
* @see app/Http/Controllers/WorkspaceController.php:30
* @route '/workspaces/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkspaceController::create
* @see app/Http/Controllers/WorkspaceController.php:30
* @route '/workspaces/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::create
* @see app/Http/Controllers/WorkspaceController.php:30
* @route '/workspaces/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::create
* @see app/Http/Controllers/WorkspaceController.php:30
* @route '/workspaces/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:38
* @route '/workspaces'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:38
* @route '/workspaces'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:38
* @route '/workspaces'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:38
* @route '/workspaces'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::store
* @see app/Http/Controllers/WorkspaceController.php:38
* @route '/workspaces'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\WorkspaceController::show
* @see app/Http/Controllers/WorkspaceController.php:69
* @route '/workspaces/{workspace}'
*/
export const show = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/workspaces/{workspace}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkspaceController::show
* @see app/Http/Controllers/WorkspaceController.php:69
* @route '/workspaces/{workspace}'
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
* @see \App\Http\Controllers\WorkspaceController::show
* @see app/Http/Controllers/WorkspaceController.php:69
* @route '/workspaces/{workspace}'
*/
show.get = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::show
* @see app/Http/Controllers/WorkspaceController.php:69
* @route '/workspaces/{workspace}'
*/
show.head = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkspaceController::show
* @see app/Http/Controllers/WorkspaceController.php:69
* @route '/workspaces/{workspace}'
*/
const showForm = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::show
* @see app/Http/Controllers/WorkspaceController.php:69
* @route '/workspaces/{workspace}'
*/
showForm.get = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::show
* @see app/Http/Controllers/WorkspaceController.php:69
* @route '/workspaces/{workspace}'
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
* @see \App\Http\Controllers\WorkspaceController::edit
* @see app/Http/Controllers/WorkspaceController.php:84
* @route '/workspaces/{workspace}/edit'
*/
export const edit = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/workspaces/{workspace}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkspaceController::edit
* @see app/Http/Controllers/WorkspaceController.php:84
* @route '/workspaces/{workspace}/edit'
*/
edit.url = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::edit
* @see app/Http/Controllers/WorkspaceController.php:84
* @route '/workspaces/{workspace}/edit'
*/
edit.get = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::edit
* @see app/Http/Controllers/WorkspaceController.php:84
* @route '/workspaces/{workspace}/edit'
*/
edit.head = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkspaceController::edit
* @see app/Http/Controllers/WorkspaceController.php:84
* @route '/workspaces/{workspace}/edit'
*/
const editForm = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::edit
* @see app/Http/Controllers/WorkspaceController.php:84
* @route '/workspaces/{workspace}/edit'
*/
editForm.get = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::edit
* @see app/Http/Controllers/WorkspaceController.php:84
* @route '/workspaces/{workspace}/edit'
*/
editForm.head = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:99
* @route '/workspaces/{workspace}'
*/
export const update = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/workspaces/{workspace}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:99
* @route '/workspaces/{workspace}'
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
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:99
* @route '/workspaces/{workspace}'
*/
update.put = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:99
* @route '/workspaces/{workspace}'
*/
update.patch = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:99
* @route '/workspaces/{workspace}'
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
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:99
* @route '/workspaces/{workspace}'
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
* @see \App\Http\Controllers\WorkspaceController::update
* @see app/Http/Controllers/WorkspaceController.php:99
* @route '/workspaces/{workspace}'
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
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:118
* @route '/workspaces/{workspace}'
*/
export const destroy = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{workspace}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:118
* @route '/workspaces/{workspace}'
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
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:118
* @route '/workspaces/{workspace}'
*/
destroy.delete = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:118
* @route '/workspaces/{workspace}'
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
* @see \App\Http\Controllers\WorkspaceController::destroy
* @see app/Http/Controllers/WorkspaceController.php:118
* @route '/workspaces/{workspace}'
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

/**
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:149
* @route '/workspaces/{workspace}/switch'
*/
export const switchMethod = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(args, options),
    method: 'post',
})

switchMethod.definition = {
    methods: ["post"],
    url: '/workspaces/{workspace}/switch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:149
* @route '/workspaces/{workspace}/switch'
*/
switchMethod.url = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return switchMethod.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:149
* @route '/workspaces/{workspace}/switch'
*/
switchMethod.post = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:149
* @route '/workspaces/{workspace}/switch'
*/
const switchMethodForm = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::switchMethod
* @see app/Http/Controllers/WorkspaceController.php:149
* @route '/workspaces/{workspace}/switch'
*/
switchMethodForm.post = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: switchMethod.url(args, options),
    method: 'post',
})

switchMethod.form = switchMethodForm

/**
* @see \App\Http\Controllers\WorkspaceController::members
* @see app/Http/Controllers/WorkspaceController.php:163
* @route '/workspaces/{workspace}/members'
*/
export const members = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: members.url(args, options),
    method: 'get',
})

members.definition = {
    methods: ["get","head"],
    url: '/workspaces/{workspace}/members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkspaceController::members
* @see app/Http/Controllers/WorkspaceController.php:163
* @route '/workspaces/{workspace}/members'
*/
members.url = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return members.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::members
* @see app/Http/Controllers/WorkspaceController.php:163
* @route '/workspaces/{workspace}/members'
*/
members.get = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: members.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::members
* @see app/Http/Controllers/WorkspaceController.php:163
* @route '/workspaces/{workspace}/members'
*/
members.head = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: members.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WorkspaceController::members
* @see app/Http/Controllers/WorkspaceController.php:163
* @route '/workspaces/{workspace}/members'
*/
const membersForm = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: members.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::members
* @see app/Http/Controllers/WorkspaceController.php:163
* @route '/workspaces/{workspace}/members'
*/
membersForm.get = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: members.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\WorkspaceController::members
* @see app/Http/Controllers/WorkspaceController.php:163
* @route '/workspaces/{workspace}/members'
*/
membersForm.head = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: members.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

members.form = membersForm

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
export const removeMember = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember.url(args, options),
    method: 'delete',
})

removeMember.definition = {
    methods: ["delete"],
    url: '/workspaces/{workspace}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
removeMember.url = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
        user: args.user,
    }

    return removeMember.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
removeMember.delete = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeMember.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
const removeMemberForm = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMember.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::removeMember
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
removeMemberForm.delete = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: removeMember.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

removeMember.form = removeMemberForm

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
export const updateMemberRole = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMemberRole.url(args, options),
    method: 'patch',
})

updateMemberRole.definition = {
    methods: ["patch"],
    url: '/workspaces/{workspace}/members/{user}/role',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
updateMemberRole.url = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
        user: args.user,
    }

    return updateMemberRole.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
updateMemberRole.patch = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMemberRole.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
const updateMemberRoleForm = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMemberRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::updateMemberRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
updateMemberRoleForm.patch = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateMemberRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateMemberRole.form = updateMemberRoleForm

const WorkspaceController = { index, create, store, show, edit, update, destroy, switchMethod, members, removeMember, updateMemberRole, switch: switchMethod }

export default WorkspaceController