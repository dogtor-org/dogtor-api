import Handler from '../interfaces/infra/Handler'
import { InternalServerError } from './../../utils/responses/index';
import { BadRequest } from '../../utils/responses'
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUser } from './AuthController';
import { CardInfoRepository } from '../repositories/CardInfoRepository';
import { CardInfoService } from '../services/CardInfoService';
import { CardInfo } from '../interfaces/types';
import { NewCardInfo } from '../interfaces/step';

async function getSvc(req: APIGatewayEvent): Promise<{ svc: CardInfoService; err: APIGatewayProxyResult; }> {
    const user = await getUser(req.headers)
    if (!user.active) {
        return {
            svc: null,
            err: BadRequest("Usuário nao encontrado.")
        }
    }
    const cardInfoRepository = new CardInfoRepository()
    return {
        svc: new CardInfoService(user, cardInfoRepository),
        err: null,
    }
}

function translate(key: string): string {
    switch (key) {
        case "uuid": return "id"
        case "hashCpf": return "cpf"
        case "cardNumber": return "número do cartão"
        case "cardExpireDate": return "data de expiração"
        case "cardFlag": return "bandeira do cartão"
        default: return key;
    }
}

export const GetAllCards: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        return await svc.getAllByUserUUID()
    } catch (err) {
        console.log(JSON.stringify(err))
        return InternalServerError()
    }
}

export const CreateCard: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        let body = JSON.parse(req.body)
        let payload: NewCardInfo = {
            cpf: body.cpf,
            cardNumber: body.cardNumber,
            cardExpireDate: body.cardExpireDate,
            cardFlag: body.cardFlag,
        };

        for (const key of Object.keys(payload)) {
            if (!payload[key]) {
                return BadRequest(`O campo ${translate(key)} é obrigatório.`)
            }
        }

        return await svc.createCard(payload)
    } catch (err) {
        console.log(JSON.parse(err))
        return InternalServerError()
    }
}

export const GetCard: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        const { card_info_id: uuid } = req.pathParameters
        if (!uuid) {
            return BadRequest("Campo de id nao pode ser vazio")
        }

        return await svc.getCardInfo(uuid)
    } catch (err) {
        console.log(JSON.parse(err))
        return InternalServerError()
    }
}

export const UpdateCard: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        const { card_info_id: uuid } = req.pathParameters
        if (!uuid) {
            return BadRequest("Campo de id nao pode ser vazio")
        }

        let body = JSON.parse(req.body)
        let payload: NewCardInfo = {
            cpf: body.cpf,
            cardNumber: body.cardNumber,
            cardExpireDate: body.cardExpireDate,
            cardFlag: body.cardFlag,
        };

        for (const key of Object.keys(payload)) {
            if (!payload[key]) {
                return BadRequest(`O campo ${translate(key)} é obrigatório.`)
            }
        }

        return await svc.updateCardInfo(payload, uuid)
    } catch (err) {
        console.log(JSON.parse(err))
        return InternalServerError()
    }
}

export const DeleteCard: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { svc, err } = await getSvc(req)
        if (err !== null) {
            return err
        }

        const { card_info_id: uuid } = req.pathParameters
        if (!uuid) {
            return BadRequest("Campo de id nao pode ser vazio")
        }

        return await svc.deleteCardInfo(uuid)
    } catch (err) {
        console.log(JSON.parse(err))
        return InternalServerError()
    }
}