import moment = require('moment');
import { InternalServerError, StatusOk } from '../../utils/responses/index';
import { PetRepository } from '../repositories/PetRepository';
import { Pet } from '../interfaces/types';
import { NoContent, BadRequest } from '../../utils/responses'
import { APIGatewayProxyResult } from 'aws-lambda';
import { NewPet } from '../interfaces/step';
import { DBUser } from '../interfaces/database';

export class PetService {
    constructor(
        private user: DBUser,
        private repo: PetRepository,
    ) { }

    async getAllByUserID(): Promise<APIGatewayProxyResult> {
        const pets = await this.repo.getAllByUserID(this.user.user_id)
        if (pets.length == 0) {
            return BadRequest("Nenhum pet encontrado.")
        }

        const viewmodel = this.repo.parseAll(pets)
        return StatusOk(viewmodel)
    }

    async createPet(payload: NewPet): Promise<APIGatewayProxyResult> {
        const pet: Pet = {
            uuid: '',
            ...payload,
            birthDate: moment(payload.birthDate),
            userID: this.user.user_id
        }
        const pet_id = await this.repo.insert(pet)
        if (!pet_id) {
            console.log("couldn't insert pet")
            return InternalServerError()
        }

        return NoContent()
    }

    async getPet(uuid: string): Promise<APIGatewayProxyResult> {
        const pet = await this.repo.getByUUID(uuid)
        if (!pet.uuid) {
            return BadRequest("Pet nao encontrado.")
        }

        const viewmodel = this.repo.parse(pet)
        return StatusOk(viewmodel)
    }

    async updatePet(newPet: Pet): Promise<APIGatewayProxyResult> {
        newPet.userID = this.user.user_id
        await this.repo.update(newPet)

        return NoContent()
    }

    async deletePet(uuid: string): Promise<APIGatewayProxyResult> {
        const ok = await this.repo.remove(uuid)
        if (!ok) {
            console.log("Failed to remove pet")
            return InternalServerError()
        }

        return NoContent()
    }
}
