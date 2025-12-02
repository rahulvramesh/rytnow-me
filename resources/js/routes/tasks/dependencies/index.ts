import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\TaskDependencyController::index
* @see app/Http/Controllers/TaskDependencyController.php:19
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
export const index = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/tasks/{task}/dependencies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TaskDependencyController::index
* @see app/Http/Controllers/TaskDependencyController.php:19
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
index.url = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskDependencyController::index
* @see app/Http/Controllers/TaskDependencyController.php:19
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
index.get = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::index
* @see app/Http/Controllers/TaskDependencyController.php:19
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
index.head = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::index
* @see app/Http/Controllers/TaskDependencyController.php:19
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
const indexForm = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::index
* @see app/Http/Controllers/TaskDependencyController.php:19
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
indexForm.get = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::index
* @see app/Http/Controllers/TaskDependencyController.php:19
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
indexForm.head = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TaskDependencyController::search
* @see app/Http/Controllers/TaskDependencyController.php:187
* @route '/projects/{project}/tasks/{task}/dependencies/search'
*/
export const search = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(args, options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/projects/{project}/tasks/{task}/dependencies/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TaskDependencyController::search
* @see app/Http/Controllers/TaskDependencyController.php:187
* @route '/projects/{project}/tasks/{task}/dependencies/search'
*/
search.url = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions) => {
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

    return search.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskDependencyController::search
* @see app/Http/Controllers/TaskDependencyController.php:187
* @route '/projects/{project}/tasks/{task}/dependencies/search'
*/
search.get = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::search
* @see app/Http/Controllers/TaskDependencyController.php:187
* @route '/projects/{project}/tasks/{task}/dependencies/search'
*/
search.head = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::search
* @see app/Http/Controllers/TaskDependencyController.php:187
* @route '/projects/{project}/tasks/{task}/dependencies/search'
*/
const searchForm = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::search
* @see app/Http/Controllers/TaskDependencyController.php:187
* @route '/projects/{project}/tasks/{task}/dependencies/search'
*/
searchForm.get = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::search
* @see app/Http/Controllers/TaskDependencyController.php:187
* @route '/projects/{project}/tasks/{task}/dependencies/search'
*/
searchForm.head = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

/**
* @see \App\Http\Controllers\TaskDependencyController::store
* @see app/Http/Controllers/TaskDependencyController.php:62
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
export const store = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/projects/{project}/tasks/{task}/dependencies',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TaskDependencyController::store
* @see app/Http/Controllers/TaskDependencyController.php:62
* @route '/projects/{project}/tasks/{task}/dependencies'
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
* @see \App\Http\Controllers\TaskDependencyController::store
* @see app/Http/Controllers/TaskDependencyController.php:62
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
store.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::store
* @see app/Http/Controllers/TaskDependencyController.php:62
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
const storeForm = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::store
* @see app/Http/Controllers/TaskDependencyController.php:62
* @route '/projects/{project}/tasks/{task}/dependencies'
*/
storeForm.post = (args: { project: number | { id: number }, task: number | { id: number } } | [project: number | { id: number }, task: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\TaskDependencyController::destroy
* @see app/Http/Controllers/TaskDependencyController.php:130
* @route '/projects/{project}/tasks/{task}/dependencies/{dependency}'
*/
export const destroy = (args: { project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/projects/{project}/tasks/{task}/dependencies/{dependency}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TaskDependencyController::destroy
* @see app/Http/Controllers/TaskDependencyController.php:130
* @route '/projects/{project}/tasks/{task}/dependencies/{dependency}'
*/
destroy.url = (args: { project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            project: args[0],
            task: args[1],
            dependency: args[2],
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
        dependency: typeof args.dependency === 'object'
        ? args.dependency.id
        : args.dependency,
    }

    return destroy.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace('{task}', parsedArgs.task.toString())
            .replace('{dependency}', parsedArgs.dependency.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TaskDependencyController::destroy
* @see app/Http/Controllers/TaskDependencyController.php:130
* @route '/projects/{project}/tasks/{task}/dependencies/{dependency}'
*/
destroy.delete = (args: { project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::destroy
* @see app/Http/Controllers/TaskDependencyController.php:130
* @route '/projects/{project}/tasks/{task}/dependencies/{dependency}'
*/
const destroyForm = (args: { project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TaskDependencyController::destroy
* @see app/Http/Controllers/TaskDependencyController.php:130
* @route '/projects/{project}/tasks/{task}/dependencies/{dependency}'
*/
destroyForm.delete = (args: { project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } } | [project: number | { id: number }, task: number | { id: number }, dependency: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const dependencies = {
    index: Object.assign(index, index),
    search: Object.assign(search, search),
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default dependencies