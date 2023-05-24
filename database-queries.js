import { connection } from "./database-connector.js";


async function registerUser(connection, first_name, last_name, email, phone, password) {
    let ret = true;
    let check = await connection.execute(`SELECT email FROM US3R WHERE email = '${email}'`);
    if (check[0].length !== 0) {
        ret = false
    }
    await connection.execute(
        `INSERT INTO US3R (first_name,last_name,email,phone,password)
         VALUES ('${first_name}', '${last_name}', '${email}', ${phone}, '${password}')
         `)
    return ret;
}

async function updateUser(connection, first_name, last_name, old_email, email, phone, password) {
    let ret = true;
    if(old_email!=email){
        let check = await connection.execute(`SELECT email FROM US3R WHERE email = '${email}'`);
        if (check[0].length !== 0) {
            ret = false
        }
    }

    await connection.execute(
        `UPDATE US3R
         SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', phone=${phone}, password='${password}'
         WHERE email = '${old_email}'
         `)
    return ret;
}

async function makeListing(connection, property, user) {
    let response = await connection.execute(
        `SELECT ID
                     FROM US3R
                     WHERE email = '${user.email}'`
    )
    let owner = response[0][0].ID;
    let date = new Date().toISOString().split('T')[0]
    if (property.propertyType == "commercial") {
        await connection.execute(
            `INSERT INTO PROPERTY (ownerID,listingType,country,city,street,streetNumber,firstPublished,lastPublished,state,price,area,floor,numberOfFloors,constrYear,bathrooms,photo,comments)
             VALUES ('${owner}','${property.listingType}','${property.country}','${property.city}','${property.street}',${property.streetNumber},'${date}','${date}','in-process',${property.price},${property.area},${property.floor},${property.numberOfFloors},${property.constrYear},${property.bathrooms},'${property.photo}','${property.comments}')`
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
            `INSERT INTO COMMERCIAL (cpropertyID,commercialType)
             VALUES (${propertyID},'${property.commercialType}')`
        )

    }
    if (property.propertyType == "residential") {
        await connection.execute(
            `INSERT INTO PROPERTY (ownerID,listingType,country,city,street,streetNumber,firstPublished,lastPublished,state,price,area,floor,numberOfFloors,constrYear,bathrooms,photo,comments)
             VALUES ('${owner}','${property.listingType}','${property.country}','${property.city}','${property.street}',${property.streetNumber},'${date}','${date}','in-process',${property.price},${property.area},'${property.floor}','${property.numberOfFloors}','${property.constrYear}',${property.bathrooms},'${property.photo}','${property.comments}')`
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

async function checkUser(connection, email) {

    let response = await connection.execute(
        `SELECT EXISTS ( SELECT * FROM US3R WHERE email = '${email}')`
    )
    let exists = Object.values(response[0][0])[0] // If a user with this email exists it returns 1, else 0
    return exists;
}

async function getUser(connection, email) {
    let response = await connection.execute(
        `SELECT first_name,last_name,email,phone,password,adminRights 
         FROM US3R
         WHERE email = '${email}'`
    )
    return response[0][0]
}

async function getProperties(connection) {
    let response = await connection.execute(
        `SELECT *
         FROM PROPERTY
         `
    )
    return response[0]
}

async function getRecommendations(connection){
    let response = await connection.execute(
        `SELECT *
         FROM PROPERTY
         ORDER BY firstPublished DESC
         LIMIT 8
         `       
    )
    return response[0]
}

async function getProperty(connection, ID) {
    let response = await connection.execute(
        `SELECT *
         FROM PROPERTY
         WHERE ID = ${ID}`
    )
    //Check if its residential
    let residential = await connection.execute(
        `SELECT *
         FROM RESIDENTIAL
         WHERE rpropertyID = ${ID}`
    )
    if (residential[0][0]) {
        response[0][0].rooms = residential[0][0].rooms
    }
    else {
        let commercial = await connection.execute(
            `SELECT *
             FROM COMMERCIAL
             WHERE cpropertyID = ${ID}`
        )
        response[0][0].commercialType = commercial[0][0].commercialType
    }

    return response[0][0]
}

async function getOwnerInfo(connection, ID) {
    let response = await connection.execute(
        `SELECT first_name,last_name,email,phone
         FROM US3R
         WHERE ID = ${ID}`
    )
    return response[0][0]
}

async function approveListing(connection, ID) {
    await connection.execute(
        `UPDATE PROPERTY
         SET state = 'approved'
         WHERE ID = ${ID}
         `
    )
    console.log(`Property with ID = ${ID} was approved.`)
}

async function deleteListing(connection, ID) {
    await connection.execute(
        `DELETE FROM RESIDENTIAL
         WHERE rpropertyID = ${ID}
         `
    )
    await connection.execute(
        `DELETE FROM COMMERCIAL
         WHERE cpropertyID = ${ID}
         `
    )
    await connection.execute(
        `DELETE FROM PROPERTY
         WHERE ID = ${ID}
         `
    )
    console.log(`Property with ID = ${ID} was deleted.`)
}

async function updateListing(connection, updateData, propertyID) {
    let date = new Date().toISOString().split('T')[0]
    console.log(date)
    if (updateData.photo) {
        await connection.execute(
            `UPDATE PROPERTY
             SET price = ${updateData.price}, comments = '${updateData.comments}', photo = '${updateData.photo}, lastPublished = '${date}'
             WHERE ID = ${propertyID}
            `
        )

    }
    else {
        await connection.execute(
            `UPDATE PROPERTY
             SET price = ${updateData.price}, comments = '${updateData.comments}', lastPublished = '${date}'
             WHERE ID = ${propertyID}
            `
        )
    }

}
async function getPropertiesByQuery(connection, filters) {
    let rules
    let response
    if(filters.minPrice){
        rules = `price >= ${filters.minPrice} `
    }
    else{
        rules = `price >= 0 `
    }

    if (filters.maxPrice) {
        rules = rules + `AND price <= ${filters.maxPrice} `
    }

    if(filters.minArea){
        rules = rules + `AND area >= ${filters.minArea} `
    }
    else{
        rules =  rules + `AND area >= 0 `
    }

    if (filters.maxArea) {
        rules = rules + `AND area <= ${filters.maxArea} `
    }
    
    if (filters.listingType) {
        rules = rules + `AND listingType = '${filters.listingType}' `
    }
    if (filters.propertyType) {
        if (filters.propertyType == 'residential') {
            rules = rules + `AND EXISTS (SELECT 1 FROM RESIDENTIAL WHERE PROPERTY.ID = RESIDENTIAL.rpropertyID)`
        }
        else if (filters.propertyType == 'all') {

        }
        else {
            rules = rules + `AND EXISTS (SELECT 1 FROM COMMERCIAL WHERE PROPERTY.ID = COMMERCIAL.cpropertyID AND COMMERCIAL.commercialType = '${filters.propertyType}')`
        }
    }
    if(filters.country){
        if (filters.country != 'all' && filters.country != '') {
            rules = rules + `AND country = '${filters.country}'`
        }
    }


    if (filters.city != 'all' && filters.city!= '') {
        rules = rules + `AND city = '${filters.city}'`
    }

    response = await connection.execute(
        `SELECT *
         FROM PROPERTY
         WHERE ${rules}
        `
    )

    return response[0]
}
export { registerUser, makeListing, checkUser, getUser, getProperties, getProperty, getOwnerInfo, approveListing, deleteListing, updateListing, getPropertiesByQuery, getRecommendations, updateUser }