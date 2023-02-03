import { DBPet } from '../interfaces/database';
import { Pet } from '../interfaces/types';
import { OkPacket, Connection } from 'mysql2';
import { createConnection } from '../../libs/sql/connection';
import * as moment from 'moment';

const table = "tb_pet"

export class PetRepository {
    private conn: Connection;
    constructor() {
        this.conn = createConnection()
    }

    parseAll(p: DBPet[]): Pet[] {
        const pets: Pet[] = []
        p.map((dbPet) => {
            pets.push(this.parse(dbPet))
        })

        return pets
    }

    parse(p: DBPet): Pet {
        const Pet: Pet = {
            uuid: p.pet_uuid,
            userUUID: p.user_uuid,
            fullName: p.full_name,
            birthDate: moment(p.birth_date),
            size: p.size,
            weight: p.weight,
            description: p.description,
            specieID: p.specie_id,
            raceID: p.race_id
        }
        return Pet
    }

    insert(pet: Pet): Promise<number> {
        return new Promise(async (resolve, reject) => {
            this.conn.query<OkPacket>(
                `INSERT INTO ${table}(
                    pet_uuid,
                    user_uuid,
                    full_name,
                    birth_date,
                    size,
                    weight,
                    description,
                    specie_id,
                    race_id

                ) VALUES(
                    UUID(),
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    s?,
                    )`,

                [pet.userUUID, pet.fullName, pet.birthDate, pet.size, pet.weight, pet.description, pet.specieID, pet.raceID],

                (err, res) => {
                    if (err) reject(err);
                    resolve(res.insertId)
                }
            )
        })
    }

    update(pet: Pet, field: string, value: any): Promise<DBPet> {
        return new Promise((resolve, reject) => {
            this.conn.query<OkPacket>(
                `UPDATE ${table} SET ${field} = ? WHERE pet_uuid = ? AND active`,

                [value, pet.uuid],

                (err, res) => {
                    try {
                        this.getByUUID(pet.uuid)
                            .then(resolve)
                            .catch(reject)
                    } catch (err) {
                        console.log(err)
                    }
                }
            )
        })
    }

    remove(uuid: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.conn.query<OkPacket>(
                `UPDATE ${table} SET active = false WHERE pet_uuid = ?`,

                [uuid],

                (err, res) => {
                    if (err) reject(false)
                    else resolve(true)
                }
            )
        })
    }

    getAll(): Promise<DBPet[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBPet[]>(
                `SELECT
                    pet_id,
                    pet_uuid,
                    user_id,
                    full_name,
                    birth_date,
                    size,
                    weight,
                    description,
                    specie_id,
                    race_id,
                    created_at,
                    updated_at,
                    active

                FROM ${table} WHERE active`,

                (err, res) => {
                    if (err) reject(err)
                    else resolve(res)
                })
        })
    }

    getByID(petID: number): Promise<DBPet> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBPet[]>(
                `SELECT
                    pet_id,
                    pet_uuid,
                    user_id,
                    full_name,
                    birth_date,
                    size,
                    weight,
                    description,
                    specie_id,
                    race_id,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE pet_id = ? AND active`,

                [petID],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                })
        })
    }

    getByUUID(uuid: string): Promise<DBPet> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBPet[]>(
                `SELECT
                    pet_id,
                    pet_uuid,
                    user_id,
                    full_name,
                    birth_date,
                    size,
                    weight,
                    description,
                    specie_id,
                    race_id,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE pet_uuid = ? AND active`,

                [uuid],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                })
        })
    }

    getAllByUserID(user_id: number): Promise<DBPet[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBPet[]>(
                `SELECT
                    pet_id,
                    pet_uuid,
                    user_id,
                    full_name,
                    birth_date,
                    size,
                    weight,
                    description,
                    specie_id,
                    race_id,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE user_id = ? AND active`,

                [user_id],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(res)
                })
        })
    }
}