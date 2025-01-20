const CustomError = require('../helpers/error')
const Role = require('../models/Role')
const Permission = require('../models/Permission')
const Token = require('../models/Token')

module.exports.auth = async function (req, res, next) {
    try {
        // extract access token from header
        const authorization = req.headers.authorization
        if (!authorization) return next(CustomError.badRequest(`${req.method}:${req.originalUrl} Requires Authentication!`, null, false))

        const accessToken = authorization.split('Bearer ')[1]
        // verify access token
        const data = await Token.verify(accessToken)

        if (data instanceof CustomError) return next(data)
        else if (!data.user) return next(CustomError.unauthorizedRequest('User deleted by admin!', null, false))

        let role
        if (data.user.role) {
            role = await Role.findOne({
                where: { id: data.user.role },
                include: Permission,
            })
        }

        req.role = role 
        req.user = data.user
        req.token = data.token

        return next()
    } catch (error) {
        next({ error })
    }
}

module.exports.permitter = function(supportedPermissions = []){
   return async (req, res, next) => {
   try{

      const permissions = req.role.Permissions
      supportedPermissions = [
         "get:post:patch:delete::all.endpoint",
         ...supportedPermissions
      ]

      const routes = `${req?.method}:${req.originalUrl.split("/").join(".").slice(1)}`.toLowerCase()
      supportedPermissions.unshift(routes)

      let hasPermission = false
      for(let permission of permissions){
         if(supportedPermissions.includes(permission.identifier)){
            hasPermission = true
            break;
         }
      }

      // proceed if the user has necessary access
      if(hasPermission) return next()
      return next(CustomError.unauthorizedRequest("You do not have the necessary permission to use this endpoint"))


   }catch(error){
      return next({error})
   }
}
}



