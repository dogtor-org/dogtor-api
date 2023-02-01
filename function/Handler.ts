import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { openRoutes, routesMap } from "../services/routes";
import * as dotenv from 'dotenv';
import { Unauthorized } from "../utils/responses";
import Router from './router';

export async function start(req: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback): Promise<void> {
    dotenv.config()
    const app = new Router(routesMap, req)

    console.log(`req: ${JSON.stringify(req)}`)

    const controller = app.process()
    if (!openRoutes.includes(controller.name)) {
        if (await app.checkAuthorization(callback, req.headers)) {
            controller(callback, req)
        } else {
            Unauthorized(callback)
        }
    } else {
        await controller(callback, req)
    }
};