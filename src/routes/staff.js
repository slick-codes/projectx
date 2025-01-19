const router = require("express").Router()
const { auth } = require("../middlewares/auth")
const controllers = require("./../controllers/staff")



const all = [auth]


// auth endpoints 
router.post("/create", ...all, controllers.createAccount)
router.get("/", ...all, controllers.getStaffs)




module.exports = router
