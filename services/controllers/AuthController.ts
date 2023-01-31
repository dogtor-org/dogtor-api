import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken"
import * as moment from 'moment';
import Handler from '../interfaces/infra/Handler'
import { BadRequest, InternalServerError, StatusOk } from '../../utils/responses'
import { UserRepository } from '../repositories/UserRepository'
import { JwtPayload } from '../../function/router';
import { User } from '../interfaces/types';
import { APIGatewayEvent, APIGatewayProxyCallback, APIGatewayProxyEventHeaders } from 'aws-lambda';

export const GetToken: Handler = async (callback: APIGatewayProxyCallback, req: APIGatewayEvent): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = JSON.parse(req.body)
        if (!email || !password) return reject(BadRequest(callback, "no_email_or_password"))

        const userRepository = new UserRepository()
        const hashPassword = await userRepository.getHashPassword(email)
        if (!hashPassword) {
            // TODO lib de retorno de erros
            return reject(BadRequest(callback, "Email não cadastrado"))
        }

        const isValidPassword = await bcrypt.compare(password, hashPassword)
        if (!isValidPassword) {
            return reject(BadRequest(callback, "senha incorreta"))
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            return reject(InternalServerError(callback, "jwt secret not found"))
        }

        const user = await userRepository.getByEmail(email)

        const TOKEN_EXPIRE_IN_DAYS = 1

        const token = jwt.sign({ ...user }, secret, { expiresIn: `${TOKEN_EXPIRE_IN_DAYS}d` })
        resolve(StatusOk(callback, {
            token: token,
            expires_at: moment().add(TOKEN_EXPIRE_IN_DAYS, "days").toISOString(),
        }))
    })
}

export const getUser = async ({ authorization }: APIGatewayProxyEventHeaders): Promise<User> => {
    return new Promise(async (resolve, reject) => {
        const userRepository = new UserRepository()
        const { user_uuid } = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET) as JwtPayload

        return resolve(await userRepository.getByUUID(user_uuid))
    })
}
