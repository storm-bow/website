import express from 'express'
import {engine} from 'express-handlebars'
import {router} from './routing.js'
import bodyParser from 'body-parser';



const app = express()
app.use(express.static("static"))
app.engine('hbs',engine({extname: ".hbs"}))
app.set('view engine','hbs')

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