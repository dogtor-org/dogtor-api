import { DBUser } from './../interfaces/database';
import { User } from './../interfaces/types';
import { OkPacket, Connection, RowDataPacket } from 'mysql2';
import MysqlConnection from '../../libs/sql/connection';
import * as bcrypt from "bcrypt"
import * as moment from 'moment';
import { Register } from '../interfaces/step';
import { sha1 } from '../../utils/hash';

const table = "tb_user"

export class UserRepository {
    private conn: Connection;
    constructor() {
        this.conn = MysqlConnection.createConnection()
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
        }
        return user
    }

    insert(user: Register): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const hashPassword = await bcrypt.hash(user.password, 10)
            const hashCpf = sha1(user.cpf)

            this.conn.query<OkPacket>(
                `INSERT INTO ${table}(
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
                    hash_password

                ) VALUES(
                    UUID(),
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )`,

                [user.fullName, hashCpf, user.email, user.birthDate, hashPassword],

                (err, res) => {
                    if (err) reject(err);
                    resolve(res.insertId)
                }
            )
        })
    }

    update(user: User, field: string, value: any): Promise<DBUser> {
        return new Promise((resolve, reject) => {
            this.conn.query<OkPacket>(
                `UPDATE ${table} SET ${field} = ? WHERE user_uuid = ? AND active`,

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
                `UPDATE ${table} SET active = false WHERE user_uuid = ?`,

                [uuid],

                (err, res) => {
                    if (err) reject(false)
                    else resolve(true)
                }
            )
        })
    }

    getAll(): Promise<DBUser[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBUser[]>(
                `SELECT
                    user_id,
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
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

    getByID(userID: number): Promise<DBUser> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBUser[]>(
                `SELECT
                    user_id,
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE user_id = ? AND active`,

                [userID],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                })
        })
    }

    getByUUID(uuid: string): Promise<DBUser> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBUser[]>(
                `SELECT
                    user_id,
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE user_uuid = ? AND active`,

                [uuid],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
                })
        })
    }

    getByEmail(email: string): Promise<DBUser> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBUser[]>(
                `SELECT
                    user_id,
                    user_uuid,
                    full_name,
                    hash_cpf,
                    email,
                    birth_date,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE email = ? AND active`,

                [email],

                (err, res) => {
                    if (err) reject(err)
                    else resolve(res?.[0])
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

                FROM ${table} WHERE email = ? AND active`,

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

                FROM ${table} WHERE email = ? AND active`,

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