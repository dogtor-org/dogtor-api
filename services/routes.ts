import * as AuthController from "./controllers/AuthController"
import * as UserController from "./controllers/UserController"
import * as PetController from "./controllers/PetController"
import * as CardInfoController from "./controllers/CardInfoController"
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
    path: '/pet/{pet_id}',
}
export const updateSomePet: Route = {
    method: 'PUT',
    path: '/pet/{pet_id}',
}
export const deleteSomePet: Route = {
    method: 'DELETE',
    path: '/pet/{pet_id}',
}
/* CARD INFO */
export const getAllCards: Route = {
    method: 'GET',
    path: '/card',
}
export const insertCard: Route = {
    method: 'POST',
    path: '/card',
}
export const getSomeCard: Route = {
    method: 'GET',
    path: '/card/{card_info_id}',
}
export const updateSomeCard: Route = {
    method: 'PUT',
    path: '/card/{card_info_id}',
}
export const deleteSomeCard: Route = {
    method: 'DELETE',
    path: '/card/{card_info_id}',
}

/**
 * Routes for application
 */
export const openRoutes = ["GetToken", "RegisterUser"]
export const routesMap = new Map<Route, Handler>([
    // AUTH
    [auth, AuthController.GetToken],
    // USER
    [registerUser, UserController.RegisterUser],
    [getAllPets, PetController.GetAllPets],
    // PET
    [insertPet, PetController.CreatePet],
    [getSomePet, PetController.GetPet],
    [updateSomePet, PetController.UpdatePet],
    [deleteSomePet, PetController.DeletePet],
    // CARD INFO
    [getAllCards, CardInfoController.GetAllCards],
    [insertCard, CardInfoController.CreateCard],
    [getSomeCard, CardInfoController.GetCard],
    [updateSomeCard, CardInfoController.UpdateCard],
    [deleteSomeCard, CardInfoController.DeleteCard],
])