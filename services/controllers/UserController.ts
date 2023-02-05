import Handler from '../interfaces/infra/Handler'
import { UserService } from './../services/UserService';
import { BadRequest, InternalServerError } from '../../utils/responses'
import { UserRepository } from '../repositories/UserRepository';
import { AddressRepository } from '../repositories/AddressRepository';
import { Register } from '../interfaces/step';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

async function getSvc(): Promise<{ svc: UserService; err: APIGatewayProxyResult; }> {
    const userRepository = new UserRepository()
    const addressRepository = new AddressRepository()

    return {
        svc: new UserService(userRepository, addressRepository),
        err: null,
    }
}

function translate(key: string): string {
    switch (key) {
        case "zipCode": return "código postal"
        case "country": return "país"
        case "city": return "cidade"
        case "streetName": return "nome da rua"
        case "number": return "número da casa"
        case "uuid": return "id"
        case "fullName": return "nome completo"
        case "hashCpf": return "cpf"
        case "email": return "email"
        case "birthDate": return "data de nascimento"
        case "address": return "endereço"
        case "cardInfo": return "dados de pagamento"
        default: return key;
    }
}

export const RegisterUser: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc()
        if (err !== null) {
            return err
        }

        let body = JSON.parse(req.body)
        let address = {
            zipCode: body.address.zipCode,
            country: body.address.country,
            city: body.address.city,
            streetName: body.address.streetName,
            number: body.address.number,
            additionalInfo: body.address.additionalInfo ?? "none"
        }
        for (const key of Object.keys(address)) {
            if (!address[key]) {
                return BadRequest(`O campo ${translate(key)} é obrigatório.`)
            }
        }

        let payload: Register = {
            fullName: body.fullName,
            birthDate: body.birthDate,
            cpf: body.cpf,
            address: address,
            email: body.email,
            phoneNumber: body.phoneNumber,
            password: body.password,
        };

        for (const key of Object.keys(payload)) {
            if (!payload[key]) {
                return BadRequest(`O campo ${translate(key)} é obrigatório.`)
            }
        }

        return await svc.registerUser(payload)
    } catch (err) {
        console.log(JSON.stringify(err))
        return InternalServerError()
    }
}