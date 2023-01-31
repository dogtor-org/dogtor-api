import Handler from '../interfaces/infra/Handler'
import { NoContent, BadRequest } from '../../utils/responses'
import { UserRepository } from '../repositories/UserRepository';
import { AddressRepository } from '../repositories/AddressRepository';
import { Register } from '../interfaces/step';
import { Address } from '../interfaces/types';
import { APIGatewayEvent, APIGatewayProxyCallback } from 'aws-lambda';

export const RegisterUser: Handler = async (callback: APIGatewayProxyCallback, req: APIGatewayEvent): Promise<any> => {
    return new Promise<any>(async (resolve, reject) => {
        const user = JSON.parse(req.body) as Register
        const userRepository = new UserRepository()
        const addressRepository = new AddressRepository()

        const userAlreadyExists = await userRepository.alreadyExists(user.email)
        if (userAlreadyExists) {
            return reject(BadRequest(callback, "Email já cadastrado"))
        }

        const address_id = await addressRepository.insert(user.address as Address)
        if (!address_id) {
            return reject(BadRequest(callback, "couldn't insert address"))
        }

        await userRepository.insert(user, { address_id })
        resolve(NoContent(callback))
    })
}