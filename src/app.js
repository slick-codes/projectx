const path = require("path")
const http = require("http")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const { NOT_FOUND } = require("http-status-codes")


require("dotenv").config() // setup enviroment variables

const { generateSuperAdminGroupAndRole } = require("./services/services")

require("./config/redis") // setup redis server connection
require("./config/db").startDB([
   // add codes that will run when database connection is completed
   generateSuperAdminGroupAndRole
]) // setup mysql database connection


// import middlewares and routes
const errorMiddleware = require("./middlewares/error")
const routes = require("./routes")


const app = express()
const server = http.createServer(app)


app.use(morgan('tiny')) // request logger
app.use(cors())
// parser 
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use("/static", express.static(path.join(__dirname, "..", "static")))


app.use("/api/v1/users", routes.user)
app.use("/api/v1/staffs", routes.staff)

// error middleware
app.use(errorMiddleware)
// handle 404
app.use(function (_req, res, _next) {
    return res.status(NOT_FOUND).json({
        message: 'Resources not found!',
        success: false,
        status: res.statusCode,
        data: null,
    })
})



module.exports = server
