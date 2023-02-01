import Handler from '../interfaces/infra/Handler'
import { NoContent, BadRequest } from '../../utils/responses'
import { UserRepository } from '../repositories/UserRepository';
import { AddressRepository } from '../repositories/AddressRepository';
import { Register } from '../interfaces/step';
import { Address } from '../interfaces/types';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const RegisterUser: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const user = JSON.parse(req.body) as Register
    const userRepository = new UserRepository()
    const addressRepository = new AddressRepository()

    const userAlreadyExists = await userRepository.alreadyExists(user.email)
    if (userAlreadyExists) {
        return BadRequest("Email já cadastrado")
    }

    const user_id = await userRepository.insert(user)
    if (!user_id) {
        return BadRequest("couldn't insert user")
    }
    const insertedUser = await userRepository.getByID(user_id)

    const address_id = await addressRepository.insert(user.address as Address, { user_uuid: insertedUser.uuid })
    if (!address_id) {
        return BadRequest("couldn't insert address")
    }

    return NoContent()
}