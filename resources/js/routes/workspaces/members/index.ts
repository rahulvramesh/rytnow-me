import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WorkspaceController::remove
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
export const remove = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

remove.definition = {
    methods: ["delete"],
    url: '/workspaces/{workspace}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkspaceController::remove
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
remove.url = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions) => {
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

    return remove.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::remove
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
remove.delete = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\WorkspaceController::remove
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
const removeForm = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::remove
* @see app/Http/Controllers/WorkspaceController.php:191
* @route '/workspaces/{workspace}/members/{user}'
*/
removeForm.delete = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

remove.form = removeForm

/**
* @see \App\Http\Controllers\WorkspaceController::updateRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
export const updateRole = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRole.url(args, options),
    method: 'patch',
})

updateRole.definition = {
    methods: ["patch"],
    url: '/workspaces/{workspace}/members/{user}/role',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\WorkspaceController::updateRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
updateRole.url = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions) => {
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

    return updateRole.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkspaceController::updateRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
updateRole.patch = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateRole.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\WorkspaceController::updateRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
const updateRoleForm = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WorkspaceController::updateRole
* @see app/Http/Controllers/WorkspaceController.php:227
* @route '/workspaces/{workspace}/members/{user}/role'
*/
updateRoleForm.patch = (args: { workspace: number | { id: number }, user: string | number } | [workspace: number | { id: number }, user: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateRole.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateRole.form = updateRoleForm

const members = {
    remove: Object.assign(remove, remove),
    updateRole: Object.assign(updateRole, updateRole),
}

export default members