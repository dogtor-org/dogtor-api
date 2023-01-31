import { APIGatewayEvent, APIGatewayProxyCallback } from 'aws-lambda';

export default interface Handler {
    (callback: APIGatewayProxyCallback, req: APIGatewayEvent): Promise<any>;
}