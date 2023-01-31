import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { openRoutes, routesMap } from "../services/routes";
import Router from "./router"
import * as dotenv from 'dotenv';
import { Unauthorized } from "../utils/responses";

export const handler = async (req: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback): Promise<void> => {
    dotenv.config()
    const app = new Router(routesMap, req)

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