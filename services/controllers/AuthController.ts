import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken"
import * as moment from 'moment';
import Handler from '../interfaces/infra/Handler'
import { BadRequest, InternalServerError, StatusOk } from '../../utils/responses'
import { UserRepository } from '../repositories/UserRepository'
import { JwtPayload } from '../../function/router';
import { APIGatewayEvent, APIGatewayProxyResult, APIGatewayProxyEventHeaders } from 'aws-lambda';
import { DBUser } from '../interfaces/database';

export const GetToken: Handler = async (req: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = JSON.parse(req.body)
        if (!email || !password) return resolve(BadRequest("no_email_or_password"))

        const userRepository = new UserRepository()
        const hashPassword = await userRepository.getHashPassword(email)
        if (!hashPassword) {
            // TODO lib de retorno de erros
            return resolve(BadRequest("Email não cadastrado"))
        }

        const isValidPassword = await bcrypt.compare(password, hashPassword)
        if (!isValidPassword) {
            return resolve(BadRequest("senha incorreta"))
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            return resolve(InternalServerError("jwt secret not found"))
        }

        const user = await userRepository.getByEmail(email)

        const TOKEN_EXPIRE_IN_DAYS = 1

        const token = jwt.sign({ ...user }, secret, { expiresIn: `${TOKEN_EXPIRE_IN_DAYS}d` })
        return resolve(StatusOk({
            token: token,
            expires_at: moment().add(TOKEN_EXPIRE_IN_DAYS, "days").toISOString(),
        }))
    })
}

export const getUser = async ({ authorization }: APIGatewayProxyEventHeaders): Promise<DBUser> => {
    const userRepository = new UserRepository()
    const { user_uuid } = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET) as JwtPayload

    const user = await userRepository.getByUUID(user_uuid)
    return user
}
