import { Context, APIGatewayProxyCallback, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { openRoutes, routesMap } from "../services/routes";
import * as dotenv from 'dotenv';
import { Unauthorized } from "../utils/responses";
import Router from './router';

export async function start(req: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    dotenv.config()
    const app = new Router(routesMap, req)

    console.log(`req: ${JSON.stringify(req)}`)

    let response: APIGatewayProxyResult = {
        statusCode: 424,
        body: 'Missing Dependency',
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    }

    const callback: APIGatewayProxyCallback = (error?: string | Error, result?: APIGatewayProxyResult) => {
        if (!error) {
            response = result
        }
    }

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

    return response
};