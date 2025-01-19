const router = require("express").Router()
const { auth } = require("../middlewares/auth")
const controllers = require("./../controllers/user")



const all = [auth]


router.post("/create/superadmin", controllers.createSuperAdmin)
router.post("/login", controllers.login)

// auth endpoints 
router.get("/",...all, controllers.getUser)
router.post("/generate/token",  controllers.generateAccessToken)
router.post("/create", ...all, controllers.createAccount)




module.exports = router
