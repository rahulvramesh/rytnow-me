import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import comments from './comments'
import folders from './folders'
/**
* @see \App\Http\Controllers\MergedDocsController::workspace
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
export const workspace = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workspace.url(options),
    method: 'get',
})

workspace.definition = {
    methods: ["get","head"],
    url: '/docs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MergedDocsController::workspace
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
workspace.url = (options?: RouteQueryOptions) => {
    return workspace.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MergedDocsController::workspace
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
workspace.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workspace.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MergedDocsController::workspace
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
workspace.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workspace.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MergedDocsController::workspace
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
const workspaceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workspace.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MergedDocsController::workspace
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
workspaceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workspace.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MergedDocsController::workspace
* @see app/Http/Controllers/MergedDocsController.php:14
* @route '/docs'
*/
workspaceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: workspace.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

workspace.form = workspaceForm

/**
* @see \App\Http\Controllers\DocumentController::index
* @see app/Http/Controllers/DocumentController.php:19
* @route '/projects/{project}/docs'
*/
export const index = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/docs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::index
* @see app/Http/Controllers/DocumentController.php:19
* @route '/projects/{project}/docs'
*/
index.url = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\DocumentController::index
* @see app/Http/Controllers/DocumentController.php:19
* @route '/projects/{project}/docs'
*/
index.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentController::index
* @see app/Http/Controllers/DocumentController.php:19
* @route '/projects/{project}/docs'
*/
index.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentController::index
* @see app/Http/Controllers/DocumentController.php:19
* @route '/projects/{project}/docs'
*/
const indexForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentController::index
* @see app/Http/Controllers/DocumentController.php:19
* @route '/projects/{project}/docs'
*/
indexForm.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentController::index
* @see app/Http/Controllers/DocumentController.php:19
* @route '/projects/{project}/docs'
*/
indexForm.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DocumentController::store
* @see app/Http/Controllers/DocumentController.php:82
* @route '/projects/{project}/docs'
*/
export const store = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/docs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::store
* @see app/Http/Controllers/DocumentController.php:82
* @route '/projects/{project}/docs'
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
* @see \App\Http\Controllers\DocumentController::store
* @see app/Http/Controllers/DocumentController.php:82
* @route '/projects/{project}/docs'
*/
store.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::store
* @see app/Http/Controllers/DocumentController.php:82
* @route '/projects/{project}/docs'
*/
const storeForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::store
* @see app/Http/Controllers/DocumentController.php:82
* @route '/projects/{project}/docs'
*/
storeForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DocumentController::show
* @see app/Http/Controllers/DocumentController.php:47
* @route '/projects/{project}/docs/{document}'
*/
export const show = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/docs/{document}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentController::show
* @see app/Http/Controllers/DocumentController.php:47
* @route '/projects/{project}/docs/{document}'
*/
show.url = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::show
* @see app/Http/Controllers/DocumentController.php:47
* @route '/projects/{project}/docs/{document}'
*/
show.get = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentController::show
* @see app/Http/Controllers/DocumentController.php:47
* @route '/projects/{project}/docs/{document}'
*/
show.head = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentController::show
* @see app/Http/Controllers/DocumentController.php:47
* @route '/projects/{project}/docs/{document}'
*/
const showForm = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentController::show
* @see app/Http/Controllers/DocumentController.php:47
* @route '/projects/{project}/docs/{document}'
*/
showForm.get = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentController::show
* @see app/Http/Controllers/DocumentController.php:47
* @route '/projects/{project}/docs/{document}'
*/
showForm.head = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DocumentController::update
* @see app/Http/Controllers/DocumentController.php:118
* @route '/projects/{project}/docs/{document}'
*/
export const update = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/docs/{document}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\DocumentController::update
* @see app/Http/Controllers/DocumentController.php:118
* @route '/projects/{project}/docs/{document}'
*/
update.url = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::update
* @see app/Http/Controllers/DocumentController.php:118
* @route '/projects/{project}/docs/{document}'
*/
update.put = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DocumentController::update
* @see app/Http/Controllers/DocumentController.php:118
* @route '/projects/{project}/docs/{document}'
*/
const updateForm = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::update
* @see app/Http/Controllers/DocumentController.php:118
* @route '/projects/{project}/docs/{document}'
*/
updateForm.put = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DocumentController::destroy
* @see app/Http/Controllers/DocumentController.php:147
* @route '/projects/{project}/docs/{document}'
*/
export const destroy = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/docs/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DocumentController::destroy
* @see app/Http/Controllers/DocumentController.php:147
* @route '/projects/{project}/docs/{document}'
*/
destroy.url = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::destroy
* @see app/Http/Controllers/DocumentController.php:147
* @route '/projects/{project}/docs/{document}'
*/
destroy.delete = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DocumentController::destroy
* @see app/Http/Controllers/DocumentController.php:147
* @route '/projects/{project}/docs/{document}'
*/
const destroyForm = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::destroy
* @see app/Http/Controllers/DocumentController.php:147
* @route '/projects/{project}/docs/{document}'
*/
destroyForm.delete = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DocumentController::move
* @see app/Http/Controllers/DocumentController.php:167
* @route '/projects/{project}/docs/{document}/move'
*/
export const move = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: move.url(args, options),
    method: 'patch',
})

move.definition = {
    methods: ["patch"],
    url: '/projects/{project}/docs/{document}/move',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\DocumentController::move
* @see app/Http/Controllers/DocumentController.php:167
* @route '/projects/{project}/docs/{document}/move'
*/
move.url = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return move.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::move
* @see app/Http/Controllers/DocumentController.php:167
* @route '/projects/{project}/docs/{document}/move'
*/
move.patch = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: move.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\DocumentController::move
* @see app/Http/Controllers/DocumentController.php:167
* @route '/projects/{project}/docs/{document}/move'
*/
const moveForm = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: move.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::move
* @see app/Http/Controllers/DocumentController.php:167
* @route '/projects/{project}/docs/{document}/move'
*/
moveForm.patch = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: move.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

move.form = moveForm

/**
* @see \App\Http\Controllers\DocumentController::reorder
* @see app/Http/Controllers/DocumentController.php:198
* @route '/projects/{project}/docs/reorder'
*/
export const reorder = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/projects/{project}/docs/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::reorder
* @see app/Http/Controllers/DocumentController.php:198
* @route '/projects/{project}/docs/reorder'
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
* @see \App\Http\Controllers\DocumentController::reorder
* @see app/Http/Controllers/DocumentController.php:198
* @route '/projects/{project}/docs/reorder'
*/
reorder.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::reorder
* @see app/Http/Controllers/DocumentController.php:198
* @route '/projects/{project}/docs/reorder'
*/
const reorderForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::reorder
* @see app/Http/Controllers/DocumentController.php:198
* @route '/projects/{project}/docs/reorder'
*/
reorderForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

reorder.form = reorderForm

/**
* @see \App\Http\Controllers\DocumentController::uploadImage
* @see app/Http/Controllers/DocumentController.php:221
* @route '/projects/{project}/docs/{document}/upload-image'
*/
export const uploadImage = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(args, options),
    method: 'post',
})

uploadImage.definition = {
    methods: ["post"],
    url: '/projects/{project}/docs/{document}/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentController::uploadImage
* @see app/Http/Controllers/DocumentController.php:221
* @route '/projects/{project}/docs/{document}/upload-image'
*/
uploadImage.url = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return uploadImage.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentController::uploadImage
* @see app/Http/Controllers/DocumentController.php:221
* @route '/projects/{project}/docs/{document}/upload-image'
*/
uploadImage.post = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::uploadImage
* @see app/Http/Controllers/DocumentController.php:221
* @route '/projects/{project}/docs/{document}/upload-image'
*/
const uploadImageForm = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentController::uploadImage
* @see app/Http/Controllers/DocumentController.php:221
* @route '/projects/{project}/docs/{document}/upload-image'
*/
uploadImageForm.post = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(args, options),
    method: 'post',
})

uploadImage.form = uploadImageForm

const docs = {
    workspace: Object.assign(workspace, workspace),
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    move: Object.assign(move, move),
    reorder: Object.assign(reorder, reorder),
    uploadImage: Object.assign(uploadImage, uploadImage),
    comments: Object.assign(comments, comments),
    folders: Object.assign(folders, folders),
}

export default docs