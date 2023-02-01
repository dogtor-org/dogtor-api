import { APIGatewayEvent, Context } from 'aws-lambda';
import { start } from "./Handler";

function load() {
    const req = {
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
            "password": "Password#01"
        }),
        httpMethod: "POST",
        path: "/user/register",
    } as APIGatewayEvent

    const context: Context = null

    start(req, context)
} load()
