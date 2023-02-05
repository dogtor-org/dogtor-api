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
const defaultRequest = {
    body: JSON.stringify({
        "fullName": "Name Example",
        "birthDate": "2023-01-01",
        "cpf": "01234567890",
        "address": {
            "zipCode": 262656,
            "country": "Brazil",
            "city": "Sao Paulo",
            "streetName": "Praça da Sé",
            "number": 50,
            "additionalInfo": "Marco zero de Sao Paulo"
        },
        "email": "email@example.com",
        "phoneNumber": "(11) 91234-5678",
        "password": "Password#01",

        "size": 10.58,
        "weight": 1.15,
        "description": "lorem ipsum",
        "specieID": 1,
        "raceID": 2,
    }),
    httpMethod: "GET",
    resource: "/pet",
    // path: "/pet/1fdcf85e-a436-11ed-9927-02272ccf360a",
    pathParameters: {
        "pet_id": "1fdcf85e-a436-11ed-9927-02272ccf360a"
    } as APIGatewayProxyEventPathParameters,
    headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX3V1aWQiOiJkZDdmZjRhNC1hMWNhLTExZWQtOTkyNy0wMjI3MmNjZjM2MGEiLCJmdWxsX25hbWUiOiJOYW1lIEV4YW1wbGUiLCJoYXNoX2NwZiI6IiIsImVtYWlsIjoiZW1haWxAZXhhbXBsZS5jb20iLCJiaXJ0aF9kYXRlIjoiMjAyMy0wMS0wMSIsImNyZWF0ZWRfYXQiOiIyMDIzLTAyLTAxVDAwOjUzOjM4LjAwMFoiLCJ1cGRhdGVkX2F0IjoiMjAyMy0wMi0wMVQwMDo1MzozOC4wMDBaIiwiYWN0aXZlIjoxLCJpYXQiOjE2NzU0NTM1MzUsImV4cCI6MTY3NTUzOTkzNX0.HNkDSiVPBkFndOfCsdLg_kLQ-DLHPJbM1Lvq8pJ5S-Y",
    } as APIGatewayProxyEventHeaders
} as APIGatewayEvent
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

load(defaultRequest, context)