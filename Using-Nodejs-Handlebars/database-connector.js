import * as mysql from "mysql"
import * as dotenv from "dotenv"

dotenv.config()

const connection = mysql.createConnection({
    host : process.env.HOST,
    user : process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

connection.connect(function(err){
    if(err){
        console.error("error connecting: " + err.stack)
        return;
    }
    console.log("connected as id" + connection.threadId)
});

export {connection}
/*
function showTables(){
    connection.query("SHOW TABLES", function(error,results,fields){
        if (error) throw error;
        console.log(results)
    })
}
*/
//connection.end()