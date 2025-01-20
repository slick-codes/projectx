const router = require("express").Router()
const { auth, permitter } = require("../middlewares/auth")
const controllers = require("./../controllers/user")



const all = [auth]


router.post("/create/superadmin", controllers.createSuperAdmin)
router.post("/login", controllers.login)

// auth endpoints 
router.get("/",...all, controllers.getUser)
router.post("/generate/token",  controllers.generateAccessToken)
router.post("/create/roles", ...[all, permitter([])], controllers.createRole)
router.get("/permissions", [all, permitter([])] , controllers.getPermission)
router.get("/roles", ...[all, permitter([])], controllers.getRoles)
router.post("/roles/attach/permissions", ...[...all, permitter([])], controllers.attachPermissionToRole)




module.exports = router
