import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
export const create = (args: { project: number | { id: number }, plan: string | number | { id: string | number } } | [project: number | { id: number }, plan: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/{plan}/tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
create.url = (args: { project: number | { id: number }, plan: string | number | { id: string | number } } | [project: number | { id: number }, plan: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
create.post = (args: { project: number | { id: number }, plan: string | number | { id: string | number } } | [project: number | { id: number }, plan: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
const createForm = (args: { project: number | { id: number }, plan: string | number | { id: string | number } } | [project: number | { id: number }, plan: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: create.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::create
* @see app/Http/Controllers/PlanController.php:233
* @route '/projects/{project}/plans/{plan}/tasks'
*/
createForm.post = (args: { project: number | { id: number }, plan: string | number | { id: string | number } } | [project: number | { id: number }, plan: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: create.url(args, options),
    method: 'post',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PlanController::link
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
export const link = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: link.url(args, options),
    method: 'post',
})

link.definition = {
    methods: ["post"],
    url: '/projects/{project}/plans/{plan}/tasks/{task}/link',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PlanController::link
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
link.url = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return link.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::link
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
link.post = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: link.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::link
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
const linkForm = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: link.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::link
* @see app/Http/Controllers/PlanController.php:202
* @route '/projects/{project}/plans/{plan}/tasks/{task}/link'
*/
linkForm.post = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: link.url(args, options),
    method: 'post',
})

link.form = linkForm

/**
* @see \App\Http\Controllers\PlanController::unlink
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
export const unlink = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: unlink.url(args, options),
    method: 'delete',
})

unlink.definition = {
    methods: ["delete"],
    url: '/projects/{project}/plans/{plan}/tasks/{task}/unlink',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PlanController::unlink
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
unlink.url = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return unlink.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PlanController::unlink
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
unlink.delete = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: unlink.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PlanController::unlink
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
const unlinkForm = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unlink.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PlanController::unlink
* @see app/Http/Controllers/PlanController.php:219
* @route '/projects/{project}/plans/{plan}/tasks/{task}/unlink'
*/
unlinkForm.delete = (args: { project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } } | [project: number | { id: number }, plan: string | number | { id: string | number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unlink.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

unlink.form = unlinkForm

const tasks = {
    create: Object.assign(create, create),
    link: Object.assign(link, link),
    unlink: Object.assign(unlink, unlink),
}

export default tasks