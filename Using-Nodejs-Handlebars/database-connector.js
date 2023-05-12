import * as mysql from "mysql2/promise"
import * as dotenv from "dotenv"

dotenv.config()

const connection = await mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

export {connection}
