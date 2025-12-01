import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DocFolderController::store
* @see app/Http/Controllers/DocFolderController.php:15
* @route '/projects/{project}/docs/folders'
*/
export const store = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/docs/folders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocFolderController::store
* @see app/Http/Controllers/DocFolderController.php:15
* @route '/projects/{project}/docs/folders'
*/
store.url = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\DocFolderController::store
* @see app/Http/Controllers/DocFolderController.php:15
* @route '/projects/{project}/docs/folders'
*/
store.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocFolderController::store
* @see app/Http/Controllers/DocFolderController.php:15
* @route '/projects/{project}/docs/folders'
*/
const storeForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocFolderController::store
* @see app/Http/Controllers/DocFolderController.php:15
* @route '/projects/{project}/docs/folders'
*/
storeForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DocFolderController::update
* @see app/Http/Controllers/DocFolderController.php:33
* @route '/projects/{project}/docs/folders/{folder}'
*/
export const update = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/docs/folders/{folder}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DocFolderController::update
* @see app/Http/Controllers/DocFolderController.php:33
* @route '/projects/{project}/docs/folders/{folder}'
*/
update.url = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            folder: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        folder: typeof args.folder === 'object'
        ? args.folder.id
        : args.folder,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{folder}', parsedArgs.folder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocFolderController::update
* @see app/Http/Controllers/DocFolderController.php:33
* @route '/projects/{project}/docs/folders/{folder}'
*/
update.put = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DocFolderController::update
* @see app/Http/Controllers/DocFolderController.php:33
* @route '/projects/{project}/docs/folders/{folder}'
*/
const updateForm = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocFolderController::update
* @see app/Http/Controllers/DocFolderController.php:33
* @route '/projects/{project}/docs/folders/{folder}'
*/
updateForm.put = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DocFolderController::destroy
* @see app/Http/Controllers/DocFolderController.php:50
* @route '/projects/{project}/docs/folders/{folder}'
*/
export const destroy = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/docs/folders/{folder}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DocFolderController::destroy
* @see app/Http/Controllers/DocFolderController.php:50
* @route '/projects/{project}/docs/folders/{folder}'
*/
destroy.url = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            folder: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        folder: typeof args.folder === 'object'
        ? args.folder.id
        : args.folder,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{folder}', parsedArgs.folder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocFolderController::destroy
* @see app/Http/Controllers/DocFolderController.php:50
* @route '/projects/{project}/docs/folders/{folder}'
*/
destroy.delete = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DocFolderController::destroy
* @see app/Http/Controllers/DocFolderController.php:50
* @route '/projects/{project}/docs/folders/{folder}'
*/
const destroyForm = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocFolderController::destroy
* @see app/Http/Controllers/DocFolderController.php:50
* @route '/projects/{project}/docs/folders/{folder}'
*/
destroyForm.delete = (args: { project: number | { id: number }, folder: number | { id: number } } | [project: number | { id: number }, folder: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DocFolderController::reorder
* @see app/Http/Controllers/DocFolderController.php:66
* @route '/projects/{project}/docs/folders/reorder'
*/
export const reorder = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/projects/{project}/docs/folders/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocFolderController::reorder
* @see app/Http/Controllers/DocFolderController.php:66
* @route '/projects/{project}/docs/folders/reorder'
*/
reorder.url = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reorder.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocFolderController::reorder
* @see app/Http/Controllers/DocFolderController.php:66
* @route '/projects/{project}/docs/folders/reorder'
*/
reorder.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocFolderController::reorder
* @see app/Http/Controllers/DocFolderController.php:66
* @route '/projects/{project}/docs/folders/reorder'
*/
const reorderForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocFolderController::reorder
* @see app/Http/Controllers/DocFolderController.php:66
* @route '/projects/{project}/docs/folders/reorder'
*/
reorderForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

reorder.form = reorderForm

const folders = {
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    reorder: Object.assign(reorder, reorder),
}

export default folders