import * as AuthController from "./controllers/AuthController"
import * as UserController from "./controllers/UserController"
import Handler from "./interfaces/infra/Handler"

export type Route = {
    method: string
    path: string
}

// The 'v1/' prefix is mandatory, once it is the "base path" of the function
// Unless you're targeting another function, then you must use the new "base path" as prefix
export const auth: Route = {
    method: 'POST',
    path: '/auth',
}
export const registerUser: Route = {
    method: 'POST',
    path: '/user/register',
}

/**
 * Routes for application
 */
export const openRoutes = ["GetToken", "RegisterUser"]
export const routesMap = new Map<Route, Handler>([
    [auth, AuthController.GetToken],
    [registerUser, UserController.RegisterUser],
])