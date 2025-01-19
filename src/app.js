const path = require("path")
const http = require("http")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")



require("dotenv").config() // setup enviroment variables
require("./config/redis") // setup redis server connection
require("./config/db").startDB([
   // add codes that will run when database connection is completed
]) // setup mysql database connection




const app = express()
const server = http.createServer(app)


app.use(morgan('tiny')) // request logger
app.use(cors())
// parser 
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use("/static", express.static(path.join(__dirname, "..", "static")))



module.exports = server
