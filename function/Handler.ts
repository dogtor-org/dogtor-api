import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { openRoutes, routesMap } from "../services/routes";
import * as dotenv from 'dotenv';
import { NotFound, Unauthorized } from "../utils/responses";
import Router from './router';

export async function start(req: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    dotenv.config()
    const app = new Router(routesMap, req)

    console.log(`req: ${JSON.stringify(req)}`)

    const controller = app.process()
    if (!openRoutes.includes(controller.name)) {
        if (await app.checkAuthorization(req.headers)) {
            return await controller(req)
        } else {
            return Unauthorized()
        }
    }

    return await controller(req)
};
