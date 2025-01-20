const { Schema } = require("json-validace")
const CustomError = require("../helpers/error")
const User = require("../models/User")
const Role = require("../models/Role")
const { OK } = require("http-status-codes")
const Token = require("../models/Token")
const Permission = require("../models/Permission")



module.exports.createSuperAdmin = async function(req, res, next){
   try{
      const schema = new Schema({
         fullName: { type: "string", required: true},
         email: { type: "email", required: true},
         password: { type: "string", required: true, match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/}
      })
      {}

      const r = schema.validate(req.body)
      if(r.error){
         return next(CustomError.badRequest("Invalid Request Body", r.error))
      }

      // check if user with that email exist
      const userExist = await User.findOne()
      if(userExist){
         return next(CustomError.unauthorizedRequest("there is already a superadmin"))
      }

      const role = await Role.findOne({where: { name: "superadmin"}})

      const user = new User({
         ...req.body,
         role: role.id
      })

      await user.encrypt("password")
      await user.save()

      res.status(OK).json({
         success: true,
         status: res.statusCode,
         message: "Super admin created successfully",
         data: user
      })

   }catch(error){
      return next({error})
   }
}

module.exports.login = async function(req,res,next){
   try{
        const schema = new Schema({
            email: { type: 'email', required: true },
            password: { type: 'string', required: true },
        })

        const result = schema.validate(req.body)
        if (result.error) {
            return next(CustomError.badRequest('Invalid request body', result.error))
        }

        const body = result.data
        const user = await User.verifyLoginCredentials(body)
        if (user instanceof CustomError) return next(user)

        const tokens = await Token.generate(user)
        if (tokens instanceof CustomError) {
            return next(tokens)
        }
        res.status(OK).json({
            success: true,
            status: res.statusCode,
            message: 'User login successfully',
            data: {
                user,
                tokens,
            },
        })
   }catch(error){
      return next({error})
   }
}

module.exports.getUser = async function(req,res,next){
   try{
      res.status(OK).json({
         success: true,
         status: res.statusCode,
         message: "User's info fetched successfully",
         data: {
                ...req.user.dataValues,
                role: req.role|| {},
         },
      })
   }catch(error){
      return next({error})
   }
}

module.exports.generateAccessToken = async function(req, res, next){
    try {
        const schema = new Schema({ refreshToken: { type: 'string', required: true } })
        const result = schema.validate(req.body)
        if (result.error) {
            return next(CustomError.badRequest('Invalid request body', result.error))
        }

        const body = result.data

        const tokens = await Token.generateNewAccessToken(body.refreshToken)
        if (tokens instanceof CustomError) {
            return next(tokens)
        }

        res.status(OK).json({
            success: true,
            status: res.statusCode,
            data: tokens,
        })
    } catch (error) {
        return next({ error })
    }
}

module.exports.createRole = async function (req, res, next) {
    try {
        const schema = new Schema({
            name: { type: 'string', required: true },
            description: { type: 'string', required: true },
            permissions: { type: 'array', required: true },
        })

        const result = schema.validate(req.body)
        if (result.error) {
            return next(CustomError.badRequest('Invalid request body', result.error))
        }

        const body = result.data
        console.log(body)

        if (await Role.findOne({ where: { name: body.name } })) {
            return next(CustomError.badRequest('Role with that name already exist!'))
        }

        const role = await Role.create({
            description: body.description,
            name: body.name,
        })

        if (body.permissions.length > 0) {
           try{
              await role.addPermission(body.permissions)
           }catch(error){}
        }

        res.status(OK).json({
            success: true,
            status: res.statusCode,
            message: 'Role was successfully created',
            data: await Role.findOne({
                where: { id: role.id },
                include: Permission,
            }),
        })
    } catch (error) {
        return next({ error })
    }
}

module.exports.getPermission = async function (_req, res, next) {
    try {
        const permissions = await Permission.findAll({
            include: Role,
        })

        res.status(OK).json({
            success: true,
            status: res.statusCode,
            message: 'Permission fetched successfully',
            data: permissions,
        })
    } catch (error) {
        return next({ error })
    }
}

module.exports.getRoles = async function(_req,res,next){
    try {
        const roles = await Role.findAll({
            include: Permission,
        })

        res.status(OK).json({
            success: true,
            status: res.statusCode,
            message: 'Roles fetched successfully',
            data: roles,
        })
    } catch (error) {
        return next({ error })
    }
}


module.exports.attachPermissionToRole = async function (req, res, next) {
    try {
        const schema = new Schema({
            permissions: { type: 'array', required: true },
            role: { type: 'number', required: true },
        })

        const result = schema.validate(req.body)
        if (result.error) {
            return next(CustomError.badRequest('Invalid request body', result.error))
        }

        const body = result.data
        if (!body.permissions.length) {
            return next(CustomError.badRequest('At least one permission should be provided'))
        }
        const role = await Role.findByPk(body.role)

        if (!role) {
            return next(CustomError.badRequest('Role does not exist!'))
        }

        const permissions = await Promise.all(
            body.permissions.map(async (n) => {
                const permission = await Permission.findByPk(n)
                if (!permission) {
                    return CustomError.badRequest(`${n} is not valid Permission ID`)
                }
                return permission.id
            })
        )

        for (let r of permissions ) {
            if (r instanceof CustomError) {
                return next(r)
            }
        }

        /// attach roles to group
        await role.addPermission(permissions)

        res.status(OK).json({
            success: true,
            status: res.statusCode,
            message: 'Permissions where successfully attached to the Role',
            data: await Role.findOne({
                where: { id: role.id },
                include: Permission,
            }),
        })
    } catch (error) {
        return next({ error })
    }
}





