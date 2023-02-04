import { APIGatewayEvent, Context, APIGatewayProxyEventHeaders } from 'aws-lambda';
import { start } from "./Handler";

const authReq = {
    body: JSON.stringify({
        "email": "email@example.com",
        "password": "Password#01"
    }),
    httpMethod: "POST",
    path: "/auth",
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
    httpMethod: "POST",
    path: "/pet",
    headers: {
        "Authorization": "Bearer jwt-dev",
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