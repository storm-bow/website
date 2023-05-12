
function showTables(connection){
    connection.execute("SHOW TABLES", function(error,results,fields){
        if (error) throw error;
        console.log(results)
    })
}

async function registerUser(connection,first_name,last_name,email,phone,password){
    let ret = true;
    let check = await connection.execute(`SELECT email FROM US3R WHERE email = '${email}'`);
    if(check[0].length!==0){
        ret = false
    }
    await connection.execute(
        `INSERT INTO US3R (first_name,last_name,email,phone,password)
         SELECT * FROM (SELECT '${first_name}' AS first_name, '${last_name}' AS last_name, '${email}' AS email, ${phone} AS phone, '${password}' AS password) AS newentry
         WHERE NOT EXISTS (
            SELECT email FROM US3R WHERE email = '${email}'
         ) LIMIT 1`)
    return ret;
}

export {showTables, registerUser}