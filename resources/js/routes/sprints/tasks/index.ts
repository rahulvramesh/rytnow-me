import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SprintController::add
* @see app/Http/Controllers/SprintController.php:208
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
export const add = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(args, options),
    method: 'post',
})

add.definition = {
    methods: ["post"],
    url: '/projects/{project}/sprints/{sprint}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SprintController::add
* @see app/Http/Controllers/SprintController.php:208
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
add.url = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return add.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::add
* @see app/Http/Controllers/SprintController.php:208
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
add.post = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::add
* @see app/Http/Controllers/SprintController.php:208
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
const addForm = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: add.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::add
* @see app/Http/Controllers/SprintController.php:208
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
addForm.post = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: add.url(args, options),
    method: 'post',
})

add.form = addForm

/**
* @see \App\Http\Controllers\SprintController::remove
* @see app/Http/Controllers/SprintController.php:235
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
export const remove = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

remove.definition = {
    methods: ["delete"],
    url: '/projects/{project}/sprints/{sprint}/tasks',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SprintController::remove
* @see app/Http/Controllers/SprintController.php:235
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
remove.url = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return remove.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{sprint}', parsedArgs.sprint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SprintController::remove
* @see app/Http/Controllers/SprintController.php:235
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
remove.delete = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\SprintController::remove
* @see app/Http/Controllers/SprintController.php:235
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
const removeForm = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SprintController::remove
* @see app/Http/Controllers/SprintController.php:235
* @route '/projects/{project}/sprints/{sprint}/tasks'
*/
removeForm.delete = (args: { project: number | { id: number }, sprint: number | { id: number } } | [project: number | { id: number }, sprint: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

remove.form = removeForm

const tasks = {
    add: Object.assign(add, add),
    remove: Object.assign(remove, remove),
}

export default tasks