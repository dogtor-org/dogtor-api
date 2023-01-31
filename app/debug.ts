import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import { handler } from ".";

function load() {
    const req: APIGatewayEvent = {
        body: '',
        headers: undefined,
        multiValueHeaders: undefined,
        httpMethod: '',
        isBase64Encoded: false,
        path: '',
        pathParameters: undefined,
        queryStringParameters: undefined,
        multiValueQueryStringParameters: undefined,
        stageVariables: undefined,
        requestContext: undefined,
        resource: ''
    }

    const context: Context = {
        callbackWaitsForEmptyEventLoop: false,
        functionName: '',
        functionVersion: '',
        invokedFunctionArn: '',
        memoryLimitInMB: '',
        awsRequestId: '',
        logGroupName: '',
        logStreamName: '',
        getRemainingTimeInMillis: function (): number {
            throw new Error('Function not implemented.');
        },
        done: function (error?: Error, result?: any): void {
            throw new Error('Function not implemented.');
        },
        fail: function (error: string | Error): void {
            throw new Error('Function not implemented.');
        },
        succeed: function (messageOrObject: any): void {
            throw new Error('Function not implemented.');
        }
    }

    const callback: APIGatewayProxyCallback = () => { }

    handler(req, context, callback)
} load()
