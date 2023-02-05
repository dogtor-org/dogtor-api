import { APIGatewayEvent, Context, APIGatewayProxyEventHeaders, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { start } from "./Handler";

const authReq = {
    body: JSON.stringify({
        "email": "email@example.com",
        "password": "Password#01"
    }),
    httpMethod: "POST",
    resource: "/auth",
} as APIGatewayEvent
// const defaultRequest = {
//     body: JSON.stringify({
//         "fullName": "Name Example",
//         "birthDate": "2023-01-01",
//         "cpf": "01234567890",
//         "address": {
//             "zipCode": 262656,
//             "country": "Brazil",
//             "city": "Sao Paulo",
//             "streetName": "Praça da Sé",
//             "number": 50,
//             "additionalInfo": "Marco zero de Sao Paulo"
//         },
//         "email": "emailxxx@example.com",
//         "phoneNumber": "(11) 91234-5678",
//         "password": "Password#01",

//         "size": 10.58,
//         "weight": 1.15,
//         "description": "lorem ipsum",
//         "specieID": 1,
//         "raceID": 2,
//     }),
//     httpMethod: "GET",
//     resource: "/card",
//     // path: "/pet/1fdcf85e-a436-11ed-9927-02272ccf360a",
//     // pathParameters: {
//     //     "pet_id": "1fdcf85e-a436-11ed-9927-02272ccf360a"
//     // } as APIGatewayProxyEventPathParameters,
//     headers: {
//         "Authorization": "Bearer fake-jwt",
//     } as APIGatewayProxyEventHeaders
// } as APIGatewayEvent
const defaultRequest = {
    "resource": "/pet", "path": "/pet", "httpMethod": "GET", "headers": { "Accept": "application/json", "Accept-Encoding": "gzip, deflate, br", "Authorization": "Bearer fake-jwt", "Cache-Control": "no-cache", "CloudFront-Forwarded-Proto": "https", "CloudFront-Is-Desktop-Viewer": "true", "CloudFront-Is-Mobile-Viewer": "false", "CloudFront-Is-SmartTV-Viewer": "false", "CloudFront-Is-Tablet-Viewer": "false", "CloudFront-Viewer-ASN": "14618", "CloudFront-Viewer-Country": "US", "Host": "api.dev.dogtor.store", "Postman-Token": "f910a0ee-bd7e-4786-a2b9-5b118be4e575", "Referer": "http://api.dev.dogtor.store/pet", "User-Agent": "PostmanRuntime/7.30.1", "Via": "1.1 16d910967d343c8da7828222a653755e.cloudfront.net (CloudFront)", "X-Amz-Cf-Id": "pgonr1j_i1R0aN_9wQ3WSS6wacnYZeu_aS-amqA0x0TggS-I6IMeIg==", "X-Amzn-Trace-Id": "Root=1-63df360e-2c4e7d3e7e1cf40625108590", "X-Forwarded-For": "54.86.50.139, 15.158.50.174", "X-Forwarded-Port": "443", "X-Forwarded-Proto": "https" }, "multiValueHeaders": { "Accept": ["application/json"], "Accept-Encoding": ["gzip, deflate, br"], "Authorization": ["Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX3V1aWQiOiJkZDdmZjRhNC1hMWNhLTExZWQtOTkyNy0wMjI3MmNjZjM2MGEiLCJmdWxsX25hbWUiOiJOYW1lIEV4YW1wbGUiLCJoYXNoX2NwZiI6IiIsImVtYWlsIjoiZW1haWxAZXhhbXBsZS5jb20iLCJiaXJ0aF9kYXRlIjoiMjAyMy0wMS0wMSIsImNyZWF0ZWRfYXQiOiIyMDIzLTAyLTAxVDAwOjUzOjM4LjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMy0wMi0wMVQwMDo1MzozOC4wMDBaIiwiYWN0aXZlIjoxLCJpYXQiOjE2NzU1NjkyNTAsImV4cCI6MTY3NTY1NTY1MH0.1fOB3ayKsWUM-y6fyLsun-cuCAx0aiduuv1V-kt97u8"], "Cache-Control": ["no-cache"], "CloudFront-Forwarded-Proto": ["https"], "CloudFront-Is-Desktop-Viewer": ["true"], "CloudFront-Is-Mobile-Viewer": ["false"], "CloudFront-Is-SmartTV-Viewer": ["false"], "CloudFront-Is-Tablet-Viewer": ["false"], "CloudFront-Viewer-ASN": ["14618"], "CloudFront-Viewer-Country": ["US"], "Host": ["api.dev.dogtor.store"], "Postman-Token": ["f910a0ee-bd7e-4786-a2b9-5b118be4e575"], "Referer": ["http://api.dev.dogtor.store/pet"], "User-Agent": ["PostmanRuntime/7.30.1"], "Via": ["1.1 16d910967d343c8da7828222a653755e.cloudfront.net (CloudFront)"], "X-Amz-Cf-Id": ["pgonr1j_i1R0aN_9wQ3WSS6wacnYZeu_aS-amqA0x0TggS-I6IMeIg=="], "X-Amzn-Trace-Id": ["Root=1-63df360e-2c4e7d3e7e1cf40625108590"], "X-Forwarded-For": ["54.86.50.139, 15.158.50.174"], "X-Forwarded-Port": ["443"], "X-Forwarded-Proto": ["https"] }, "queryStringParameters": null, "multiValueQueryStringParameters": null, "pathParameters": null, "stageVariables": null, "requestContext": { "resourceId": "zmpjlc", "resourcePath": "/pet", "httpMethod": "GET", "extendedRequestId": "f2ViQFvRGjQFbpw=", "requestTime": "05/Feb/2023:04:52:30 +0000", "path": "/pet", "accountId": "447988592397", "protocol": "HTTP/1.1", "stage": "dev", "domainPrefix": "api", "requestTimeEpoch": 1675572750222, "requestId": "06b43382-f22d-4547-a9fa-d6f94f73ccf0", "identity": { "cognitoIdentityPoolId": null, "accountId": null, "cognitoIdentityId": null, "caller": null, "sourceIp": "54.86.50.139", "principalOrgId": null, "accessKey": null, "cognitoAuthenticationType": null, "cognitoAuthenticationProvider": null, "userArn": null, "userAgent": "PostmanRuntime/7.30.1", "user": null }, "domainName": "api.dev.dogtor.store", "apiId": "oebtfulbza" }, "body": null, "isBase64Encoded": false
}
const context: Context = null

async function load(req: APIGatewayEvent, ctx: Context) {
    let resp = await start(req, ctx)
    if (resp.statusCode == 401) {
        resp = await start(authReq, ctx)
        if (resp.statusCode !== 200) throw new Error(JSON.stringify(resp))
        req.headers = {
            "Authorization": `Bearer ${JSON.parse(resp.body).token}`,
        } as APIGatewayProxyEventHeaders

        resp = await start(req, ctx)
    }
    console.log(JSON.stringify(resp))
}

load(defaultRequest as unknown as APIGatewayEvent, context)