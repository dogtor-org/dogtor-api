import { HttpRequest, HttpRequestHeaders } from '@azure/functions'
import * as _ from "lodash"
import { CallbackFunction } from '../../services/interfaces/infra/Context'
import Handler from '../../services/interfaces/infra/Handler'
import { UserRepository } from '../../services/repositories/UserRepository'
import { Route } from '../../services/routes'
import { BadRequest, InternalServerError, RouteNotFound, Unauthorized } from '../../utils/responses'
import * as jwt from "jsonwebtoken"

export type JwtPayload = {
    user_id: string
    user_uuid: string
    email: string
}
export default class Router {

    constructor(
        private routes: Map<Route, Handler>,
        private req: HttpRequest
    ) { }

    process(): Handler {
        const _req = this.parseRequest(this.req)
        let controller: Handler = RouteNotFound

        this.routes.forEach((_controller: Handler, route: Route) => {
            if (_.isEqual(_req, route)) {
                controller = _controller
            }
        })

        return controller
    }

    parseRequest(req: HttpRequest): Route {
        const url = req.url.split("/").splice(4)
        return {
            method: req.method,
            path: url.join("/"),
        }
    }

    checkAuthorization = async (callback: CallbackFunction, { authorization }: HttpRequestHeaders): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            if (!authorization) return resolve(false)

            const token = authorization.split(" ")[1]
            const secret = process.env.JWT_SECRET
            if (!secret) {
                return reject(InternalServerError(callback, "jwt secret not found"))
            }

            const { user_uuid } = jwt.verify(token, secret) as JwtPayload

            const userRepository = new UserRepository()
            const foundUser = await userRepository.getByUUID(user_uuid)
            if (!foundUser) {
                return reject(Unauthorized(callback))
            }

            return resolve(true)
        })
    }
}