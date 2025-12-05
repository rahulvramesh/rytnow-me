import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\DocumentController::index
* @see app/Http/Controllers/Api/V1/DocumentController.php:11
* @route '/api/v1/projects/{project}/documents'
*/
export const index = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/projects/{project}/documents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::index
* @see app/Http/Controllers/Api/V1/DocumentController.php:11
* @route '/api/v1/projects/{project}/documents'
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
* @see \App\Http\Controllers\Api\V1\DocumentController::index
* @see app/Http/Controllers/Api/V1/DocumentController.php:11
* @route '/api/v1/projects/{project}/documents'
*/
index.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::index
* @see app/Http/Controllers/Api/V1/DocumentController.php:11
* @route '/api/v1/projects/{project}/documents'
*/
index.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::index
* @see app/Http/Controllers/Api/V1/DocumentController.php:11
* @route '/api/v1/projects/{project}/documents'
*/
const indexForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::index
* @see app/Http/Controllers/Api/V1/DocumentController.php:11
* @route '/api/v1/projects/{project}/documents'
*/
indexForm.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::index
* @see app/Http/Controllers/Api/V1/DocumentController.php:11
* @route '/api/v1/projects/{project}/documents'
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
* @see \App\Http\Controllers\Api\V1\DocumentController::store
* @see app/Http/Controllers/Api/V1/DocumentController.php:27
* @route '/api/v1/projects/{project}/documents'
*/
export const store = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/projects/{project}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::store
* @see app/Http/Controllers/Api/V1/DocumentController.php:27
* @route '/api/v1/projects/{project}/documents'
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
* @see \App\Http\Controllers\Api\V1\DocumentController::store
* @see app/Http/Controllers/Api/V1/DocumentController.php:27
* @route '/api/v1/projects/{project}/documents'
*/
store.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::store
* @see app/Http/Controllers/Api/V1/DocumentController.php:27
* @route '/api/v1/projects/{project}/documents'
*/
const storeForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::store
* @see app/Http/Controllers/Api/V1/DocumentController.php:27
* @route '/api/v1/projects/{project}/documents'
*/
storeForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::show
* @see app/Http/Controllers/Api/V1/DocumentController.php:66
* @route '/api/v1/projects/{project}/documents/{document}'
*/
export const show = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/projects/{project}/documents/{document}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::show
* @see app/Http/Controllers/Api/V1/DocumentController.php:66
* @route '/api/v1/projects/{project}/documents/{document}'
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
* @see \App\Http\Controllers\Api\V1\DocumentController::show
* @see app/Http/Controllers/Api/V1/DocumentController.php:66
* @route '/api/v1/projects/{project}/documents/{document}'
*/
show.get = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::show
* @see app/Http/Controllers/Api/V1/DocumentController.php:66
* @route '/api/v1/projects/{project}/documents/{document}'
*/
show.head = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::show
* @see app/Http/Controllers/Api/V1/DocumentController.php:66
* @route '/api/v1/projects/{project}/documents/{document}'
*/
const showForm = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::show
* @see app/Http/Controllers/Api/V1/DocumentController.php:66
* @route '/api/v1/projects/{project}/documents/{document}'
*/
showForm.get = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::show
* @see app/Http/Controllers/Api/V1/DocumentController.php:66
* @route '/api/v1/projects/{project}/documents/{document}'
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
* @see \App\Http\Controllers\Api\V1\DocumentController::update
* @see app/Http/Controllers/Api/V1/DocumentController.php:83
* @route '/api/v1/projects/{project}/documents/{document}'
*/
export const update = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/v1/projects/{project}/documents/{document}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::update
* @see app/Http/Controllers/Api/V1/DocumentController.php:83
* @route '/api/v1/projects/{project}/documents/{document}'
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
* @see \App\Http\Controllers\Api\V1\DocumentController::update
* @see app/Http/Controllers/Api/V1/DocumentController.php:83
* @route '/api/v1/projects/{project}/documents/{document}'
*/
update.put = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::update
* @see app/Http/Controllers/Api/V1/DocumentController.php:83
* @route '/api/v1/projects/{project}/documents/{document}'
*/
update.patch = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::update
* @see app/Http/Controllers/Api/V1/DocumentController.php:83
* @route '/api/v1/projects/{project}/documents/{document}'
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
* @see \App\Http\Controllers\Api\V1\DocumentController::update
* @see app/Http/Controllers/Api/V1/DocumentController.php:83
* @route '/api/v1/projects/{project}/documents/{document}'
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

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::update
* @see app/Http/Controllers/Api/V1/DocumentController.php:83
* @route '/api/v1/projects/{project}/documents/{document}'
*/
updateForm.patch = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\V1\DocumentController::destroy
* @see app/Http/Controllers/Api/V1/DocumentController.php:117
* @route '/api/v1/projects/{project}/documents/{document}'
*/
export const destroy = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/projects/{project}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::destroy
* @see app/Http/Controllers/Api/V1/DocumentController.php:117
* @route '/api/v1/projects/{project}/documents/{document}'
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
* @see \App\Http\Controllers\Api\V1\DocumentController::destroy
* @see app/Http/Controllers/Api/V1/DocumentController.php:117
* @route '/api/v1/projects/{project}/documents/{document}'
*/
destroy.delete = (args: { project: number | { id: number }, document: number | { id: number } } | [project: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\DocumentController::destroy
* @see app/Http/Controllers/Api/V1/DocumentController.php:117
* @route '/api/v1/projects/{project}/documents/{document}'
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
* @see \App\Http\Controllers\Api\V1\DocumentController::destroy
* @see app/Http/Controllers/Api/V1/DocumentController.php:117
* @route '/api/v1/projects/{project}/documents/{document}'
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

const documents = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default documents