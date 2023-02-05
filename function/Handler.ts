import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { openRoutes, routesMap, validateRoutes } from "../services/routes";
import * as dotenv from 'dotenv';
import { InternalServerError, NotFound, Unauthorized } from "../utils/responses";
import Router from './router';
import MysqlConnection from '../libs/sql/connection';

export async function start(req: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
        // console.log(`req: ${JSON.stringify(req)}`)
        dotenv.config()

        const { ok, err } = validateRoutes(routesMap)
        if (!ok) {
            console.log("Invalid routes map, duplicated entry found: " + err)
            return InternalServerError()
        }

        const app = new Router(routesMap, req)
        const { controller, found } = app.process()
        if (!found) {
            console.log(`route: ${req.resource}`)
            return NotFound("Rota não encontrada")
        }

        if (openRoutes.includes(controller.name)) {
            return await controller(req)
        }

        const isAuthenticated = await app.checkAuthorization(req.headers)
        if (!isAuthenticated) {
            return Unauthorized()
        }

        return await controller(req)
    } finally {
        MysqlConnection.close()
    }
};
