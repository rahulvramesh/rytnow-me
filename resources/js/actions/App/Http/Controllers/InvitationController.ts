import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InvitationController::store
* @see app/Http/Controllers/InvitationController.php:24
* @route '/workspaces/{workspace}/invitations'
*/
export const store = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{workspace}/invitations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvitationController::store
* @see app/Http/Controllers/InvitationController.php:24
* @route '/workspaces/{workspace}/invitations'
*/
store.url = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\InvitationController::store
* @see app/Http/Controllers/InvitationController.php:24
* @route '/workspaces/{workspace}/invitations'
*/
store.post = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::store
* @see app/Http/Controllers/InvitationController.php:24
* @route '/workspaces/{workspace}/invitations'
*/
const storeForm = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::store
* @see app/Http/Controllers/InvitationController.php:24
* @route '/workspaces/{workspace}/invitations'
*/
storeForm.post = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\InvitationController::bulkStore
* @see app/Http/Controllers/InvitationController.php:195
* @route '/workspaces/{workspace}/invitations/bulk'
*/
export const bulkStore = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStore.url(args, options),
    method: 'post',
})

bulkStore.definition = {
    methods: ["post"],
    url: '/workspaces/{workspace}/invitations/bulk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvitationController::bulkStore
* @see app/Http/Controllers/InvitationController.php:195
* @route '/workspaces/{workspace}/invitations/bulk'
*/
bulkStore.url = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return bulkStore.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvitationController::bulkStore
* @see app/Http/Controllers/InvitationController.php:195
* @route '/workspaces/{workspace}/invitations/bulk'
*/
bulkStore.post = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::bulkStore
* @see app/Http/Controllers/InvitationController.php:195
* @route '/workspaces/{workspace}/invitations/bulk'
*/
const bulkStoreForm = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkStore.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::bulkStore
* @see app/Http/Controllers/InvitationController.php:195
* @route '/workspaces/{workspace}/invitations/bulk'
*/
bulkStoreForm.post = (args: { workspace: number | { id: number } } | [workspace: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkStore.url(args, options),
    method: 'post',
})

bulkStore.form = bulkStoreForm

/**
* @see \App\Http\Controllers\InvitationController::resend
* @see app/Http/Controllers/InvitationController.php:163
* @route '/workspaces/{workspace}/invitations/{invitation}/resend'
*/
export const resend = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(args, options),
    method: 'post',
})

resend.definition = {
    methods: ["post"],
    url: '/workspaces/{workspace}/invitations/{invitation}/resend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvitationController::resend
* @see app/Http/Controllers/InvitationController.php:163
* @route '/workspaces/{workspace}/invitations/{invitation}/resend'
*/
resend.url = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            invitation: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
        invitation: typeof args.invitation === 'object'
        ? args.invitation.id
        : args.invitation,
    }

    return resend.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvitationController::resend
* @see app/Http/Controllers/InvitationController.php:163
* @route '/workspaces/{workspace}/invitations/{invitation}/resend'
*/
resend.post = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::resend
* @see app/Http/Controllers/InvitationController.php:163
* @route '/workspaces/{workspace}/invitations/{invitation}/resend'
*/
const resendForm = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resend.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::resend
* @see app/Http/Controllers/InvitationController.php:163
* @route '/workspaces/{workspace}/invitations/{invitation}/resend'
*/
resendForm.post = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: resend.url(args, options),
    method: 'post',
})

resend.form = resendForm

/**
* @see \App\Http\Controllers\InvitationController::destroy
* @see app/Http/Controllers/InvitationController.php:183
* @route '/workspaces/{workspace}/invitations/{invitation}'
*/
export const destroy = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workspaces/{workspace}/invitations/{invitation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\InvitationController::destroy
* @see app/Http/Controllers/InvitationController.php:183
* @route '/workspaces/{workspace}/invitations/{invitation}'
*/
destroy.url = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            workspace: args[0],
            invitation: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        workspace: typeof args.workspace === 'object'
        ? args.workspace.id
        : args.workspace,
        invitation: typeof args.invitation === 'object'
        ? args.invitation.id
        : args.invitation,
    }

    return destroy.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace('{invitation}', parsedArgs.invitation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvitationController::destroy
* @see app/Http/Controllers/InvitationController.php:183
* @route '/workspaces/{workspace}/invitations/{invitation}'
*/
destroy.delete = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\InvitationController::destroy
* @see app/Http/Controllers/InvitationController.php:183
* @route '/workspaces/{workspace}/invitations/{invitation}'
*/
const destroyForm = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::destroy
* @see app/Http/Controllers/InvitationController.php:183
* @route '/workspaces/{workspace}/invitations/{invitation}'
*/
destroyForm.delete = (args: { workspace: number | { id: number }, invitation: number | { id: number } } | [workspace: number | { id: number }, invitation: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\InvitationController::show
* @see app/Http/Controllers/InvitationController.php:76
* @route '/invitations/{token}'
*/
export const show = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/invitations/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InvitationController::show
* @see app/Http/Controllers/InvitationController.php:76
* @route '/invitations/{token}'
*/
show.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return show.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvitationController::show
* @see app/Http/Controllers/InvitationController.php:76
* @route '/invitations/{token}'
*/
show.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvitationController::show
* @see app/Http/Controllers/InvitationController.php:76
* @route '/invitations/{token}'
*/
show.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\InvitationController::show
* @see app/Http/Controllers/InvitationController.php:76
* @route '/invitations/{token}'
*/
const showForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvitationController::show
* @see app/Http/Controllers/InvitationController.php:76
* @route '/invitations/{token}'
*/
showForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\InvitationController::show
* @see app/Http/Controllers/InvitationController.php:76
* @route '/invitations/{token}'
*/
showForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\InvitationController::accept
* @see app/Http/Controllers/InvitationController.php:111
* @route '/invitations/{token}/accept'
*/
export const accept = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/invitations/{token}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvitationController::accept
* @see app/Http/Controllers/InvitationController.php:111
* @route '/invitations/{token}/accept'
*/
accept.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return accept.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvitationController::accept
* @see app/Http/Controllers/InvitationController.php:111
* @route '/invitations/{token}/accept'
*/
accept.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::accept
* @see app/Http/Controllers/InvitationController.php:111
* @route '/invitations/{token}/accept'
*/
const acceptForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::accept
* @see app/Http/Controllers/InvitationController.php:111
* @route '/invitations/{token}/accept'
*/
acceptForm.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

accept.form = acceptForm

/**
* @see \App\Http\Controllers\InvitationController::decline
* @see app/Http/Controllers/InvitationController.php:148
* @route '/invitations/{token}/decline'
*/
export const decline = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

decline.definition = {
    methods: ["post"],
    url: '/invitations/{token}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InvitationController::decline
* @see app/Http/Controllers/InvitationController.php:148
* @route '/invitations/{token}/decline'
*/
decline.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return decline.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InvitationController::decline
* @see app/Http/Controllers/InvitationController.php:148
* @route '/invitations/{token}/decline'
*/
decline.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::decline
* @see app/Http/Controllers/InvitationController.php:148
* @route '/invitations/{token}/decline'
*/
const declineForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\InvitationController::decline
* @see app/Http/Controllers/InvitationController.php:148
* @route '/invitations/{token}/decline'
*/
declineForm.post = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

decline.form = declineForm

const InvitationController = { store, bulkStore, resend, destroy, show, accept, decline }

export default InvitationController