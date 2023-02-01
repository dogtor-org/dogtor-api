import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export default interface Handler {
    (req: APIGatewayEvent): Promise<APIGatewayProxyResult>;
}