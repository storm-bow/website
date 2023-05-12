import express from 'express';
import basicinfo from "./static/some-info.json" assert { type: "json"}
import * as dbquery from "./database-queries.js"
import { connection } from './database-connector.js';
import { body, validationResult } from "express-validator"
import asyncHandler from "express-async-handler"

const router = express.Router();

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
    res.render("nothing", { layout: "make-listing-page" })
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
export { router };
