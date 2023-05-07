import express from 'express'
import {engine} from 'express-handlebars'
import {router} from './routing.js'
//import database from './database-connector.js'


const app = express()
app.use(express.static("static"))
app.engine('hbs',engine({extname: ".hbs"}))
app.set('view engine','hbs')

app.use("/",router)

app.listen(8080, (err) => {
    if (err) {
        console.log("Something happened")
    }
    console.log("Start")
})