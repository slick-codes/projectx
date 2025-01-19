const router = require("express").Router()
const controllers = require("./../controllers/user")





router.post("/create/superadmin", controllers.createSuperAdmin)




module.exports = router
