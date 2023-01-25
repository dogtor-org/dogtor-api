import { CallbackFunction } from "../../services/interfaces/infra/Context"

export const StatusOk = (callback: CallbackFunction, data: any) => {
    callback({
        res: {
            statusCode: 200,
            body: JSON.stringify(data)
        },
    })
}

export const NoContent = (callback: CallbackFunction) => {
    callback({
        res: {
            statusCode: 201,
        },
    })
}

export function BadRequest(callback: CallbackFunction, data: any) {
    callback({
        res: {
            statusCode: 400,
            body: JSON.stringify(data)
        }
    })
}

export function Unauthorized(callback: CallbackFunction) {
    callback({
        res: {
            statusCode: 401,
        }
    })
}

export function NotFound(callback: CallbackFunction, data: any) {
    callback({
        res: {
            statusCode: 404,
            body: JSON.stringify(data)
        }
    })
}

export function InternalServerError(callback: CallbackFunction, data: any) {
    callback({
        res: {
            statusCode: 502,
            body: JSON.stringify(data)
        }
    })
}

export function RouteNotFound(callback: CallbackFunction): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        resolve(
            callback({
                res: {
                    statusCode: 404,
                    body: "Route not found."
                }
            })
        )
    })
}