import express from 'express'
import * as expHbs from 'express-handlebars'
import {router} from './routing.js'
import bodyParser from 'body-parser';
import path from "path"
import { fileURLToPath } from 'url';

const app = express()
app.use(express.static("static"))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'hbs');

const hbs = expHbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    partialsDir: path.join(__dirname,'views/partials'),
    layoutsDir: path.join(__dirname,'views/layouts'),
    helpers: {
        eq(arg1, arg2, options) { return (arg1 == arg2) ? options.fn(this) : options.inverse(this);}
    }
})
app.engine('hbs',hbs.engine)

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