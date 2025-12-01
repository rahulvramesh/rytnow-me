import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AudioRecordingController::store
* @see app/Http/Controllers/AudioRecordingController.php:19
* @route '/projects/{project}/tasks/{task}/recordings'
*/
export const store = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/recordings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AudioRecordingController::store
* @see app/Http/Controllers/AudioRecordingController.php:19
* @route '/projects/{project}/tasks/{task}/recordings'
*/
store.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\AudioRecordingController::store
* @see app/Http/Controllers/AudioRecordingController.php:19
* @route '/projects/{project}/tasks/{task}/recordings'
*/
store.post = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AudioRecordingController::store
* @see app/Http/Controllers/AudioRecordingController.php:19
* @route '/projects/{project}/tasks/{task}/recordings'
*/
const storeForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AudioRecordingController::store
* @see app/Http/Controllers/AudioRecordingController.php:19
* @route '/projects/{project}/tasks/{task}/recordings'
*/
storeForm.post = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\AudioRecordingController::stream
* @see app/Http/Controllers/AudioRecordingController.php:44
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
export const stream = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

stream.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/tasks/{task}/recordings/{audioRecording}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AudioRecordingController::stream
* @see app/Http/Controllers/AudioRecordingController.php:44
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
stream.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
            audioRecording: args[2],
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
        audioRecording: typeof args.audioRecording === 'object'
        ? args.audioRecording.id
        : args.audioRecording,
    }

    return stream.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace('{audioRecording}', parsedArgs.audioRecording.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AudioRecordingController::stream
* @see app/Http/Controllers/AudioRecordingController.php:44
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
stream.get = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AudioRecordingController::stream
* @see app/Http/Controllers/AudioRecordingController.php:44
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
stream.head = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stream.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AudioRecordingController::stream
* @see app/Http/Controllers/AudioRecordingController.php:44
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
const streamForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AudioRecordingController::stream
* @see app/Http/Controllers/AudioRecordingController.php:44
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
streamForm.get = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AudioRecordingController::stream
* @see app/Http/Controllers/AudioRecordingController.php:44
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
streamForm.head = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stream.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

stream.form = streamForm

/**
* @see \App\Http\Controllers\AudioRecordingController::destroy
* @see app/Http/Controllers/AudioRecordingController.php:59
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
export const destroy = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/tasks/{task}/recordings/{audioRecording}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AudioRecordingController::destroy
* @see app/Http/Controllers/AudioRecordingController.php:59
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
destroy.url = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
            audioRecording: args[2],
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
        audioRecording: typeof args.audioRecording === 'object'
        ? args.audioRecording.id
        : args.audioRecording,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace('{audioRecording}', parsedArgs.audioRecording.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AudioRecordingController::destroy
* @see app/Http/Controllers/AudioRecordingController.php:59
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
destroy.delete = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\AudioRecordingController::destroy
* @see app/Http/Controllers/AudioRecordingController.php:59
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
const destroyForm = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AudioRecordingController::destroy
* @see app/Http/Controllers/AudioRecordingController.php:59
* @route '/projects/{project}/tasks/{task}/recordings/{audioRecording}'
*/
destroyForm.delete = (args: { project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } } | [project: string | number | { id: string | number }, task: string | number | { id: string | number }, audioRecording: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const recordings = {
    store: Object.assign(store, store),
    stream: Object.assign(stream, stream),
    destroy: Object.assign(destroy, destroy),
}

export default recordings