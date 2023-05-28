import express from 'express';
import basicinfo from "./static/some-info.json" assert { type: "json"}
import * as dbquery from "./database-queries.js"
import { connection } from './database-connector.js';
import { body, validationResult } from "express-validator"
import asyncHandler from "express-async-handler"
import bodyParser from 'body-parser';
import multer from "multer"
import bcrypt from 'bcrypt'
import fs from "fs"


const router = express.Router();

const upload = multer({ dest: 'static/uploads/' })

router.get("/", (req,res) => {
    res.redirect("main")
})

router.get("/main", asyncHandler(async (req, res) => {
    let recommendations = await dbquery.getRecommendations(connection);
    if (req.session.authenticatedUser) {
        res.render("recommendations", { layout: "main", user: req.session.authenticatedUser, recommendations: recommendations })
    }
    else {
        res.render("recommendations", { layout: "main", user: false, recommendations: recommendations })
    }
}))

router.get("/about-us", (req, res) => {
    if (req.session.authenticatedUser) {
        res.render("creators", { layout: "about-us", creators: basicinfo.creators, user: req.session.authenticatedUser })
    }
    else {
        res.render("creators", { layout: "about-us", creators: basicinfo.creators })
    }
})
router.get("/login", (req, res) => {
    if (req.session.authenticatedUser) {
        res.render("nothing", { layout: "login", user: req.session.authenticatedUser })
    }
    else {
        res.render("nothing", { layout: "login" })
    }
})

router.get("/register", (req, res) => {
    if (req.session.authenticatedUser) {
        res.render("nothing", { layout: "register", user: req.session.authenticatedUser })
    }
    else {
        res.render("nothing", { layout: "register" })
    }
})

router.get("/profile", (req, res) => {
    if (req.session.authenticatedUser) {
        res.render("nothing", { layout: "profile", user: req.session.authenticatedUser })
    }
    else {
        res.redirect("/main")
    }
})
router.get("/make-listing", (req, res) => {
    if (req.query.type === "residential") {
        if (req.session.authenticatedUser) {
            res.render("rooms", { layout: "make-listing-page", type: "residential", user: req.session.authenticatedUser })
        }
        else {
            res.redirect("main")
        }
    }
    else {
        if (req.session.authenticatedUser) {
            res.render("commercial", { layout: "make-listing-page", type: "commercial", user: req.session.authenticatedUser })
        }
        else {
            res.redirect("main")
        }
    }

})

router.get("/listings", asyncHandler(async (req, res) => {
    let properties;
    let index = 0;
    if(req.query.index){
        index = req.query.index;
    }
    if (req.session.authenticatedUser) {
        if(req.session.authenticatedUser.adminRights == 1){
            properties = await dbquery.getAllProperties(connection,index);
        }
        else{
            properties = await dbquery.getProperties(connection,index);
        }
        res.render("properties", { layout: "listings", properties: properties, user: req.session.authenticatedUser })
    }
    else {
        properties = await dbquery.getProperties(connection,index);
        res.render("properties", { layout: "listings", properties: properties })
    }
}))


router.get("/edit-listing", asyncHandler(async (req, res) => {
    let property = await dbquery.getProperty(connection, req.query.id)
    if (req.session.authenticatedUser) {
        let owner = await dbquery.getOwnerInfo(connection, property.ownerID)
        if (req.session.authenticatedUser.email == owner.email) {
            res.render("nothing", { layout: "edit-property", property: property, user: req.session.authenticatedUser })
        }
    }
    else {
        res.redirect("/main")
    }
}))

//LOGIN
router.post("/login", asyncHandler(async (req, res, next) => {
    //Authenticate User

    let check = await dbquery.checkUser(connection, req.body.email); // checks if a user with this emal exists
    if (check === 0) {
        res.render("nothing", { layout: "login", error: [{ msg: "Error: Wrong email or password" }] })
    }
    else {
        let user = await dbquery.getUser(connection, req.body.email)
        let result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
            // επιτυχία, αποθηκεύομε το username στις μεταβλητές συνεδρίας
            // ώστε να ξέρουμε πως έγινε η σύνδεση
            req.session.authenticatedUser = {
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                email: user.email,
                adminRights: user.adminRights
            }
            res.redirect('/main')
        }
        else {
            // αποτυχία, ανακατεύθυνση στη φόρμα εισόδου για νέα δοκιμή
            res.render("nothing", { layout: "login", error: [{ msg: "Error: Wrong email or password" }] })
        }
    }
}))

//LOG-OUT
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.redirect('/main')
            }
        });
    } else {
        res.end()
    }
})
//REGISTER USER
router.post(
    "/register",
    body("first_name").trim().isLength({ min: 1 }).escape(),
    body("last_name").trim().isLength({ min: 1 }).escape(),
    body("email").trim().escape(),
    body("phone").trim().isLength({ min: 10, max: 10 }).escape().withMessage("Error: phone number should be 10 numbers"),
    body("password").trim().isLength({ min: 8 }).escape().withMessage("Error: password must be at least 8 characters"),
    body("vpassword").trim().isLength({ min: 8, max: 80 }).escape(),
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create Author object with escaped and trimmed data
        const user = {
            fname: req.body.first_name,
            lname: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone
        }

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("nothing", {
                layout: "register",
                user: user,
                error: errors.array()
            });
            return;
        } else {
            if (req.body.password != req.body.vpassword) {
                res.render("nothing", { layout: "register", error: [{ msg: "Error: passwords don't match" }] })

            }
            else {
                req.body.password = bcrypt.hashSync(req.body.password, 10)
                let newEntry = await dbquery.registerUser(connection, req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.password)
                if (newEntry === false) {
                    res.render("nothing", { layout: "register", error: [{ msg: "Error: this email is already in use." }] })
                }
                else {
                    // Data from form is valid.
                    // Save data.
                    //await author.save();
                    // Redirect to completion page
                    res.redirect("/main");
                }

            }

        }
    }

    )
)
//MAKE LISTING
router.post(
    "/make-listing",
    body("propertyType").trim().escape(),
    body("listingType").trim().escape(),
    body("country").trim().isLength({ min: 1, max: 30 }).escape(),
    body("city").trim().isLength({ min: 1, max: 30 }).escape(),
    body("street").trim().isLength({ min: 1, max: 30 }).escape(),
    body("streetNumber").trim().escape(),
    body("floor").trim().escape(),
    body("numberOfFloors").trim().escape(),
    body("bathrooms").trim().escape(),
    body("rooms").trim().escape(),
    body("commercialType").trim().isLength({ min: 1, max: 25 }).escape(),
    body("constrYear").trim().escape(),
    body("area").trim().escape(),
    body("price").trim().escape(),
    body("comments").trim().isLength({ max: 200 }).escape(),
    upload.single("photo"),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        let property = req.body
        property["photo"] = req.file.path.replace('static/', '');
        let user = req.session.authenticatedUser
        await dbquery.makeListing(connection, property, user)
        res.redirect("/make-listing")
    })

)
export { router };

//Open Specific property page

router.get("/listed-item", asyncHandler(async (req, res) => {
    let property = await dbquery.getProperty(connection, req.query.id)
    let owner = await dbquery.getOwnerInfo(connection, property.ownerID)
    if (req.session.authenticatedUser) {
        res.render("nothing", { layout: "listed-item", property: property, owner: owner, user: req.session.authenticatedUser })
    }
    else {
        res.render("nothing", { layout: "listed-item", property: property, owner: owner })
    }
}))

//APROVE LISTED ITEM

router.get("/listed-item/approve", asyncHandler(async (req, res) => {
    if (req.session.authenticatedUser.adminRights) {
        let admin = await dbquery.getUser(connection, req.session.authenticatedUser.email)
        if (req.session.authenticatedUser.email == admin.email) {
            await dbquery.approveListing(connection, req.query.id)
            res.redirect(`/listed-item?id=${req.query.id}`)
        }
    }
    else {
        res.redirect("listings")
    }
}))

//DELETE LISTED ITEM

router.get("/listed-item/delete", asyncHandler(async (req, res) => {
    let property = await dbquery.getProperty(connection, req.query.id)
    if (req.session.authenticatedUser) {
        let owner = await dbquery.getOwnerInfo(connection, property.ownerID)
        if (req.session.authenticatedUser.email == owner.email) {

            fs.unlinkSync('static/' + property.photo);

            await dbquery.deleteListing(connection, req.query.id)
            res.redirect(`/listings`)
        }
        let admin = await dbquery.getUser(connection, req.session.authenticatedUser.email)
        admin = admin
        if (req.session.authenticatedUser.email == admin.email) {
            await dbquery.deleteListing(connection, req.query.id)
            res.redirect(`/listings`)
        }
    }
    else {
        res.redirect("listings")
    }
}))

//EDIT LISTED ITEM

router.post(
    "/edit-listing",
    body("price").trim().escape(),
    body("comments").trim().isLength({ max: 200 }).escape(),
    upload.single("photo"),
    asyncHandler(async (req, res) => {
        let property = await dbquery.getProperty(connection, req.query.id)
        let updateData = req.body
        if (req.file) {
            fs.unlinkSync('static/' + property.photo);
            updateData["photo"] = req.file.path.replace('static/', '');
        }
        if (req.session.authenticatedUser) {
            let owner = await dbquery.getOwnerInfo(connection, property.ownerID)
            if (req.session.authenticatedUser.email == owner.email) {
                await dbquery.updateListing(connection, updateData, req.query.id)
                res.redirect(`/listed-item?id=${req.query.id}`)
            }
        }
        else {
            res.redirect("/main")
        }
    }))

//FILTERING LISTINGS

router.post(
    "/listings",
    body("listing-type"),
    asyncHandler(async (req, res) => {
        let filters = req.body
        let properties
        let index = 0;
        if(req.query.index){
            index = req.query.index;
        }
        if (req.session.authenticatedUser) {
            properties = await dbquery.getPropertiesByQuery(connection, filters, req.session.authenticatedUser.adminRights, index);
            res.render("properties", { layout: "listings", properties: properties, user: req.session.authenticatedUser })
        }
        else {
            properties = await dbquery.getPropertiesByQuery(connection, filters, index = index);
            res.render("properties", { layout: "listings", properties: properties })
        }
    }))

//UPDATE PROFILE

router.post(
    "/profile",
    body("first_name").trim().isLength({ min: 1 }).escape(),
    body("last_name").trim().isLength({ min: 1 }).escape(),
    body("email").trim().escape(),
    body("phone").trim().isLength({ min: 10, max: 10 }).escape().withMessage("Error: phone number should be 10 numbers"),
    body("password").trim().escape(),
    body("vpassword").trim().escape(),
    body("opassword").trim().escape(),
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        console.log(req.body)
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("nothing", {
                layout: "profile",
                user: req.session.authenticatedUser,
                error: errors.array()
            });
            
        } else {
            let user = await dbquery.getUser(connection, req.session.authenticatedUser.email)
            let result = await bcrypt.compare(req.body.opassword, user.password);
            if(result){
                if (req.body.password != req.body.vpassword) {
                    res.render("nothing", { layout: "profile", user: req.session.authenticatedUser, error: [{ msg: "Error: New passwords don't match" }] })
    
                }
                else {
                    if(req.body.password != '' && req.body.password.length()<8){
                        res.render("nothing", { layout: "profile", user: req.session.authenticatedUser, error: [{ msg: "Error: New password should be at least 8 digits." }] })
                    }
                    req.body.password = bcrypt.hashSync(req.body.password, 10)
                    let newEntry = await dbquery.updateUser(connection, req.body.first_name, req.body.last_name,req.session.authenticatedUser.email, req.body.email, req.body.phone, req.body.password)
                    if (newEntry === false) {
                        res.render("nothing", { layout: "profile", user: req.session.authenticatedUser, error: [{ msg: "Error: this email is already in use." }] })
                    }
                    else {
                        // Data from form is valid.
                        res.redirect("/profile");
                    }
    
                }
    
            }
            else{
                res.render("nothing", { layout: "profile", error: [{ msg: "Error: Wrong Password." }] })
            }
            
        }
    }

    )
)