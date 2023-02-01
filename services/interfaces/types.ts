import moment = require('moment');

export type User = {
    uuid: string;
    fullName: string;
    hashCpf: string;
    email: string;
    birthDate: moment.Moment;
    address?: Address;
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

export type BankInfo = {
    id: number;
    uuid: string;
    document: string;
    bankNumber: string;
    agency: string;
    agencyDigit: string;
    accountNumber: string;
    accountNumberDigit: string;
}

export type Payment = {
    id: number;
    uuid: string;
    paymentMethod: string;
    installments: number;
    installmentDueDate: number;
    billTotal: number;
    doctorUUID: string;
    petUUID: string;
    userUUID: string;
}

export type Pet = {
    id: number;
    uuid: string;
    userID: number;
    fullName: string;
    birthDate: string;
    size: number;
    weight: number;
    description: string;
    specieID: number;
    raceID: number;
}

export type Species = {
    id: number;
    specie: string;
}

export type Races = {
    id: number;
    race: string;
    specieID: number;
}

export type Company = {
    id: number;
    uuid: string;
    document: string;
    corporateName: string;
    socialName: string;
    contactEmail: string;
    contactNumber: string;
}

export type CompanyBranch = {
    id: number;
    uuid: string;
    companyUUID: number;
    contactEmail: string;
    contactNumber: string;
    bankInfoUUID: string;
}

export type Doctor = {
    id: number;
    uuid: string;
    fullName: string;
    birthDate: string;
    contactEmail: string;
    contactNumber: string;
    expertise: string;
    description: string;
    companyBranchID: number;
}

export type Services = {
    id: number;
    uuid: string;
    name: string;
}

export type DoctorServices = {
    id: number;
    doctorID: number;
    serviceID: number;
    available: boolean;
}

export type Availability = {
    id: number;
    doctorServiceID: number;
    startTime: string;
    endTime: string;
    appointmentID: number;
}

export type Appointment = {
    id: number;
    uuid: string;
    petUUID: string;
    doctorUUID: string;
    notificationUUID: string;
    timestamp: string;
}

export type Notification = {
    id: number;
    uuid: string;
    companyUUID: string;
    info: string;
    expiresAt: string;
    delivered: boolean;
}
