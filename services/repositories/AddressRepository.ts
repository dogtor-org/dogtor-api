import { DBAddress } from '../interfaces/database';
import { Address } from '../interfaces/types';
import { OkPacket, Connection } from 'mysql2';
import { createConnection } from '../../libs/sql/connection';

const table = "tb_address"

export class AddressRepository {
    private conn: Connection;
    constructor() {
        this.conn = createConnection()
    }

    parseAll(a: DBAddress[]): Address[] {
        const addresses: Address[] = []
        a.map((dbAddress) => {
            addresses.push(this.parse(dbAddress))
        })

        return addresses
    }

    parse(a: DBAddress): Address {
        const address: Address = {
            id: a.address_id,
            zipCode: a.zip_code,
            country: a.country,
            city: a.city,
            streetName: a.street_name,
            number: a.number,
            additionalInfo: a.additional_info
        }
        return address
    }

    insert(address: Address, extraFields: {
        user_uuid?: string,
        company_branch_uuid?: string,
    }): Promise<number> {
        return new Promise(async (resolve, reject) => {
            this.conn.query<OkPacket>(
                `INSERT INTO ${table}(
                    zip_code,
                    country,
                    city,
                    street_name,
                    number,
                    additional_info,

                    user_uuid,
                    company_branch_uuid

                ) VALUES(
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )`,

                [address.zipCode, address.country, address.city, address.streetName, address.number, address.additionalInfo, extraFields["user_uuid"], extraFields["company_branch_uuid"]],

                (err, res) => {
                    if (err) reject(err);
                    resolve(res.insertId)
                }
            )
        })
    }
}