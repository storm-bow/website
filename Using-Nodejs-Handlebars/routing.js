import express from 'express';
import basicinfo from "./static/some-info.json" assert { type: "json"}
import * as dbquery from "./database-queries.js"
import { connection } from './database-connector.js';
import { body, validationResult } from "express-validator"
import asyncHandler from "express-async-handler"
import bodyParser from 'body-parser';
import multer from "multer"

const router = express.Router();

const upload = multer({ dest: 'uploads/' })

router.get("/main", (req, res) => {
    res.render("nothing", { layout: "main" })
}
)
router.get("/about-us", (req, res) => {
    res.render("creators", { layout: "about-us", creators: basicinfo.creators })
})
router.get("/login", (req, res) => {
    res.render("nothing", { layout: "login" })
})
router.get("/register", (req, res) => {
    res.render("nothing", { layout: "register" })
})
router.get("/make-listing", (req, res) => {
    if(req.query.type === "residential"){
        res.render("rooms",{layout: "make-listing-page", type: "residential"})
    }
    else{
        res.render("commercialType",{layout: "make-listing-page", type: "commercial"})
    }

})

//REGISTER USER
router.post(
    "/register",
    body("first_name").trim().isLength({ min: 1 }).escape(),
    body("last_name").trim().isLength({ min: 1 }).escape(),
    body("email").trim().escape(),
    body("phone").trim().isLength({min:10, max:10}).escape().withMessage("Error: phone number should be 10 numbers"),
    body("password").trim().isLength({min: 8}).escape().withMessage("Error: password must be at least 8 characters"),
    body("vpassword").trim().escape(),
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        console.log(errors)
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
            let newEntry = await dbquery.registerUser(connection,req.body.first_name,req.body.last_name,req.body.email,req.body.phone,req.body.password)
            if(newEntry===false){
                console.log("problem")
                res.render("nothing",{layout: "register", error: [{msg: "Error: this email is already in use."}]})
            }
            else if(req.body.password != req.body.vpassword){
                res.render("nothing",{layout: "register", error: [{msg:"Error: passwords don't match"}]})

            }
            else{
                // Data from form is valid.
                console.log("Saved")
                // Save data.
                //await author.save();
                // Redirect to completion page
                res.redirect("/main");
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
    body("country").trim().isLength({ min: 1, max:30 }).escape(),
    body("city").trim().isLength({ min: 1, max:30 }).escape(),
    body("street").trim().isLength({ min: 1, max:30 }).escape(),
    body("streetNumber").trim().escape(),
    body("floor").trim().escape(),
    body("numberOfFloors").trim().escape(),
    body("bathrooms").trim().escape(),
    body("rooms").trim().escape(),
    body("commercialType").trim().isLength({ min: 1, max:25 }).escape(),
    body("constrYear").trim().escape(),
    body("area").trim().escape(),
    body("price").trim().escape(),
    body("comments").trim().isLength({ max:200 }).escape(),
    upload.single("photo"),
    asyncHandler(async (req,res,next) => {
        const errors = validationResult(req);
        console.log(errors)
        let property = req.body
        property["photo"]= req.file.path
        await dbquery.makeListing(connection,property)
        res.redirect("/make-listing")
    })


)
export { router };
