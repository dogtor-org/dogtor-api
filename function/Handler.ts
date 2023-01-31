import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { openRoutes, routesMap } from "../services/routes";
import * as dotenv from 'dotenv';
import { Unauthorized } from "../utils/responses";
import Router from './router';

export const start = async (req: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback): Promise<void> => {
    dotenv.config()
    const app = new Router(routesMap, req)

    console.log(`app: ${JSON.stringify(app)}`)
    console.log(`req: ${JSON.stringify(req)}`)
    console.log(`context: ${JSON.stringify(context)}`)
    console.log(`callback: ${JSON.stringify(callback)}`)

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