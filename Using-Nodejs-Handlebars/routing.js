import express from 'express';
import basicinfo from "./static/some-info.json" assert { type: "json"}
const router = express.Router();

router.get("/main", (req,res) => {
    res.render("nothing",{layout: "main"})
}
)
router.get("/about-us", (req,res) =>{
    res.render("creators",{layout: "about-us", creators: basicinfo.creators})
})
router.get("/login-register", (req,res) => {
    res.render("nothing",{layout: "login-register-page"})
})
router.get("/make-listing", (req,res) => {
    res.render("nothing",{layout: "make-listing-page"})
})
export {router};
