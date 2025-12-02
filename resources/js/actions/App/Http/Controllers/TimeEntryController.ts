import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TimeEntryController::start
* @see app/Http/Controllers/TimeEntryController.php:18
* @route '/projects/{project}/tasks/{task}/time/start'
*/
export const start = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/time/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimeEntryController::start
* @see app/Http/Controllers/TimeEntryController.php:18
* @route '/projects/{project}/tasks/{task}/time/start'
*/
start.url = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return start.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeEntryController::start
* @see app/Http/Controllers/TimeEntryController.php:18
* @route '/projects/{project}/tasks/{task}/time/start'
*/
start.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeEntryController::start
* @see app/Http/Controllers/TimeEntryController.php:18
* @route '/projects/{project}/tasks/{task}/time/start'
*/
const startForm = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeEntryController::start
* @see app/Http/Controllers/TimeEntryController.php:18
* @route '/projects/{project}/tasks/{task}/time/start'
*/
startForm.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(args, options),
    method: 'post',
})

start.form = startForm

/**
* @see \App\Http\Controllers\TimeEntryController::stop
* @see app/Http/Controllers/TimeEntryController.php:50
* @route '/projects/{project}/tasks/{task}/time/stop'
*/
export const stop = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(args, options),
    method: 'post',
})

stop.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/time/stop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimeEntryController::stop
* @see app/Http/Controllers/TimeEntryController.php:50
* @route '/projects/{project}/tasks/{task}/time/stop'
*/
stop.url = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return stop.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeEntryController::stop
* @see app/Http/Controllers/TimeEntryController.php:50
* @route '/projects/{project}/tasks/{task}/time/stop'
*/
stop.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeEntryController::stop
* @see app/Http/Controllers/TimeEntryController.php:50
* @route '/projects/{project}/tasks/{task}/time/stop'
*/
const stopForm = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeEntryController::stop
* @see app/Http/Controllers/TimeEntryController.php:50
* @route '/projects/{project}/tasks/{task}/time/stop'
*/
stopForm.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: stop.url(args, options),
    method: 'post',
})

stop.form = stopForm

/**
* @see \App\Http\Controllers\TimeEntryController::store
* @see app/Http/Controllers/TimeEntryController.php:86
* @route '/projects/{project}/tasks/{task}/time'
*/
export const store = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/time',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimeEntryController::store
* @see app/Http/Controllers/TimeEntryController.php:86
* @route '/projects/{project}/tasks/{task}/time'
*/
store.url = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeEntryController::store
* @see app/Http/Controllers/TimeEntryController.php:86
* @route '/projects/{project}/tasks/{task}/time'
*/
store.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeEntryController::store
* @see app/Http/Controllers/TimeEntryController.php:86
* @route '/projects/{project}/tasks/{task}/time'
*/
const storeForm = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeEntryController::store
* @see app/Http/Controllers/TimeEntryController.php:86
* @route '/projects/{project}/tasks/{task}/time'
*/
storeForm.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\TimeEntryController::update
* @see app/Http/Controllers/TimeEntryController.php:111
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
export const update = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/projects/{project}/tasks/{task}/time/{timeEntry}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\TimeEntryController::update
* @see app/Http/Controllers/TimeEntryController.php:111
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
update.url = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
            timeEntry: args[2],
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
        timeEntry: typeof args.timeEntry === 'object'
        ? args.timeEntry.id
        : args.timeEntry,
    }

    return update.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace('{timeEntry}', parsedArgs.timeEntry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeEntryController::update
* @see app/Http/Controllers/TimeEntryController.php:111
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
update.put = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\TimeEntryController::update
* @see app/Http/Controllers/TimeEntryController.php:111
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
const updateForm = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeEntryController::update
* @see app/Http/Controllers/TimeEntryController.php:111
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
updateForm.put = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TimeEntryController::destroy
* @see app/Http/Controllers/TimeEntryController.php:146
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
export const destroy = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/tasks/{task}/time/{timeEntry}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TimeEntryController::destroy
* @see app/Http/Controllers/TimeEntryController.php:146
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
destroy.url = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
            timeEntry: args[2],
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
        timeEntry: typeof args.timeEntry === 'object'
        ? args.timeEntry.id
        : args.timeEntry,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace('{timeEntry}', parsedArgs.timeEntry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimeEntryController::destroy
* @see app/Http/Controllers/TimeEntryController.php:146
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
destroy.delete = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TimeEntryController::destroy
* @see app/Http/Controllers/TimeEntryController.php:146
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
const destroyForm = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TimeEntryController::destroy
* @see app/Http/Controllers/TimeEntryController.php:146
* @route '/projects/{project}/tasks/{task}/time/{timeEntry}'
*/
destroyForm.delete = (args: { project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, timeEntry: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const TimeEntryController = { start, stop, store, update, destroy }

export default TimeEntryController