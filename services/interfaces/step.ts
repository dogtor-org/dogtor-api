export type Login = {
    email: string;
    password: string;
}

export type Register = {
    fullName: string;
    birthDate: string;
    cpf: string;
    address: {
        zipCode: number;
        country: string;
        city: string;
        streetName: string;
        number: number;
        additionalInfo: string;
    }
    email: string;
    phoneNumber: string;
    password: string;
}