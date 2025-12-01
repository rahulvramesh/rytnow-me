import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\LlmProviderController::index
* @see app/Http/Controllers/Settings/LlmProviderController.php:16
* @route '/settings/llm-providers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/llm-providers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::index
* @see app/Http/Controllers/Settings/LlmProviderController.php:16
* @route '/settings/llm-providers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::index
* @see app/Http/Controllers/Settings/LlmProviderController.php:16
* @route '/settings/llm-providers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::index
* @see app/Http/Controllers/Settings/LlmProviderController.php:16
* @route '/settings/llm-providers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::index
* @see app/Http/Controllers/Settings/LlmProviderController.php:16
* @route '/settings/llm-providers'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::index
* @see app/Http/Controllers/Settings/LlmProviderController.php:16
* @route '/settings/llm-providers'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::index
* @see app/Http/Controllers/Settings/LlmProviderController.php:16
* @route '/settings/llm-providers'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::store
* @see app/Http/Controllers/Settings/LlmProviderController.php:41
* @route '/settings/llm-providers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/settings/llm-providers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::store
* @see app/Http/Controllers/Settings/LlmProviderController.php:41
* @route '/settings/llm-providers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::store
* @see app/Http/Controllers/Settings/LlmProviderController.php:41
* @route '/settings/llm-providers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::store
* @see app/Http/Controllers/Settings/LlmProviderController.php:41
* @route '/settings/llm-providers'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::store
* @see app/Http/Controllers/Settings/LlmProviderController.php:41
* @route '/settings/llm-providers'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModelsFromEndpoint
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
export const fetchModelsFromEndpoint = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: fetchModelsFromEndpoint.url(options),
    method: 'post',
})

fetchModelsFromEndpoint.definition = {
    methods: ["post"],
    url: '/settings/llm-providers/fetch-models',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModelsFromEndpoint
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
fetchModelsFromEndpoint.url = (options?: RouteQueryOptions) => {
    return fetchModelsFromEndpoint.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModelsFromEndpoint
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
fetchModelsFromEndpoint.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: fetchModelsFromEndpoint.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModelsFromEndpoint
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
const fetchModelsFromEndpointForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: fetchModelsFromEndpoint.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModelsFromEndpoint
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
fetchModelsFromEndpointForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: fetchModelsFromEndpoint.url(options),
    method: 'post',
})

fetchModelsFromEndpoint.form = fetchModelsFromEndpointForm

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::update
* @see app/Http/Controllers/Settings/LlmProviderController.php:69
* @route '/settings/llm-providers/{provider}'
*/
export const update = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/llm-providers/{provider}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::update
* @see app/Http/Controllers/Settings/LlmProviderController.php:69
* @route '/settings/llm-providers/{provider}'
*/
update.url = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { provider: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            provider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        provider: typeof args.provider === 'object'
        ? args.provider.id
        : args.provider,
    }

    return update.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::update
* @see app/Http/Controllers/Settings/LlmProviderController.php:69
* @route '/settings/llm-providers/{provider}'
*/
update.patch = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::update
* @see app/Http/Controllers/Settings/LlmProviderController.php:69
* @route '/settings/llm-providers/{provider}'
*/
const updateForm = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::update
* @see app/Http/Controllers/Settings/LlmProviderController.php:69
* @route '/settings/llm-providers/{provider}'
*/
updateForm.patch = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\LlmProviderController::destroy
* @see app/Http/Controllers/Settings/LlmProviderController.php:103
* @route '/settings/llm-providers/{provider}'
*/
export const destroy = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/llm-providers/{provider}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::destroy
* @see app/Http/Controllers/Settings/LlmProviderController.php:103
* @route '/settings/llm-providers/{provider}'
*/
destroy.url = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { provider: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            provider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        provider: typeof args.provider === 'object'
        ? args.provider.id
        : args.provider,
    }

    return destroy.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::destroy
* @see app/Http/Controllers/Settings/LlmProviderController.php:103
* @route '/settings/llm-providers/{provider}'
*/
destroy.delete = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::destroy
* @see app/Http/Controllers/Settings/LlmProviderController.php:103
* @route '/settings/llm-providers/{provider}'
*/
const destroyForm = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::destroy
* @see app/Http/Controllers/Settings/LlmProviderController.php:103
* @route '/settings/llm-providers/{provider}'
*/
destroyForm.delete = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\LlmProviderController::setDefault
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
export const setDefault = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setDefault.url(args, options),
    method: 'post',
})

setDefault.definition = {
    methods: ["post"],
    url: '/settings/llm-providers/{provider}/default',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::setDefault
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
setDefault.url = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { provider: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            provider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        provider: typeof args.provider === 'object'
        ? args.provider.id
        : args.provider,
    }

    return setDefault.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::setDefault
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
setDefault.post = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setDefault.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::setDefault
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
const setDefaultForm = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setDefault.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::setDefault
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
setDefaultForm.post = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: setDefault.url(args, options),
    method: 'post',
})

setDefault.form = setDefaultForm

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::testConnection
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
export const testConnection = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testConnection.url(args, options),
    method: 'post',
})

testConnection.definition = {
    methods: ["post"],
    url: '/settings/llm-providers/{provider}/test',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::testConnection
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
testConnection.url = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { provider: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            provider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        provider: typeof args.provider === 'object'
        ? args.provider.id
        : args.provider,
    }

    return testConnection.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::testConnection
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
testConnection.post = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testConnection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::testConnection
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
const testConnectionForm = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: testConnection.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::testConnection
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
testConnectionForm.post = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: testConnection.url(args, options),
    method: 'post',
})

testConnection.form = testConnectionForm

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
export const fetchModels = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fetchModels.url(args, options),
    method: 'get',
})

fetchModels.definition = {
    methods: ["get","head"],
    url: '/settings/llm-providers/{provider}/models',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
fetchModels.url = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { provider: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            provider: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        provider: typeof args.provider === 'object'
        ? args.provider.id
        : args.provider,
    }

    return fetchModels.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
fetchModels.get = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fetchModels.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
fetchModels.head = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fetchModels.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
const fetchModelsForm = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fetchModels.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
fetchModelsForm.get = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fetchModels.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
fetchModelsForm.head = (args: { provider: string | number | { id: string | number } } | [provider: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fetchModels.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

fetchModels.form = fetchModelsForm

const LlmProviderController = { index, store, fetchModelsFromEndpoint, update, destroy, setDefault, testConnection, fetchModels }

export default LlmProviderController