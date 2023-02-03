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

    process(): {
        controller: Handler,
        found: boolean,
    } {
        const _req = this.parseRequest(this.req)
        let response = {
            controller: {} as Handler,
            found: false,
        }

        this.routes.forEach((_controller: Handler, route: Route) => {
            if (_.isEqual(_req, route)) {
                response.controller = _controller
                response.found = true
            }
        })

        return response
    }

    parseRequest(req: APIGatewayEvent): Route {
        return {
            method: req.httpMethod,
            path: req.path,
        }
    }

    checkAuthorization = async (headers: APIGatewayProxyEventHeaders): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            if (headers === undefined) {
                console.log("headers is undefined")
                return resolve(false)
            }

            const authorization = headers["authorization"] ?? headers["Authorization"]
            if (!authorization) {
                console.log("authorization not found")
                return resolve(false)
            }

            const token = authorization.split(" ")[1]
            const secret = process.env.JWT_SECRET
            if (!secret) {
                console.log("jwt secret not found")
                return reject(false)
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