import { APIGatewayProxyResult } from 'aws-lambda';

export const StatusOk = (data: any): APIGatewayProxyResult => {
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}

export const NoContent = (): APIGatewayProxyResult => {
    return {
        statusCode: 201,
        body: ''
    }
}

export function BadRequest(data: any): APIGatewayProxyResult {
    return {
        statusCode: 400,
        body: JSON.stringify(data)
    }
}

export function Unauthorized(): APIGatewayProxyResult {
    return {
        statusCode: 401,
        body: ''
    }
}

export function NotFound(data: any): APIGatewayProxyResult {
    return {
        statusCode: 404,
        body: JSON.stringify(data)
    }
}

export function InternalServerError(data: any): APIGatewayProxyResult {
    return {
        statusCode: 502,
        body: JSON.stringify(data)
    }
}