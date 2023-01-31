import { APIGatewayProxyCallback } from 'aws-lambda';

export const StatusOk = (callback: APIGatewayProxyCallback, data: any) => {
    callback(null, {
        statusCode: 200,
        body: JSON.stringify(data)
    })
}

export const NoContent = (callback: APIGatewayProxyCallback) => {
    callback(null, {
        statusCode: 201,
        body: ''
    })
}

export function BadRequest(callback: APIGatewayProxyCallback, data: any) {
    callback(null, {
        statusCode: 400,
        body: JSON.stringify(data)
    })
}

export function Unauthorized(callback: APIGatewayProxyCallback) {
    callback(null, {
        statusCode: 401,
        body: ''
    })
}

export function NotFound(callback: APIGatewayProxyCallback, data: any) {
    callback(null, {
        statusCode: 404,
        body: JSON.stringify(data)
    })
}

export function InternalServerError(callback: APIGatewayProxyCallback, data: any) {
    callback(null, {
        statusCode: 502,
        body: JSON.stringify(data)
    })
}

export function RouteNotFound(callback: APIGatewayProxyCallback): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        resolve(
            callback(null, {
                statusCode: 404,
                body: "Route not found."
            })
        )
    })
}