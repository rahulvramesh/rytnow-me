import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\LabelController::attach
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
export const attach = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attach.url(args, options),
    method: 'post',
})

attach.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/labels',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LabelController::attach
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
attach.url = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: typeof args.project === 'object'
        ? args.project.id
        : args.project,
        task: typeof args.task === 'object'
        ? args.task.id
        : args.task,
    }

    return attach.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LabelController::attach
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
attach.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: attach.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabelController::attach
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
const attachForm = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attach.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabelController::attach
* @see app/Http/Controllers/LabelController.php:73
* @route '/projects/{project}/tasks/{task}/labels'
*/
attachForm.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: attach.url(args, options),
    method: 'post',
})

attach.form = attachForm

const labels = {
    attach: Object.assign(attach, attach),
}

export default labels