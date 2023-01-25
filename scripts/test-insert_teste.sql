INSERT INTO
    tb_user (
        user_uuid,
        full_name,
        hash_cpf,
        email,
        birth_date,
        hash_password
    )
VALUES
    (
        "user_uuid",
        "Name Example",
        "01234567890",
        "email@example.com",
        "2022-01-01",
        "hash-password-test"
    );

INSERT INTO
    tb_address(
        user_uuid,
        company_branch_uuid,
        zip_code,
        country,
        city,
        street_name,
        number,
        additional_info
    )
VALUES
    (
        "user_uuid",
        "company_branch_uuid",
        "01001-000",
        "Brazil",
        "Sao Paulo",
        "Praça Da Sé",
        "50",
        "additional_info"
    );

INSERT INTO
    tb_card_info(
        card_info_uuid,
        user_uuid,
        hash_cpf,
        card_number,
        card_expire_date,
        card_flag
    )
VALUES
    (
        "card_info_uuid",
        "user_uuid",
        1234567890,
        "card_number",
        "card_expire_date",
        "card_flag"
    );

INSERT INTO
    tb_bank_info(
        bank_info_uuid,
        document,
        bank_number,
        agency,
        agency_digit,
        account_number,
        account_number_digit
    )
VALUES
    (
        "bank_info_uuid",
        "01234567890/0001",
        "bank_number",
        "agency",
        "agency_digit",
        "account_number",
        "account_number_digit"
    );

INSERT INTO
    tb_payment(
        payment_uuid,
        payment_method,
        installments,
        installment_due_date,
        bill_total,
        doctor_uuid,
        pet_uuid,
        user_uuid
    )
VALUES
    (
        "payment_uuid",
        "payment_method",
        10,
        15,
        150.10,
        "doctor_uuid",
        "pet_uuid",
        "user_uuid"
    );

INSERT INTO
    tb_pet(
        pet_uuid,
        user_id,
        full_name,
        birth_date,
        size,
        weight,
        description,
        specie_id,
        race_id
    )
VALUES
    (
        "pet_uuid",
        0,
        "full_name",
        "2022-01-01",
        10.02,
        15.05,
        "description",
        1,
        2
    );

INSERT INTO
    tb_species(specie)
VALUES
    ("specie");

INSERT INTO
    tb_races(race, specie_id)
VALUES
    ("race", 0);

INSERT INTO
    tb_company(
        company_uuid,
        document,
        corporate_name,
        social_name,
        contact_email,
        contact_number
    )
VALUES
    (
        "company_uuid",
        "01234567890/0001",
        "corporate_name",
        "social_name",
        "contact_email",
        "contact_number"
    );

INSERT INTO
    tb_company_branch(
        company_branch_uuid,
        company_uuid,
        contact_email,
        contact_number,
        bank_info_uuid
    )
VALUES
    (
        "company_branch_uuid",
        "company_uuid",
        "contact_email",
        "contact_number",
        "bank_info_uuid"
    );

INSERT INTO
    tb_doctor(
        doctor_uuid,
        full_name,
        birth_date,
        contact_email,
        contact_number,
        expertise,
        description,
        company_branch_id
    )
VALUES
    (
        "doctor_uuid",
        "full_name",
        "2022-01-01",
        "contact_email",
        "contact_number",
        "expertise",
        "description",
        0
    );

INSERT INTO
    tb_services(services_uuid, name)
VALUES
    ("services_uuid", "name");

INSERT INTO
    tb_doctor_services(
        doctor_services_uuid,
        doctor_id,
        service_id,
        available
    )
VALUES
    (
        "doctor_services_uuid",
        0,
        1,
        true
    );

INSERT INTO
    tb_availabillity(
        doctor_service_id,
        start_time,
        end_time,
        appointment_id
    )
VALUES
    (
        0,
        "2022-01-01",
        "2022-02-02",
        1
    );

INSERT INTO
    tb_appointment(
        availabillity_uuid,
        pet_uuid,
        doctor_uuid,
        notification_uuid,
        timestamp
    )
VALUES
    (
        "availabillity_uuid",
        "pet_uuid",
        "doctor_uuid",
        "notification_uuid",
        "2022-01-01"
    );

INSERT INTO
    tb_notification(
        notification_uuid,
        company_uuid,
        info,
        expires_at,
        delivered
    )
VALUES
    (
        "notification_uuid",
        "company_uuid",
        "info",
        "2022-01-02",
        true
    );