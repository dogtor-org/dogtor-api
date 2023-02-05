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
    try {
        const { email, password } = JSON.parse(req.body)
        if (!email || !password) {
            console.log("no_email_or_password")
            return BadRequest("Email ou senha incorretos")
        }

        const userRepository = new UserRepository()
        const user = await userRepository.getByEmail(email)
        if (!user.active) {
            console.log("user not found")
            return BadRequest("Email ou senha incorretos")
        }


        const hashPassword = await userRepository.getHashPassword(email)
        const isValidPassword = await bcrypt.compare(password, hashPassword)
        if (!isValidPassword) {
            console.log("password incorrect")
            return BadRequest("Email ou senha incorretos")
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            console.log("[panic] jwt secret not found")
            return InternalServerError()
        }

        const TOKEN_EXPIRE_IN_DAYS = 1
        const token = jwt.sign({ ...user }, secret, { expiresIn: `${TOKEN_EXPIRE_IN_DAYS}d` })
        return StatusOk({
            token: token,
            expires_at: moment().add(TOKEN_EXPIRE_IN_DAYS, "days").toISOString(),
        })
    } catch (err) {
        console.log(JSON.stringify(err))
        return InternalServerError()
    }
}

export const getUser = async (headers: APIGatewayProxyEventHeaders): Promise<DBUser> => {
    try {
        const userRepository = new UserRepository()
        const authorization = headers["authorization"] ?? headers["Authorization"]

        const { user_uuid } = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET) as JwtPayload

        console.log(`searching for user_uuid: ${user_uuid}`)
        const user = await userRepository.getByUUID(user_uuid)
        return user
    } catch (err) {
        switch (err["message"]) {
            case "invalid signature":
                console.log('invalid signature')
                break;
            default:
                console.log(JSON.stringify(err))
                break;
        }

        return null
    }
}
