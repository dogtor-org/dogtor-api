import { BadRequest, InternalServerError } from '../../utils/responses/index';
import { NoContent } from '../../utils/responses'
import { APIGatewayProxyResult } from 'aws-lambda';
import { Register } from '../interfaces/step';
import { UserRepository } from '../repositories/UserRepository';
import { AddressRepository } from '../repositories/AddressRepository';
import { Address } from '../interfaces/types';

export class UserService {
    constructor(
        private repo: UserRepository,
        private addressRepo: AddressRepository,
    ) { }

    async registerUser(user: Register): Promise<APIGatewayProxyResult> {
        const userAlreadyExists = await this.repo.alreadyExists(user.email)
        if (userAlreadyExists) {
            return BadRequest("Email já cadastrado")
        }

        const user_id = await this.repo.insert(user)
        if (!user_id) {
            console.log("couldn't insert user")
            return InternalServerError()
        }
        const insertedUser = await this.repo.getByID(user_id)
        const address: Address = {
            ...user.address,
        }

        const address_id = await this.addressRepo.insert(address, { user_uuid: insertedUser.user_uuid })
        if (!address_id) {
            console.log("couldn't insert address")
            return InternalServerError()
        }

        return NoContent()
    }
}
