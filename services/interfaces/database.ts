import { RowDataPacket } from 'mysql2';

export interface DBUser extends RowDataPacket {
    user_id: number;
    user_uuid: string;
    full_name: string;
    hash_cpf: string;
    email: string;
    birth_date: string;
    address_id: number;
    created_at: string;
    updated_at: string;
    active: boolean
}

export interface DBAddress extends RowDataPacket {
    address_id: number;
    zip_code: number;
    country: string;
    city: string;
    street_name: string;
    number: number;
    additional_info: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBCardInfo extends RowDataPacket {
    card_info_id: number;
    card_info_uuid: string;
    user_uuid: string;
    hash_cpf: string;
    card_number: string; // 16 numbers
    card_expire_date: string;
    card_flag: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBBankInfo extends RowDataPacket {
    bank_info_id: number;
    bank_info_uuid: string;
    document: string;
    bank_number: string;
    agency: string;
    agency_digit: string;
    account_number: string;
    account_number_digit: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBPayment extends RowDataPacket {
    payment_id: number;
    payment_uuid: string;
    payment_method: string;
    installments: number;
    installment_due_date: number;
    bill_total: number; //double
    doctor_uuid: string;
    pet_uuid: string;
    user_uuid: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBPet extends RowDataPacket {
    pet_id: number;
    pet_uuid: string;
    user_id: number;
    full_name: string;
    birth_date: string;
    size: number;
    weight: number;
    description: string;
    specie_id: number;
    race_id: number;
    created_at: string;
    updated_at: string;
    active: boolean;
}
export interface DBSpecies extends RowDataPacket {
    specie_id: number;
    specie: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBRaces extends RowDataPacket {
    race_id: number;
    race: string;
    specie_id: number;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBCompany extends RowDataPacket {
    company_id: number;
    company_uuid: string;
    document: string;
    corporate_name: string;
    social_name: string;
    contact_email: string;
    contact_number: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBCompanyBranch extends RowDataPacket {
    company_branch_id: number;
    company_branch_uuid: string;
    company_uuid: number;
    contact_email: string;
    contact_number: string;
    bank_info_uuid: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBDoctor extends RowDataPacket {
    doctor_id: number;
    doctor_uuid: string;
    full_name: string;
    birth_date: string;
    contact_email: string;
    contact_number: string;
    expertise: string;
    description: string;
    company_branch_id: number;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBServices extends RowDataPacket {
    service_id: number;
    service_uuid: string;
    name: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBDoctorServices extends RowDataPacket {
    doctor_service_id: number;
    doctor_id: number;
    service_id: number;
    available: boolean;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBAvailability extends RowDataPacket {
    availabillity_id: number;
    doctor_service_id: number;
    start_time: string;
    end_time: string;
    appointment_id: number;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBAppointment extends RowDataPacket {
    appointment_id: number;
    appointment_uuid: string;
    pet_uuid: string;
    doctor_uuid: string;
    notification_uuid: string;
    timestamp: string;
    created_at: string;
    updated_at: string;
    active: boolean;
}

export interface DBNotification extends RowDataPacket {
    notification_id: number;
    notification_uuid: string;
    company_uuid: string;
    info: string;
    expires_at: string;
    delivered: boolean;
    created_at: string;
    updated_at: string;
    active: boolean;
}