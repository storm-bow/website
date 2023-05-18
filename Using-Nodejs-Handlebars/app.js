import express from 'express'
import * as expHbs from 'express-handlebars'
import {router} from './routing.js'
import bodyParser from 'body-parser';
import path from "path"
import { fileURLToPath } from 'url';
import multer from "multer"
import bcrypt from "bcrypt"
import expSession from 'express-session'
import createMemoryStore from 'memorystore';
import { userInfo } from 'os';

const app = express()
const memoryStore = createMemoryStore(expSession)
const sessionConf = {
    secret: process.env.secret || "FA5%IOaA2NaKFS9JAFs091fC",
    cookie: {maxAge: 600*1000},
    store: new memoryStore({ checkPeriod: 86400 * 1000 }),
    resave: false,
    saveUninitialized: false
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'hbs');
const hbs = expHbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: path.join(__dirname,'views/partials'),
    layoutsDir: path.join(__dirname,'views/layouts'),
    helpers: {
        eq(arg1, arg2, options) { return (arg1 == arg2) ? options.fn(this) : options.inverse(this);},
        whichNavbar(user) {
            if(user){
                return 'auth-navbar'
            }
            else{
                return 'navbar'
            }
        }
    }
})
app.engine('hbs',hbs.engine)

//Define the folder that includes static files (handlebars needs this)
app.use(express.static("static"))
//Session
app.use(expSession(sessionConf))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use("/",router)

app.listen(8070, (err) => {
    if (err) {
        console.log("Something happened")
    }
    console.log("Start")
})