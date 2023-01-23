import * as mysql from 'mysql2';

export const createConnection = () => {
    const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

    // TODO melhorar essa validação
    if (!DB_HOST || !DB_USER || !DB_NAME) {
        throw new Error("couldn't find database credentials. Have you configured your .env file?")
    }

    return mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
    })
}