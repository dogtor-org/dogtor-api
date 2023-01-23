import { DBUser } from './../interfaces/database';
import { User } from './../interfaces/types';
import { OkPacket, Connection, RowDataPacket } from 'mysql2';
import { createConnection } from '../../libs/sql/connection';
import * as bcrypt from "bcrypt"
import * as moment from 'moment';
import { Register } from '../interfaces/step';

const table = "tb_user"

export class UserRepository {
    private conn: Connection;
    constructor() {
        this.conn = createConnection()
    }

    parseAll(u: DBUser[]): User[] {
        const users: User[] = []
        u.map((dbUser) => {
            users.push(this.parse(dbUser))
        })

        return users
    }

    parse(u: DBUser): User {
        const user: User = {
            uuid: u.user_uuid,
            fullName: u.full_name,
            hashCpf: u.hash_cpf,
            email: u.email,
            birthDate: moment(u.birth_date),
            address: {
                id: u.address_id,
                zipCode: 0,
                country: '',
                city: '',
                streetName: '',
                number: 0,
                additionalInfo: ''
            }
        }
        return user
    }

    insert(user: Register, required: {
        address_id: number,
    }): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const hashPassword = await bcrypt.hash(user.password, 10)
            const hashCpf = Buffer.from(user.cpf, 'base64')

            this.conn.query<OkPacket>(
                `INSERT INTO ${table}(
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
                    address_id,
                    hash_password

                ) VALUES(
                    UUID(),
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )`,

                [user.fullName, hashCpf, user.email, user.birthDate, required.address_id, hashPassword],

                (err, res) => {
                    if (err) reject(err);
                    resolve()
                    // else
                    //     this.getByID(res.insertId)
                    //         .then(user => resolve(user!))
                    //         .catch(reject);
                }
            )
        })
    }

    update(user: User, field: string, value: any): Promise<User> {
        return new Promise((resolve, reject) => {
            this.conn.query<OkPacket>(
                `UPDATE ${table} SET ${field} = ? WHERE user_uuid = ?`,

                [value, user.uuid],

                (err, res) => {
                    if (err) reject(err)
                    else
                        this.getByUUID(user.uuid)
                            .then(resolve)
                            .catch(reject)
                }
            )
        })
    }

    remove(uuid: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.conn.query<OkPacket>(
                `DELETE FROM ${table} WHERE user_uuid = ?`,

                [uuid],

                (err, res) => {
                    if (err) reject(false)
                    else resolve(true)
                }
            )
        })
    }

    getAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBUser[]>(
                `SELECT
                    user_id,
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
                    address_id,
                    created_at,
                    updated_at,
                    active

                FROM ${table}`,

                (err, res) => {
                    if (err) reject(err)
                    else resolve(this.parseAll(res))
                })
        })
    }

    getByID(userID: number): Promise<User> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBUser[]>(
                `SELECT
                    user_id,
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
                    address_id,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE user_id = ?`,

                [userID],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(this.parse(res?.[0]))
                })
        })
    }

    getByUUID(uuid: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBUser[]>(
                `SELECT
                    user_id,
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
                    address_id,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE user_uuid = ?`,

                [uuid],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(this.parse(res?.[0]))
                })
        })
    }

    getByEmail(email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBUser[]>(
                `SELECT
                    user_id,
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
                    address_id,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE email = ?`,

                [email],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(this.parse(res?.[0]))
                })
        })
    }

    getHashPassword(email: string): Promise<string> {
        interface HashPassword extends RowDataPacket {
            hash_password: string
        }

        return new Promise((resolve, reject) => {
            this.conn.query<HashPassword[]>(
                `SELECT
                    hash_password

                FROM ${table} WHERE email = ?`,

                [email],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0].hash_password)
                })
        })
    }

    alreadyExists(email: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBUser[]>(
                `SELECT
                    user_id

                FROM ${table} WHERE email = ?`,

                [email],

                (err, res) => {
                    try {
                        if (res.length == 0) resolve(false)
                        return resolve(true)
                    } catch (error) {
                        console.log(error)
                        return resolve(true)
                    }
                })
        })
    }
}