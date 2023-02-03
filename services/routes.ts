import * as AuthController from "./controllers/AuthController"
import * as UserController from "./controllers/UserController"
import * as PetController from "./controllers/PetController"
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
/* PET */
export const getAllPets: Route = {
    method: 'GET',
    path: '/pet',
}
export const insertPet: Route = {
    method: 'POST',
    path: '/pet',
}
export const getSomePet: Route = {
    method: 'GET',
    path: '/pet/:pet_id',
}
export const updateSomePet: Route = {
    method: 'PUT',
    path: '/pet/:pet_id',
}
export const deleteSomePet: Route = {
    method: 'DELETE',
    path: '/pet/:pet_id',
}

/**
 * Routes for application
 */
export const openRoutes = ["GetToken", "RegisterUser"]
export const routesMap = new Map<Route, Handler>([
    [auth, AuthController.GetToken],
    [registerUser, UserController.RegisterUser],
    [getAllPets, PetController.GetAllPets],
    [insertPet, PetController.CreatePet],
    [getSomePet, PetController.GetPet],
    [updateSomePet, PetController.UpdatePet],
    [deleteSomePet, PetController.DeletePet],
])

export function validateRoutes(map: Map<Route, Handler>): { ok: boolean, err: string } {
    const valuesSoFar: Route[] = []
    map.forEach((value, key) => {
        if (valuesSoFar.includes(key)) {
            return {
                ok: false,
                err: key
            }
        }
        valuesSoFar.push(key)
    })

    return {
        ok: true,
        err: "",
    }
}