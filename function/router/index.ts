import * as _ from "lodash"
import Handler from '../../services/interfaces/infra/Handler'
import { UserRepository } from '../../services/repositories/UserRepository'
import { Route } from '../../services/routes'
import { InternalServerError, NotFound, Unauthorized } from '../../utils/responses'
import * as jwt from "jsonwebtoken"
import { APIGatewayEvent, APIGatewayProxyCallback, APIGatewayProxyEventHeaders } from "aws-lambda"

export type JwtPayload = {
    user_id: string
    user_uuid: string
    email: string
}
export default class Router {

    constructor(
        private routes: Map<Route, Handler>,
        private req: APIGatewayEvent
    ) { }

    process(): Handler {
        const _req = this.parseRequest(this.req)
        let controller: Handler = null

        this.routes.forEach((_controller: Handler, route: Route) => {
            if (_.isEqual(_req, route)) {
                controller = _controller
            }
        })

        return controller
    }

    parseRequest(req: APIGatewayEvent): Route {
        return {
            method: req.httpMethod,
            path: req.path,
        }
    }

    checkAuthorization = async ({ authorization }: APIGatewayProxyEventHeaders): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            if (!authorization) return resolve(false)

            const token = authorization.split(" ")[1]
            const secret = process.env.JWT_SECRET
            if (!secret) {
                return reject(InternalServerError("jwt secret not found"))
            }

            const { user_uuid } = jwt.verify(token, secret) as JwtPayload

            const userRepository = new UserRepository()
            const foundUser = await userRepository.getByUUID(user_uuid)
            if (!foundUser) {
                return reject(Unauthorized())
            }

            return resolve(true)
        })
    }
}