import { Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { openRoutes, routesMap, validateRoutes } from "../services/routes";
import * as dotenv from 'dotenv';
import { InternalServerError, NotFound, Unauthorized } from "../utils/responses";
import Router from './router';

export async function start(req: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(`req: ${JSON.stringify(req)}`)
    dotenv.config()

    const { ok, err } = validateRoutes(routesMap)
    if (!ok) {
        console.log("Invalid routes map, duplicated entry found: " + err)
        return InternalServerError("Estamos passando por instabilidade. Por favor, tente novamente mais tarde!")
    }

    const app = new Router(routesMap, req)
    const { controller, found } = app.process()

    if (found && !openRoutes.includes(controller.name)) {
        if (await app.checkAuthorization(req.headers)) {
            return await controller(req)
        } else {
            return Unauthorized()
        }
    }

    return await controller(req)
};
