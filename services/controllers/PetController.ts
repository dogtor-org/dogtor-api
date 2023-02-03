import Handler from '../interfaces/infra/Handler'
import { InternalServerError, StatusOk } from './../../utils/responses/index';
import { PetRepository } from './../repositories/PetRepository';
import { Pet } from './../interfaces/types';
import { NoContent, BadRequest } from '../../utils/responses'
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUser } from './AuthController';

export const GetAllPets: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const user = await getUser(req.headers)
    if (!user.active) {
        return BadRequest("Usuário nao encontrado.")
    }

    const petRepository = new PetRepository()
    const pets = await petRepository.getAllByUserID(user.user_id)
    if (pets.length == 0) {
        return BadRequest("Nenhum pet encontrado.")
    }

    const viewmodel = petRepository.parseAll(pets)
    return StatusOk(viewmodel)
}

export const CreatePet: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const pet = JSON.parse(req.body) as Pet
    const petRepository = new PetRepository()

    const user = await getUser(req.headers)

    pet.userUUID = user.user_uuid
    if (!pet.userUUID) {
        return BadRequest("Usuário nao encontrado.")
    }

    const pet_id = await petRepository.insert(pet)
    if (!pet_id) {
        return BadRequest("couldn't insert pet")
    }

    return NoContent()
}

export const GetPet: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const { uuid } = req.pathParameters
    if (!uuid) {
        return BadRequest("Campo de id nao pode ser vazio")
    }

    const petRepository = new PetRepository()

    const pet = await petRepository.getByUUID(uuid)
    if (!pet.uuid) {
        return BadRequest("Pet nao encontrado.")
    }

    const viewmodel = petRepository.parse(pet)
    return StatusOk(viewmodel)
}

export const UpdatePet: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { uuid } = req.pathParameters
        if (!uuid) {
            return BadRequest("Campo de id nao pode ser vazio")
        }

        const petRepository = new PetRepository()
        const newPet = JSON.parse(req.body) as Pet
        for (const [key, value] of Object.keys(newPet)) {
            await petRepository.update(newPet, key, value)
        }

        return NoContent()
    } catch (err) {
        return InternalServerError("Não foi possível atualizar o pet escolhido no momento. Tente novamente mais tarde")
    }
}

export const DeletePet: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { uuid } = req.pathParameters
        if (!uuid) {
            return BadRequest("Campo de id nao pode ser vazio")
        }

        const petRepository = new PetRepository()
        const ok = await petRepository.remove(uuid)
        if (!ok) {
            throw new Error(`Failed to remove pet`)
        }

        return NoContent()
    } catch (err) {
        return InternalServerError("Não foi possível atualizar o pet escolhido no momento. Tente novamente mais tarde")
    }
}