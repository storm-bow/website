import * as mysql from "mysql2/promise"
import * as dotenv from "dotenv"

dotenv.config()

const connection = await mysql.createConnection({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})
export {connection}
