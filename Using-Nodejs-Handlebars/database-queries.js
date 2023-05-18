import { connection } from "./database-connector.js";

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
         VALUES ('${first_name}', '${last_name}', '${email}', ${phone}, '${password}')
         `)
    return ret;
}

async function makeListing(connection,property,user){
    let response = await connection.execute(
                    `SELECT ID
                     FROM US3R
                     WHERE email = '${user.email}'`
    )
    let owner = response[0][0].ID;
    let date = new Date().toISOString().split('T')[0]
    if(property.propertyType == "commercial"){
        await connection.execute(
            `INSERT INTO PROPERTY (ownerID,listingType,country,city,street,streetNumber,firstPublished,lastPublished,state,price,area,floor,numberOfFloors,constrYear,bathrooms,comments)
             VALUES ('${owner}','${property.listingType}','${property.country}','${property.city}','${property.street}',${property.streetNumber},'${date}','${date}','in-process',${property.price},${property.area},${property.floor},${property.numberOfFloors},${property.constrYear},${property.bathrooms},'${property.comments}')`
            )

        let propertyID
        
        await connection.execute(
            `SELECT ID 
             FROM PROPERTY
             WHERE ownerID = ${owner}
             ORDER BY ID DESC
             LIMIT 1`
            ).then((data) => {
                console.log(data[0][0].ID)
                propertyID = data[0][0].ID
            })
        await connection.execute(
            `INSERT INTO COMMERCIAL (cpropertyID,commercialType)
             VALUES (${propertyID},'${property.commercialType}')`
            )

    }
    if(property.propertyType == "residential"){
        await connection.execute(
            `INSERT INTO PROPERTY (ownerID,listingType,country,city,street,streetNumber,firstPublished,lastPublished,state,price,area,floor,numberOfFloors,constrYear,bathrooms,comments)
             VALUES ('${owner}','${property.listingType}','${property.country}','${property.city}','${property.street}',${property.streetNumber},'${date}','${date}','in-process',${property.price},${property.area},'${property.floor}','${property.numberOfFloors}','${property.constrYear}',${property.bathrooms},'${property.comments}')`
            )
        
        let propertyID

        await connection.execute(
            `SELECT ID 
             FROM PROPERTY
             WHERE ownerID = ${owner}
             ORDER BY ID DESC
             LIMIT 1`
            ).then((data) => {
                propertyID = data[0][0].ID
            })

        await connection.execute(
            `INSERT INTO RESIDENTIAL (rpropertyID,rooms)
             VALUES (${propertyID},${property.rooms})`
            )        

       
    }
} 

async function checkUser(connection,email){

    let response = await connection.execute(
        `SELECT EXISTS ( SELECT * FROM US3R WHERE email = '${email}')`
    )
    let exists = Object.values(response[0][0])[0] // If a user with this email exists it returns 1, else 0
    return exists;
}

async function getUser(connection,email){
    let response = await connection.execute(
        `SELECT first_name,last_name,email,phone,password 
         FROM US3R
         WHERE email = '${email}'`
    )
    console.log(response[0][0])
    return response[0][0]
}

export {showTables, registerUser, makeListing, checkUser, getUser}