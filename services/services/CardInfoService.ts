import moment = require('moment');
import { InternalServerError, StatusOk } from '../../utils/responses/index';
import { CardInfoRepository } from '../repositories/CardInfoRepository';
import { CardInfo } from '../interfaces/types';
import { NoContent, BadRequest } from '../../utils/responses'
import { APIGatewayProxyResult } from 'aws-lambda';
import { DBUser } from '../interfaces/database';
import { NewCardInfo } from '../interfaces/step';
import { sha1 } from '../../utils/hash';

export class CardInfoService {
    constructor(
        private user: DBUser,
        private repo: CardInfoRepository,
    ) { }

    async getAllByUserUUID(): Promise<APIGatewayProxyResult> {
        const cards = await this.repo.getAllByUserUUID(this.user.user_uuid)
        if (cards.length == 0) {
            return BadRequest("Nenhum cartão encontrado.")
        }

        const viewmodel = this.repo.parseAll(cards)
        return StatusOk(viewmodel)
    }

    async createCard(payload: NewCardInfo): Promise<APIGatewayProxyResult> {
        const cardInfo: CardInfo = {
            uuid: '',
            hashCpf: sha1(payload.cpf),
            cardNumber: payload.cardNumber,
            cardExpireDate: payload.cardExpireDate,
            cardFlag: payload.cardFlag
        }
        const card_info_id = await this.repo.insert(cardInfo, {
            user_uuid: this.user.user_uuid
        })
        if (!card_info_id) {
            console.log("couldn't insert card info")
            return InternalServerError()
        }

        return NoContent()
    }

    async getCardInfo(uuid: string): Promise<APIGatewayProxyResult> {
        const cardInfo = await this.repo.getByUUID(uuid)
        if (!cardInfo.uuid) {
            return BadRequest("Cartão não encontrado.")
        }

        const viewmodel = this.repo.parse(cardInfo)
        return StatusOk(viewmodel)
    }

    async updateCardInfo(payload: NewCardInfo, uuid: string): Promise<APIGatewayProxyResult> {
        const cardInfo: CardInfo = {
            uuid: uuid,
            hashCpf: sha1(payload.cpf),
            cardNumber: payload.cardNumber,
            cardExpireDate: payload.cardExpireDate,
            cardFlag: payload.cardFlag
        }
        const newCard = await this.repo.update(cardInfo)

        return StatusOk(newCard)
    }

    async deleteCardInfo(uuid: string): Promise<APIGatewayProxyResult> {
        const ok = await this.repo.remove(uuid)
        if (!ok) {
            console.log("Failed to remove cardInfo")
            return InternalServerError()
        }

        return NoContent()
    }
}
