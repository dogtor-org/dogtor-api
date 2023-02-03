import moment = require('moment');

export type User = {
    uuid: string;
    fullName: string;
    hashCpf: string;
    email: string;
    birthDate: moment.Moment;
    address?: Address;
    cardInfo?: CardInfo;
}

export type Address = {
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
    uuid: string;
    document: string;
    bankNumber: string;
    agency: string;
    agencyDigit: string;
    accountNumber: string;
    accountNumberDigit: string;
}

export type Payment = {
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
    uuid: string;
    userUUID: string;
    fullName: string;
    birthDate: moment.Moment;
    size: number;
    weight: number;
    description: string;
    specieID: number;
    raceID: number;
}

export type Species = {
    specie: string;
}

export type Races = {
    race: string;
    specieID: number;
}

export type Company = {
    uuid: string;
    document: string;
    corporateName: string;
    socialName: string;
    contactEmail: string;
    contactNumber: string;
}

export type CompanyBranch = {
    uuid: string;
    companyUUID: number;
    contactEmail: string;
    contactNumber: string;
    bankInfoUUID: string;
}

export type Doctor = {
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
    uuid: string;
    name: string;
}

export type DoctorServices = {
    doctorID: number;
    serviceID: number;
    available: boolean;
}

export type Availability = {
    doctorServiceID: number;
    startTime: string;
    endTime: string;
    appointmentID: number;
}

export type Appointment = {
    uuid: string;
    petUUID: string;
    doctorUUID: string;
    notificationUUID: string;
    timestamp: string;
}

export type Notification = {
    uuid: string;
    companyUUID: string;
    info: string;
    expiresAt: string;
    delivered: boolean;
}
