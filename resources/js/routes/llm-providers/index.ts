import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
export const fetchModels = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: fetchModels.url(options),
    method: 'post',
})

fetchModels.definition = {
    methods: ["post"],
    url: '/settings/llm-providers/fetch-models',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
fetchModels.url = (options?: RouteQueryOptions) => {
    return fetchModels.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
fetchModels.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: fetchModels.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
const fetchModelsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: fetchModels.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::fetchModels
* @see app/Http/Controllers/Settings/LlmProviderController.php:235
* @route '/settings/llm-providers/fetch-models'
*/
fetchModelsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: fetchModels.url(options),
    method: 'post',
})

fetchModels.form = fetchModelsForm

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::update
* @see app/Http/Controllers/Settings/LlmProviderController.php:69
* @route '/settings/llm-providers/{provider}'
*/
export const update = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
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
update.url = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
update.patch = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::update
* @see app/Http/Controllers/Settings/LlmProviderController.php:69
* @route '/settings/llm-providers/{provider}'
*/
const updateForm = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
updateForm.patch = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
export const destroy = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
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
destroy.url = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
destroy.delete = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::destroy
* @see app/Http/Controllers/Settings/LlmProviderController.php:103
* @route '/settings/llm-providers/{provider}'
*/
const destroyForm = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
destroyForm.delete = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Settings\LlmProviderController::defaultMethod
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
export const defaultMethod = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: defaultMethod.url(args, options),
    method: 'post',
})

defaultMethod.definition = {
    methods: ["post"],
    url: '/settings/llm-providers/{provider}/default',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::defaultMethod
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
defaultMethod.url = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return defaultMethod.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::defaultMethod
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
defaultMethod.post = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: defaultMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::defaultMethod
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
const defaultMethodForm = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: defaultMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::defaultMethod
* @see app/Http/Controllers/Settings/LlmProviderController.php:114
* @route '/settings/llm-providers/{provider}/default'
*/
defaultMethodForm.post = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: defaultMethod.url(args, options),
    method: 'post',
})

defaultMethod.form = defaultMethodForm

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::test
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
export const test = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(args, options),
    method: 'post',
})

test.definition = {
    methods: ["post"],
    url: '/settings/llm-providers/{provider}/test',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::test
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
test.url = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return test.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::test
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
test.post = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: test.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::test
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
const testForm = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::test
* @see app/Http/Controllers/Settings/LlmProviderController.php:125
* @route '/settings/llm-providers/{provider}/test'
*/
testForm.post = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: test.url(args, options),
    method: 'post',
})

test.form = testForm

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::models
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
export const models = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: models.url(args, options),
    method: 'get',
})

models.definition = {
    methods: ["get","head"],
    url: '/settings/llm-providers/{provider}/models',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::models
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
models.url = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return models.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::models
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
models.get = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: models.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::models
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
models.head = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: models.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::models
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
const modelsForm = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: models.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::models
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
modelsForm.get = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: models.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\LlmProviderController::models
* @see app/Http/Controllers/Settings/LlmProviderController.php:188
* @route '/settings/llm-providers/{provider}/models'
*/
modelsForm.head = (args: { provider: number | { id: number } } | [provider: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: models.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

models.form = modelsForm

const llmProviders = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    fetchModels: Object.assign(fetchModels, fetchModels),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    default: Object.assign(defaultMethod, defaultMethod),
    test: Object.assign(test, test),
    models: Object.assign(models, models),
}

export default llmProviders