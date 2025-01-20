const { Schema } = require("json-validace")
const Role = require("../models/Role")
const User = require("../models/User")
const redis = require("../config/redis")
const CustomError = require("../helpers/error")
const { Op } = require("sequelize")
const { OK } = require("http-status-codes")
const email = require("./../helpers/email")
const uuid = require("uuid")




module.exports.createAccount = async function(req, res, next){
   try{
      const schema = new Schema({
         fullName: { type: "string", required: true},
         email: { type: "email", required: true},
         callback: { type: "string", required: true},
         role: { type: "number", required: true}
      })

      const r = schema.validate(req.body)
      if(r.error){
         return next(CustomError.badRequest("Invalid Request Body"))
      }

      // check if user already exist
      const user = await User.findOne({where: { email: req.body.email}})
      if(user){
         return next(CustomError.unauthorizedRequest("Email already used"))
      }

      const role = await Role.findByPk(req.body.role)
      if(!role){
         return next(CustomError.badRequest("Role does not exist"))
      }else if(role.name === "superadmin"){
         return next(CustomError.badRequest("you cannot add another person as a superadmin"))
      }

        // sending email to user
        let reference = null
      // generate uuid
        while (!reference || await redis.get(reference)) {
           reference = uuid.v1()
        }

      
      const url = `${req.body.callback}?reference=${reference}`

      const obj = {
         ...req.body,
         url: url,
         createdBy: req.user.id,
         expiration: "30 minutes"
      }

      // save email to redis
      await redis.set(reference, JSON.stringify(obj))
      await redis.expire(reference, 60 * 30) // set url to expire in 30min

      // send email 
      email.accountVerification(obj)


      res.status(OK).json({
         success: true,
         status: res.statusCode,
         message: "Notification sent to user",
         data: {
            ...req.body,
            url,
            expiration: "30 minutes",
            reference
         }
      })

   }catch(error){
      return next({error})
   }
}


module.exports.verifyReference = async function(req,res,next){
   try{
      const token = req.params.reference
      const data = await redis.get(token)

      if(!data) {
         return next(CustomError.badRequest("token expired or invalid"))
      }

      return res.status(OK).json({
         success:true,
         status: res.statusCode,
         message: "Staff reference is still active",
         data: {
            ...JSON.parse(data),
            url: undefined,
            callback: undefined,
            expiration: undefined
         }
      })

   }catch(error){
      return next({error})
   }
}

module.exports.setupAccount = async function(req,res,next){
    try {
        const schema = new Schema({
            password: { type: 'string', required: true },
            reference: { type: 'string', required: true },
            password: { type: "string", required: true, match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/}
        })

        const result = schema.validate(req.body)
        if (result.error) return next(CustomError.badRequest('Invalid Request Body', result.error))

        const body = result.data

        const data = JSON.parse(await redis.get(body.reference))
        if (!data) return next(CustomError.badRequest('Invalid Request ID'))

       const role = await Role.findByPk(data.role)
       if(!role){
          return next(CustomError.unauthorizedRequest("Cannot complete account due to group issues, contact your admin"))
       }

       const userExist = await User.findOne({where: { email: data.email }})
       if(userExist) {
          return next(CustomError.unauthorizedRequest("User with this email already exist"))
       }

        // update database
        const user = new User({
           ...data,
           ...req.body,
        })

        await user.encrypt('password')
        await user.save()


        redis.del(body.reference)

        // send response to user
        res.status(OK).json({
            success: true,
            status: res.statuscode,
            message: 'Account Created Successfully',
            data: {
                ...user.dataValues,
                role: role,
            },
        })
    } catch (error) {
        return next({ error })
    }
}


module.exports.getStaffs = async function(req, res, next){
   try{
      const users = await User.findAll({ where: {
       id:  {
          [Op.not]: req.user.id
       }
      }})

      const routes = `${req?.method}:${req.originalUrl.split("/").join(".").slice(1)}`.toLowerCase()
      console.log(routes)

      res.status(OK).json({
         success: true,
         status: res.statuscode,
         message: "Staffs fetched successfully",
         data: users
      })

   }catch(error){
      return next({error})
   }
}
