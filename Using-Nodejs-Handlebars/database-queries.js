
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

async function makeListing(connection,property){
    console.log(property)
    let date = new Date().toISOString().split('T')[0]
    let owner = 1;
    if(property.propertyType == "commercial"){
        await connection.execute(
            `INSERT INTO PROPERTY (ownerID,listingType,country,city,street,streetNumber,firstPublished,lastPublished,state,price,area,floor,numberOfFloors,constrYear,bathrooms,comments)
             VALUES ('${owner}','${property.listingType}','${property.country}','${property.city}',${property.street},${property.streetNumber},'${date}','${date}','in-process',${property.price},${property.area},${property.floor},${property.numberOfFloors},${property.constrYear},${property.bathrooms},'${property.comments}')`
            )
        let propertyID = await connection.execute(
            `SELECT ID from PROPERTY (ID,ownerID)
             WHERE ownerID = ${owner}
             ORDER BY 'ID' DESC
             LIMIT 1`
            ).results
        console.log(propertyID)
        await connection.execute(
            `INSERT INTO COMMERCIAL (cpropertyID,commercialType)
             VALUES (${propertyID},${property.commercialType}})`
            )
    }
    if(property.propertyType == "residential"){
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
            `INSERT INTO RESIDENTIAL (rpropertyID,rooms)
             VALUES (${propertyID},${property.rooms})`
            )        

       
    }
} 


export {showTables, registerUser, makeListing}