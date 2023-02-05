import { DBCardInfo } from '../interfaces/database';
import { CardInfo } from '../interfaces/types';
import { OkPacket, Connection } from 'mysql2';
import MysqlConnection from '../../libs/sql/connection';
import moment = require('moment');

const table = "tb_card_info"

export class CardInfoRepository {
    private conn: Connection;
    constructor() {
        this.conn = MysqlConnection.createConnection()
    }

    parseAll(a: DBCardInfo[]): CardInfo[] {
        const cardInfos: CardInfo[] = []
        a.map((dbCardInfo) => {
            cardInfos.push(this.parse(dbCardInfo))
        })

        return cardInfos
    }

    parse(ci: DBCardInfo): CardInfo {
        const cardInfo: CardInfo = {
            uuid: ci.card_info_uuid,
            hashCpf: ci.hash_cpf,
            cardNumber: ci.card_number,
            cardExpireDate: moment(ci.card_expire_date),
            cardFlag: ci.card_flag
        }
        return cardInfo
    }

    insert(cardInfo: CardInfo, extraFields: {
        user_uuid?: string,
    }): Promise<number> {
        return new Promise(async (resolve, reject) => {
            this.conn.query<OkPacket>(
                `INSERT INTO ${table}(
                    card_info_uuid,
                    user_uuid,
                    hash_cpf,
                    card_number,
                    card_expire_date,
                    card_flag

                ) VALUES(
                   UUID(),
                   ?,
                   ?,
                   ?,
                   ?,
                   ?
                )`,

                [extraFields["user_uuid"], cardInfo.hashCpf, cardInfo.cardNumber, cardInfo.cardExpireDate, cardInfo.cardFlag],

                (err, res) => {
                    if (err) reject(err);
                    resolve(res.insertId)
                }
            )
        })
    }

    update(cardInfo: CardInfo): Promise<DBCardInfo> {
        return new Promise((resolve, reject) => {
            this.conn.query<OkPacket>(
                `UPDATE ${table} SET 
                    hash_cpf = ?,
                    card_number = ?,
                    card_expire_date = ?,
                    card_flag = ?

                WHERE card_info_uuid = ? AND active`,

                [cardInfo.hashCpf, cardInfo.cardNumber, cardInfo.cardExpireDate, cardInfo.cardFlag, cardInfo.uuid],

                (err, res) => {
                    if (err) throw err;
                    this.getByUUID(cardInfo.uuid)
                        .then(resolve)
                        .catch(reject)
                }
            )
        })
    }

    remove(uuid: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.conn.query<OkPacket>(
                `UPDATE ${table} SET active = false WHERE card_info_uuid = ?`,

                [uuid],

                (err, res) => {
                    if (err) throw err
                    else resolve(true)
                }
            )
        })
    }

    getAll(): Promise<DBCardInfo[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBCardInfo[]>(
                `SELECT
                    card_info_id,
                    card_info_uuid,
                    user_uuid,
                    hash_cpf,
                    card_number,
                    card_expire_date,
                    card_flag,
                    created_at,
                    updated_at,
                    active

                FROM ${table} WHERE active`,

                (err, res) => {
                    if (err) throw err
                    else resolve(res)
                })
        })
    }

    getByID(cardInfoID: number): Promise<DBCardInfo> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBCardInfo[]>(
                `SELECT
                    card_info_id,
                    card_info_uuid,
                    user_uuid,
                    hash_cpf,
                    card_number,
                    card_expire_date,
                    card_flag,
                    created_at,
                    updated_at,
                    active

                FROM ${table} WHERE card_info_id = ? active`,

                [cardInfoID],

                (err, res) => {
                    if (err) throw err
                    else resolve(res?.[0])
                })
        })
    }

    getByUUID(uuid: string): Promise<DBCardInfo> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBCardInfo[]>(
                `SELECT
                    card_info_id,
                    card_info_uuid,
                    user_uuid,
                    hash_cpf,
                    card_number,
                    card_expire_date,
                    card_flag,
                    created_at,
                    updated_at,
                    active

                FROM ${table} WHERE card_info_uuid = ? active`,

                [uuid],

                (err, res) => {
                    if (err) throw err
                    else resolve(res?.[0])
                })
        })
    }

    getAllByUserUUID(user_uuid: string): Promise<DBCardInfo[]> {
        return new Promise((resolve, reject) => {
            this.conn.query<DBCardInfo[]>(
                `SELECT
                    card_info_id,
                    card_info_uuid,
                    user_uuid,
                    hash_cpf,
                    card_number,
                    card_expire_date,
                    card_flag,
                    created_at,
                    updated_at,
                    active
                
                FROM ${table} WHERE user_uuid = ? AND active`,

                [user_uuid],

                (err, res) => {
                    if (err) throw err
                    else resolve(res)
                })
        })
    }
}