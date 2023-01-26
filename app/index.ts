import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { openRoutes, routesMap } from "../services/routes";
import Router from "./router"
import { BindingContext } from "../services/interfaces/infra/Context";
import * as dotenv from 'dotenv';
import { Unauthorized } from "../utils/responses";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    dotenv.config()
    const app = new Router(routesMap, req)
    function callback(ctx: BindingContext) {
        context.res = ctx.res
    }

    const controller = app.process()
    if (!openRoutes.includes(controller.name)) {
        if (await app.checkthorization(callback, req.headers)) {
            controller(callback, req)
        } else {
            Unauthorized(callback)
        }
    } else {
        await contoller(callback, req)
    }


export default httpTrigger;