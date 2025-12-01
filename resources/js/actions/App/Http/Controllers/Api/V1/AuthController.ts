import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\AuthController::createToken
* @see app/Http/Controllers/Api/V1/AuthController.php:12
* @route '/api/v1/auth/token'
*/
export const createToken = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createToken.url(options),
    method: 'post',
})

createToken.definition = {
    methods: ["post"],
    url: '/api/v1/auth/token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthController::createToken
* @see app/Http/Controllers/Api/V1/AuthController.php:12
* @route '/api/v1/auth/token'
*/
createToken.url = (options?: RouteQueryOptions) => {
    return createToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthController::createToken
* @see app/Http/Controllers/Api/V1/AuthController.php:12
* @route '/api/v1/auth/token'
*/
createToken.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createToken.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::createToken
* @see app/Http/Controllers/Api/V1/AuthController.php:12
* @route '/api/v1/auth/token'
*/
const createTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createToken.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::createToken
* @see app/Http/Controllers/Api/V1/AuthController.php:12
* @route '/api/v1/auth/token'
*/
createTokenForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: createToken.url(options),
    method: 'post',
})

createToken.form = createTokenForm

/**
* @see \App\Http\Controllers\Api\V1\AuthController::user
* @see app/Http/Controllers/Api/V1/AuthController.php:43
* @route '/api/v1/auth/user'
*/
export const user = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})

user.definition = {
    methods: ["get","head"],
    url: '/api/v1/auth/user',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthController::user
* @see app/Http/Controllers/Api/V1/AuthController.php:43
* @route '/api/v1/auth/user'
*/
user.url = (options?: RouteQueryOptions) => {
    return user.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthController::user
* @see app/Http/Controllers/Api/V1/AuthController.php:43
* @route '/api/v1/auth/user'
*/
user.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::user
* @see app/Http/Controllers/Api/V1/AuthController.php:43
* @route '/api/v1/auth/user'
*/
user.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: user.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::user
* @see app/Http/Controllers/Api/V1/AuthController.php:43
* @route '/api/v1/auth/user'
*/
const userForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: user.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::user
* @see app/Http/Controllers/Api/V1/AuthController.php:43
* @route '/api/v1/auth/user'
*/
userForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: user.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::user
* @see app/Http/Controllers/Api/V1/AuthController.php:43
* @route '/api/v1/auth/user'
*/
userForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: user.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

user.form = userForm

/**
* @see \App\Http\Controllers\Api\V1\AuthController::tokens
* @see app/Http/Controllers/Api/V1/AuthController.php:48
* @route '/api/v1/auth/tokens'
*/
export const tokens = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tokens.url(options),
    method: 'get',
})

tokens.definition = {
    methods: ["get","head"],
    url: '/api/v1/auth/tokens',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthController::tokens
* @see app/Http/Controllers/Api/V1/AuthController.php:48
* @route '/api/v1/auth/tokens'
*/
tokens.url = (options?: RouteQueryOptions) => {
    return tokens.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthController::tokens
* @see app/Http/Controllers/Api/V1/AuthController.php:48
* @route '/api/v1/auth/tokens'
*/
tokens.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tokens.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::tokens
* @see app/Http/Controllers/Api/V1/AuthController.php:48
* @route '/api/v1/auth/tokens'
*/
tokens.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tokens.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::tokens
* @see app/Http/Controllers/Api/V1/AuthController.php:48
* @route '/api/v1/auth/tokens'
*/
const tokensForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tokens.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::tokens
* @see app/Http/Controllers/Api/V1/AuthController.php:48
* @route '/api/v1/auth/tokens'
*/
tokensForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tokens.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::tokens
* @see app/Http/Controllers/Api/V1/AuthController.php:48
* @route '/api/v1/auth/tokens'
*/
tokensForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tokens.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tokens.form = tokensForm

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeToken
* @see app/Http/Controllers/Api/V1/AuthController.php:36
* @route '/api/v1/auth/token'
*/
export const revokeToken = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revokeToken.url(options),
    method: 'delete',
})

revokeToken.definition = {
    methods: ["delete"],
    url: '/api/v1/auth/token',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeToken
* @see app/Http/Controllers/Api/V1/AuthController.php:36
* @route '/api/v1/auth/token'
*/
revokeToken.url = (options?: RouteQueryOptions) => {
    return revokeToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeToken
* @see app/Http/Controllers/Api/V1/AuthController.php:36
* @route '/api/v1/auth/token'
*/
revokeToken.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revokeToken.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeToken
* @see app/Http/Controllers/Api/V1/AuthController.php:36
* @route '/api/v1/auth/token'
*/
const revokeTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeToken.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeToken
* @see app/Http/Controllers/Api/V1/AuthController.php:36
* @route '/api/v1/auth/token'
*/
revokeTokenForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeToken.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

revokeToken.form = revokeTokenForm

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeTokenById
* @see app/Http/Controllers/Api/V1/AuthController.php:58
* @route '/api/v1/auth/tokens/{token}'
*/
export const revokeTokenById = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revokeTokenById.url(args, options),
    method: 'delete',
})

revokeTokenById.definition = {
    methods: ["delete"],
    url: '/api/v1/auth/tokens/{token}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeTokenById
* @see app/Http/Controllers/Api/V1/AuthController.php:58
* @route '/api/v1/auth/tokens/{token}'
*/
revokeTokenById.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return revokeTokenById.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeTokenById
* @see app/Http/Controllers/Api/V1/AuthController.php:58
* @route '/api/v1/auth/tokens/{token}'
*/
revokeTokenById.delete = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: revokeTokenById.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeTokenById
* @see app/Http/Controllers/Api/V1/AuthController.php:58
* @route '/api/v1/auth/tokens/{token}'
*/
const revokeTokenByIdForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeTokenById.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AuthController::revokeTokenById
* @see app/Http/Controllers/Api/V1/AuthController.php:58
* @route '/api/v1/auth/tokens/{token}'
*/
revokeTokenByIdForm.delete = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: revokeTokenById.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

revokeTokenById.form = revokeTokenByIdForm

const AuthController = { createToken, user, tokens, revokeToken, revokeTokenById }

export default AuthController