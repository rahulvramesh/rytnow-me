import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import tasks from './tasks'
/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:21
* @route '/projects/{project}/sprints'
*/
export const index = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/sprints',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:21
* @route '/projects/{project}/sprints'
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
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:21
* @route '/projects/{project}/sprints'
*/
index.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:21
* @route '/projects/{project}/sprints'
*/
index.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:21
* @route '/projects/{project}/sprints'
*/
const indexForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:21
* @route '/projects/{project}/sprints'
*/
indexForm.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::index
* @see app/Http/Controllers/SprintController.php:21
* @route '/projects/{project}/sprints'
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
* @see \App\Http\Controllers\SprintController::create
* @see app/Http/Controllers/SprintController.php:55
* @route '/projects/{project}/sprints/create'
*/
export const create = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/sprints/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SprintController::create
* @see app/Http/Controllers/SprintController.php:55
* @route '/projects/{project}/sprints/create'
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
* @see \App\Http\Controllers\SprintController::create
* @see app/Http/Controllers/SprintController.php:55
* @route '/projects/{project}/sprints/create'
*/
create.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::create
* @see app/Http/Controllers/SprintController.php:55
* @route '/projects/{project}/sprints/create'
*/
create.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SprintController::create
* @see app/Http/Controllers/SprintController.php:55
* @route '/projects/{project}/sprints/create'
*/
const createForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::create
* @see app/Http/Controllers/SprintController.php:55
* @route '/projects/{project}/sprints/create'
*/
createForm.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::create
* @see app/Http/Controllers/SprintController.php:55
* @route '/projects/{project}/sprints/create'
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
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/projects/{project}/sprints'
*/
export const store = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/sprints',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/projects/{project}/sprints'
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
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/projects/{project}/sprints'
*/
store.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/projects/{project}/sprints'
*/
const storeForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::store
* @see app/Http/Controllers/SprintController.php:67
* @route '/projects/{project}/sprints'
*/
storeForm.post = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\SprintController::backlog
* @see app/Http/Controllers/SprintController.php:261
* @route '/projects/{project}/sprints/backlog'
*/
export const backlog = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backlog.url(args, options),
    method: 'get',
})

backlog.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/sprints/backlog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SprintController::backlog
* @see app/Http/Controllers/SprintController.php:261
* @route '/projects/{project}/sprints/backlog'
*/
backlog.url = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return backlog.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::backlog
* @see app/Http/Controllers/SprintController.php:261
* @route '/projects/{project}/sprints/backlog'
*/
backlog.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: backlog.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::backlog
* @see app/Http/Controllers/SprintController.php:261
* @route '/projects/{project}/sprints/backlog'
*/
backlog.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: backlog.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SprintController::backlog
* @see app/Http/Controllers/SprintController.php:261
* @route '/projects/{project}/sprints/backlog'
*/
const backlogForm = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: backlog.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::backlog
* @see app/Http/Controllers/SprintController.php:261
* @route '/projects/{project}/sprints/backlog'
*/
backlogForm.get = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: backlog.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::backlog
* @see app/Http/Controllers/SprintController.php:261
* @route '/projects/{project}/sprints/backlog'
*/
backlogForm.head = (args: { project: number | { id: number } } | [project: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: backlog.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

backlog.form = backlogForm

/**
* @see \App\Http\Controllers\SprintController::show
* @see app/Http/Controllers/SprintController.php:91
* @route '/projects/{project}/sprints/{sprint}'
*/
export const show = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/sprints/{sprint}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SprintController::show
* @see app/Http/Controllers/SprintController.php:91
* @route '/projects/{project}/sprints/{sprint}'
*/
show.url = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            sprint: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        sprint: typeof args.sprint === 'object'
        ? args.sprint.id
        : args.sprint,
    }

    return show.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::show
* @see app/Http/Controllers/SprintController.php:91
* @route '/projects/{project}/sprints/{sprint}'
*/
show.get = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::show
* @see app/Http/Controllers/SprintController.php:91
* @route '/projects/{project}/sprints/{sprint}'
*/
show.head = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SprintController::show
* @see app/Http/Controllers/SprintController.php:91
* @route '/projects/{project}/sprints/{sprint}'
*/
const showForm = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::show
* @see app/Http/Controllers/SprintController.php:91
* @route '/projects/{project}/sprints/{sprint}'
*/
showForm.get = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::show
* @see app/Http/Controllers/SprintController.php:91
* @route '/projects/{project}/sprints/{sprint}'
*/
showForm.head = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SprintController::edit
* @see app/Http/Controllers/SprintController.php:139
* @route '/projects/{project}/sprints/{sprint}/edit'
*/
export const edit = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/sprints/{sprint}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SprintController::edit
* @see app/Http/Controllers/SprintController.php:139
* @route '/projects/{project}/sprints/{sprint}/edit'
*/
edit.url = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            sprint: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        sprint: typeof args.sprint === 'object'
        ? args.sprint.id
        : args.sprint,
    }

    return edit.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::edit
* @see app/Http/Controllers/SprintController.php:139
* @route '/projects/{project}/sprints/{sprint}/edit'
*/
edit.get = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::edit
* @see app/Http/Controllers/SprintController.php:139
* @route '/projects/{project}/sprints/{sprint}/edit'
*/
edit.head = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SprintController::edit
* @see app/Http/Controllers/SprintController.php:139
* @route '/projects/{project}/sprints/{sprint}/edit'
*/
const editForm = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::edit
* @see app/Http/Controllers/SprintController.php:139
* @route '/projects/{project}/sprints/{sprint}/edit'
*/
editForm.get = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SprintController::edit
* @see app/Http/Controllers/SprintController.php:139
* @route '/projects/{project}/sprints/{sprint}/edit'
*/
editForm.head = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:163
* @route '/projects/{project}/sprints/{sprint}'
*/
export const update = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/sprints/{sprint}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:163
* @route '/projects/{project}/sprints/{sprint}'
*/
update.url = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            sprint: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        sprint: typeof args.sprint === 'object'
        ? args.sprint.id
        : args.sprint,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:163
* @route '/projects/{project}/sprints/{sprint}'
*/
update.put = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:163
* @route '/projects/{project}/sprints/{sprint}'
*/
const updateForm = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::update
* @see app/Http/Controllers/SprintController.php:163
* @route '/projects/{project}/sprints/{sprint}'
*/
updateForm.put = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\SprintController::destroy
* @see app/Http/Controllers/SprintController.php:188
* @route '/projects/{project}/sprints/{sprint}'
*/
export const destroy = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/sprints/{sprint}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SprintController::destroy
* @see app/Http/Controllers/SprintController.php:188
* @route '/projects/{project}/sprints/{sprint}'
*/
destroy.url = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            sprint: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        sprint: typeof args.sprint === 'object'
        ? args.sprint.id
        : args.sprint,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::destroy
* @see app/Http/Controllers/SprintController.php:188
* @route '/projects/{project}/sprints/{sprint}'
*/
destroy.delete = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\SprintController::destroy
* @see app/Http/Controllers/SprintController.php:188
* @route '/projects/{project}/sprints/{sprint}'
*/
const destroyForm = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::destroy
* @see app/Http/Controllers/SprintController.php:188
* @route '/projects/{project}/sprints/{sprint}'
*/
destroyForm.delete = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const sprints = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    backlog: Object.assign(backlog, backlog),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    tasks: Object.assign(tasks, tasks),
}

export default sprints