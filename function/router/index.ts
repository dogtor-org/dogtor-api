import * as _ from "lodash"
import * as jwt from "jsonwebtoken"
import Handler from '../../services/interfaces/infra/Handler'
import { UserRepository } from '../../services/repositories/UserRepository'
import { Route } from '../../services/routes'
import { APIGatewayEvent, APIGatewayProxyEventHeaders } from "aws-lambda"
import Logger from "../../utils/Logger"

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
            path: req.resource,
        }
    }

    checkAuthorization = async (headers: APIGatewayProxyEventHeaders): Promise<boolean> => {
        const log = new Logger("checkAuthorization")
        const map = new Map<string, string>()
        map.set("headers", JSON.stringify(headers))
        log.withFields(map)
        try {
            if (headers === undefined) {
                log.debug("headers is undefined")
                return false
            }

            const authorization = headers["authorization"] ?? headers["Authorization"]
            if (!authorization) {
                log.debug("authorization is not found")
                return false
            }

            const token = authorization.split(" ")[1]
            const secret = process.env.JWT_SECRET
            if (!secret) {
                log.debug("secret is not found")
                return false
            }

            const payload = jwt.verify(token, secret)
            log.debug(`payload: ${JSON.stringify(payload)}`)
            const { user_uuid } = payload as JwtPayload
            log.debug(`user_uuid: ${user_uuid}`)
            const userRepository = new UserRepository()
            log.debug(`user_uuid is (${!(!user_uuid)}) | userRepository is (${!(!userRepository)})`)
            const foundUser = await userRepository.getByUUID(user_uuid)
            if (!foundUser) {
                log.debug("user not found")
                return false
            }

            return true
        } catch (err) {
            switch (err["message"]) {
                case "invalid signature":
                    log.debug('invalid signature')
                    break;
                default:
                    log.debug(JSON.stringify(err))
                    break;
            }
            return false
        }
    }
}