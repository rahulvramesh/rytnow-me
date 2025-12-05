import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PlanController::index
* @see app/Http/Controllers/PlanController.php:20
* @route '/projects/{project}/plans'
*/
export const index = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlanController::index
* @see app/Http/Controllers/PlanController.php:20
* @route '/projects/{project}/plans'
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
* @see \App\Http\Controllers\PlanController::index
* @see app/Http/Controllers/PlanController.php:20
* @route '/projects/{project}/plans'
*/
index.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::index
* @see app/Http/Controllers/PlanController.php:20
* @route '/projects/{project}/plans'
*/
index.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlanController::index
* @see app/Http/Controllers/PlanController.php:20
* @route '/projects/{project}/plans'
*/
const indexForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::index
* @see app/Http/Controllers/PlanController.php:20
* @route '/projects/{project}/plans'
*/
indexForm.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::index
* @see app/Http/Controllers/PlanController.php:20
* @route '/projects/{project}/plans'
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
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:41
* @route '/projects/{project}/plans/create'
*/
export const create = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/plans/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:41
* @route '/projects/{project}/plans/create'
*/
create.url = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:41
* @route '/projects/{project}/plans/create'
*/
create.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:41
* @route '/projects/{project}/plans/create'
*/
create.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:41
* @route '/projects/{project}/plans/create'
*/
const createForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:41
* @route '/projects/{project}/plans/create'
*/
createForm.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:41
* @route '/projects/{project}/plans/create'
*/
createForm.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PlanController::store
* @see app/Http/Controllers/PlanController.php:50
* @route '/projects/{project}/plans'
*/
export const store = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::store
* @see app/Http/Controllers/PlanController.php:50
* @route '/projects/{project}/plans'
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
* @see \App\Http\Controllers\PlanController::store
* @see app/Http/Controllers/PlanController.php:50
* @route '/projects/{project}/plans'
*/
store.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::store
* @see app/Http/Controllers/PlanController.php:50
* @route '/projects/{project}/plans'
*/
const storeForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::store
* @see app/Http/Controllers/PlanController.php:50
* @route '/projects/{project}/plans'
*/
storeForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PlanController::show
* @see app/Http/Controllers/PlanController.php:73
* @route '/projects/{project}/plans/{plan}'
*/
export const show = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/plans/{plan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlanController::show
* @see app/Http/Controllers/PlanController.php:73
* @route '/projects/{project}/plans/{plan}'
*/
show.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::show
* @see app/Http/Controllers/PlanController.php:73
* @route '/projects/{project}/plans/{plan}'
*/
show.get = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::show
* @see app/Http/Controllers/PlanController.php:73
* @route '/projects/{project}/plans/{plan}'
*/
show.head = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlanController::show
* @see app/Http/Controllers/PlanController.php:73
* @route '/projects/{project}/plans/{plan}'
*/
const showForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::show
* @see app/Http/Controllers/PlanController.php:73
* @route '/projects/{project}/plans/{plan}'
*/
showForm.get = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::show
* @see app/Http/Controllers/PlanController.php:73
* @route '/projects/{project}/plans/{plan}'
*/
showForm.head = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PlanController::edit
* @see app/Http/Controllers/PlanController.php:112
* @route '/projects/{project}/plans/{plan}/edit'
*/
export const edit = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/plans/{plan}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PlanController::edit
* @see app/Http/Controllers/PlanController.php:112
* @route '/projects/{project}/plans/{plan}/edit'
*/
edit.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return edit.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::edit
* @see app/Http/Controllers/PlanController.php:112
* @route '/projects/{project}/plans/{plan}/edit'
*/
edit.get = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::edit
* @see app/Http/Controllers/PlanController.php:112
* @route '/projects/{project}/plans/{plan}/edit'
*/
edit.head = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PlanController::edit
* @see app/Http/Controllers/PlanController.php:112
* @route '/projects/{project}/plans/{plan}/edit'
*/
const editForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::edit
* @see app/Http/Controllers/PlanController.php:112
* @route '/projects/{project}/plans/{plan}/edit'
*/
editForm.get = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PlanController::edit
* @see app/Http/Controllers/PlanController.php:112
* @route '/projects/{project}/plans/{plan}/edit'
*/
editForm.head = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PlanController::update
* @see app/Http/Controllers/PlanController.php:126
* @route '/projects/{project}/plans/{plan}'
*/
export const update = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/plans/{plan}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PlanController::update
* @see app/Http/Controllers/PlanController.php:126
* @route '/projects/{project}/plans/{plan}'
*/
update.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::update
* @see app/Http/Controllers/PlanController.php:126
* @route '/projects/{project}/plans/{plan}'
*/
update.put = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PlanController::update
* @see app/Http/Controllers/PlanController.php:126
* @route '/projects/{project}/plans/{plan}'
*/
const updateForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::update
* @see app/Http/Controllers/PlanController.php:126
* @route '/projects/{project}/plans/{plan}'
*/
updateForm.put = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PlanController::destroy
* @see app/Http/Controllers/PlanController.php:158
* @route '/projects/{project}/plans/{plan}'
*/
export const destroy = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/plans/{plan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PlanController::destroy
* @see app/Http/Controllers/PlanController.php:158
* @route '/projects/{project}/plans/{plan}'
*/
destroy.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::destroy
* @see app/Http/Controllers/PlanController.php:158
* @route '/projects/{project}/plans/{plan}'
*/
destroy.delete = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PlanController::destroy
* @see app/Http/Controllers/PlanController.php:158
* @route '/projects/{project}/plans/{plan}'
*/
const destroyForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::destroy
* @see app/Http/Controllers/PlanController.php:158
* @route '/projects/{project}/plans/{plan}'
*/
destroyForm.delete = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PlanController::reorder
* @see app/Http/Controllers/PlanController.php:181
* @route '/projects/{project}/plans/reorder'
*/
export const reorder = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::reorder
* @see app/Http/Controllers/PlanController.php:181
* @route '/projects/{project}/plans/reorder'
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
* @see \App\Http\Controllers\PlanController::reorder
* @see app/Http/Controllers/PlanController.php:181
* @route '/projects/{project}/plans/reorder'
*/
reorder.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::reorder
* @see app/Http/Controllers/PlanController.php:181
* @route '/projects/{project}/plans/reorder'
*/
const reorderForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::reorder
* @see app/Http/Controllers/PlanController.php:181
* @route '/projects/{project}/plans/reorder'
*/
reorderForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reorder.url(args, options),
    method: 'post',
})

reorder.form = reorderForm

/**
* @see \App\Http\Controllers\PlanController::uploadImage
* @see app/Http/Controllers/PlanController.php:322
* @route '/projects/{project}/plans/{plan}/upload-image'
*/
export const uploadImage = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(args, options),
    method: 'post',
})

uploadImage.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/{plan}/upload-image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::uploadImage
* @see app/Http/Controllers/PlanController.php:322
* @route '/projects/{project}/plans/{plan}/upload-image'
*/
uploadImage.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return uploadImage.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::uploadImage
* @see app/Http/Controllers/PlanController.php:322
* @route '/projects/{project}/plans/{plan}/upload-image'
*/
uploadImage.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::uploadImage
* @see app/Http/Controllers/PlanController.php:322
* @route '/projects/{project}/plans/{plan}/upload-image'
*/
const uploadImageForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::uploadImage
* @see app/Http/Controllers/PlanController.php:322
* @route '/projects/{project}/plans/{plan}/upload-image'
*/
uploadImageForm.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: uploadImage.url(args, options),
    method: 'post',
})

uploadImage.form = uploadImageForm

/**
* @see \App\Http\Controllers\PlanController::start
* @see app/Http/Controllers/PlanController.php:268
* @route '/projects/{project}/plans/{plan}/start'
*/
export const start = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/{plan}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::start
* @see app/Http/Controllers/PlanController.php:268
* @route '/projects/{project}/plans/{plan}/start'
*/
start.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return start.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::start
* @see app/Http/Controllers/PlanController.php:268
* @route '/projects/{project}/plans/{plan}/start'
*/
start.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::start
* @see app/Http/Controllers/PlanController.php:268
* @route '/projects/{project}/plans/{plan}/start'
*/
const startForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::start
* @see app/Http/Controllers/PlanController.php:268
* @route '/projects/{project}/plans/{plan}/start'
*/
startForm.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\PlanController::complete
* @see app/Http/Controllers/PlanController.php:281
* @route '/projects/{project}/plans/{plan}/complete'
*/
export const complete = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/{plan}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::complete
* @see app/Http/Controllers/PlanController.php:281
* @route '/projects/{project}/plans/{plan}/complete'
*/
complete.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return complete.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::complete
* @see app/Http/Controllers/PlanController.php:281
* @route '/projects/{project}/plans/{plan}/complete'
*/
complete.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::complete
* @see app/Http/Controllers/PlanController.php:281
* @route '/projects/{project}/plans/{plan}/complete'
*/
const completeForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::complete
* @see app/Http/Controllers/PlanController.php:281
* @route '/projects/{project}/plans/{plan}/complete'
*/
completeForm.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, options),
    method: 'post',
})

complete.form = completeForm

/**
* @see \App\Http\Controllers\PlanController::hold
* @see app/Http/Controllers/PlanController.php:294
* @route '/projects/{project}/plans/{plan}/hold'
*/
export const hold = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hold.url(args, options),
    method: 'post',
})

hold.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/{plan}/hold',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::hold
* @see app/Http/Controllers/PlanController.php:294
* @route '/projects/{project}/plans/{plan}/hold'
*/
hold.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return hold.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::hold
* @see app/Http/Controllers/PlanController.php:294
* @route '/projects/{project}/plans/{plan}/hold'
*/
hold.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hold.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::hold
* @see app/Http/Controllers/PlanController.php:294
* @route '/projects/{project}/plans/{plan}/hold'
*/
const holdForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hold.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::hold
* @see app/Http/Controllers/PlanController.php:294
* @route '/projects/{project}/plans/{plan}/hold'
*/
holdForm.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hold.url(args, options),
    method: 'post',
})

hold.form = holdForm

/**
* @see \App\Http\Controllers\PlanController::cancel
* @see app/Http/Controllers/PlanController.php:307
* @route '/projects/{project}/plans/{plan}/cancel'
*/
export const cancel = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/{plan}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::cancel
* @see app/Http/Controllers/PlanController.php:307
* @route '/projects/{project}/plans/{plan}/cancel'
*/
cancel.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return cancel.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::cancel
* @see app/Http/Controllers/PlanController.php:307
* @route '/projects/{project}/plans/{plan}/cancel'
*/
cancel.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::cancel
* @see app/Http/Controllers/PlanController.php:307
* @route '/projects/{project}/plans/{plan}/cancel'
*/
const cancelForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::cancel
* @see app/Http/Controllers/PlanController.php:307
* @route '/projects/{project}/plans/{plan}/cancel'
*/
cancelForm.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

cancel.form = cancelForm

/**
* @see \App\Http\Controllers\PlanController::createTask
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
export const createTask = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createTask.url(args, options),
    method: 'post',
})

createTask.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/{plan}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::createTask
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
createTask.url = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
    }

    return createTask.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::createTask
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
createTask.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::createTask
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
const createTaskForm = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::createTask
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
createTaskForm.post = (args: { project: number | { id: number }, plan: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createTask.url(args, options),
    method: 'post',
})

createTask.form = createTaskForm

/**
* @see \App\Http\Controllers\PlanController::linkTask
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
export const linkTask = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: linkTask.url(args, options),
    method: 'post',
})

linkTask.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/{plan}/tasks/{task}/link',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::linkTask
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
linkTask.url = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
            task: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return linkTask.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::linkTask
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
linkTask.post = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: linkTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::linkTask
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
const linkTaskForm = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: linkTask.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::linkTask
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
linkTaskForm.post = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: linkTask.url(args, options),
    method: 'post',
})

linkTask.form = linkTaskForm

/**
* @see \App\Http\Controllers\PlanController::unlinkTask
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
export const unlinkTask = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: unlinkTask.url(args, options),
    method: 'delete',
})

unlinkTask.definition = {
    methods: ["delete"],
    url: '/projects/{project}/plans/{plan}/tasks/{task}/unlink',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PlanController::unlinkTask
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
unlinkTask.url = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            plan: args[1],
            task: args[2],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        plan: typeof args.plan === 'object'
        ? args.plan.id
        : args.plan,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return unlinkTask.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::unlinkTask
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
unlinkTask.delete = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: unlinkTask.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PlanController::unlinkTask
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
const unlinkTaskForm = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unlinkTask.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::unlinkTask
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
unlinkTaskForm.delete = (args: { project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, plan: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unlinkTask.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

unlinkTask.form = unlinkTaskForm

const PlanController = { index, create, store, show, edit, update, destroy, reorder, uploadImage, start, complete, hold, cancel, createTask, linkTask, unlinkTask }

export default PlanController