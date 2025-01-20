const router = require("express").Router()
const { auth, permitter } = require("../middlewares/auth")
const controllers = require("./../controllers/staff")



const all = [auth]


// auth endpoints 
router.post("/create", [...all, permitter([])], controllers.createAccount)
router.get("/verify/:reference", controllers.verifyReference)
router.patch("/setup",   controllers.setupAccount)
router.get("/",...all, permitter([]),  controllers.getStaffs)




module.exports = router
