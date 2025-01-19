const { Schema } = require("json-validace")
const CustomError = require("../helpers/error")
const User = require("../models/User")
const Group = require("../models/Group")
const { OK } = require("http-status-codes")
const Token = require("../models/Token")



module.exports.createSuperAdmin = async function(req, res, next){
   try{
      const schema = new Schema({
         fullName: { type: "string", required: true},
         email: { type: "email", required: true},
         password: { type: "string", required: true, match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/}
      })

      const r = schema.validate(req.body)
      if(r.error){
         return next(CustomError.badRequest("Invalid Request Body", r.error))
      }

      // check if user with that email exist
      const userExist = await User.findOne()
      if(userExist){
         return next(CustomError.unauthorizedRequest("there is already a superadmin"))
      }

      const group = await Group.findOne({where: { name: "superadmin"}})

      const user = new User({
         ...req.body,
         group: group.id
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
                group: req.group || {},
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


module.exports.createAccount = async function(req, res, next){
   try{
      const schema = new Schema({
      })

   }catch(error){
      return next({error})
   }
}




