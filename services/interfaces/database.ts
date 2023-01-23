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
    active: string;
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
    active: string;
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
    active: string;
}

export interface DBPet extends RowDataPacket {
    pet_id: number;
    pet_uuid: string;
    user_id: number;
    full_name: string;
    birth_date: string;
    size: number; // double
    weight: number; // double
    description: string;
    specie_id: number;
    race_id: number;
    created_at: string;
    updated_at: string;
    active: string;
}