import Handler from '../interfaces/infra/Handler'
import { PetService } from './../services/PetService';
import { InternalServerError } from './../../utils/responses/index';
import { PetRepository } from './../repositories/PetRepository';
import { Pet } from './../interfaces/types';
import { BadRequest } from '../../utils/responses'
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUser } from './AuthController';
import { NewPet } from '../interfaces/step';

async function getSvc(req: APIGatewayEvent): Promise<{ svc: PetService; err: APIGatewayProxyResult; }> {
    const user = await getUser(req.headers)
    if (!user.active) {
        return {
            svc: null,
            err: BadRequest("Usuário nao encontrado.")
        }
    }
    const petRepository = new PetRepository()
    return {
        svc: new PetService(user, petRepository),
        err: null,
    }
}

function translate(key: string): string {
    switch (key) {
        case "fullName": return "Nome";
        case "birthDate": return "Data de nascimento";
        case "size": return "Tamanho";
        case "weight": return "Peso";
        case "description": return "Descrição";
        case "specieID": return "espécie";
        case "raceID": return "raça";
        default: return key;
    }
}

export const GetAllPets: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        return await svc.getAllByUserID()
    } catch (err) {
        console.log(JSON.stringify(err))
        return InternalServerError()
    }
}

export const CreatePet: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        let body = JSON.parse(req.body)
        let payload: NewPet = {
            fullName: body.fullName,
            birthDate: body.birthDate,
            size: body.size,
            weight: body.weight,
            description: body.description,
            specieID: body.specieID,
            raceID: body.raceID,
        };

        for (const key of Object.keys(payload)) {
            if (!payload[key]) {
                return BadRequest(`O campo ${translate(key)} é obrigatório.`)
            }
        }

        return await svc.createPet(payload)
    } catch (err) {
        console.log(JSON.parse(err))
        return InternalServerError()
    }
}

export const GetPet: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        const { uuid } = req.pathParameters
        if (!uuid) {
            return BadRequest("Campo de id nao pode ser vazio")
        }

        return await svc.getPet(uuid)
    } catch (err) {
        console.log(JSON.parse(err))
        return InternalServerError()
    }
}

export const UpdatePet: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        const { uuid } = req.pathParameters
        if (!uuid) {
            return BadRequest("Campo de id nao pode ser vazio")
        }

        let body = JSON.parse(req.body)
        let pet: Pet = {
            uuid,
            fullName: body.fullName,
            birthDate: body.birthDate,
            size: body.size,
            weight: body.weight,
            description: body.description,
            specieID: body.specieID,
            raceID: body.raceID,
            userID: 0
        };

        return await svc.updatePet(pet)
    } catch (err) {
        console.log(JSON.parse(err))
        return InternalServerError()
    }
}

export const DeletePet: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        const { uuid } = req.pathParameters
        if (!uuid) {
            return BadRequest("Campo de id nao pode ser vazio")
        }

        return await svc.deletePet(uuid)
    } catch (err) {
        console.log(JSON.parse(err))
        return InternalServerError()
    }
}