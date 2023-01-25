import moment = require('moment');

export type User = {
    uuid: string;
    fullName: string;
    hashCpf: string;
    email: string;
    birthDate: moment.Moment;
    address: Address;
}

export type Address = {
    id: number;
    zipCode: number;
    country: string;
    city: string;
    streetName: string;
    number: number;
    additionalInfo: string;
}

export type CardInfo = {
    uuid: string;
    hashCpf: string;
    cardNumber: string;
    cardExpireDate: moment.Moment;
    cardFlag: string;
}

