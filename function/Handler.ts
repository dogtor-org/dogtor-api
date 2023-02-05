import * as dotenv from 'dotenv';
import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { openRoutes, routesMap } from "../services/routes";
import { NotFound, Unauthorized } from "../utils/responses";
import Router from './router';
import MysqlConnection from '../libs/sql/connection';
import Logger from '../utils/Logger';
import Clock from '../utils/Clock';

export async function start(req: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        const log = new Logger("Handler.start")
        Clock.start("execution")
        dotenv.config()

        const app = new Router(routesMap, req)
        const { controller, found } = app.process()
        if (!found) {
            log.warn(`route not found: ${req.resource}`)
            return NotFound("Rota não encontrada")
        }

        if (openRoutes.includes(controller.name)) {
            log.info(`open route: ${controller.name}`)
            return await controller(req)
        }

        const isAuthenticated = await app.checkAuthorization(req.headers)
        if (!isAuthenticated) {
            log.info(`unauthenticated`)
            return Unauthorized()
        }

        const result = await controller(req)

        return result
    } finally {
        Clock.end("execution")
        MysqlConnection.close()
    }
};
