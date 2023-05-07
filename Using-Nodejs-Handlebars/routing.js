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

export {router};
