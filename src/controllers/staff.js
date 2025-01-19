const { Schema } = require("json-validace")
const Group = require("../models/Group")
const Role = require("../models/Role")
const User = require("../models/User")
const redis = require("../config/redis")
const CustomError = require("../helpers/error")
const { Op } = require("sequelize")
const { OK } = require("http-status-codes")
const email = require("./../helpers/email")
const { randomUUID } = require("crypto")




module.exports.createAccount = async function(req, res, next){
   try{
      const schema = new Schema({
         fullName: { type: "string", required: true},
         email: { type: "email", required: true},
         callback: { type: "string", required: true},
         group: { type: "number", required: true}
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

      const group = await Group.findByPk(req.body.group)
      if(!group){
         return next(CustomError.badRequest("Group does not exist"))
      }else if(group.name === "superadmin"){
         return next(CustomError.badRequest("you cannot add another person as a superadmin"))
      }

        // sending email to user
        let reference = null
      // generate uuid
        while (!reference && await redis.get(reference)) {
            reference = randomUUID()
        }

      const url = `${req.body.callback}?reference=${reference}`
      // save email to redis
      await redis.set(reference, { ...req.body })
      await redis.expire(reference, 60 * 30) // set url to expire in 30min

      // send email 
      email.accountVerification({
         ...req.body,
         url: url,
         expiration: "30 minutes"
      })


      res.status(OK).json({
         success: true,
         status: res.statusCode,
         message: "Notification sent to user",
         data: null
      })

   }catch(error){
      return next({error})
   }
}


module.exports.getStaffs = async function(req, res, next){
   try{
      const users = await User.findAll({ where: {
         [Op.ne]: req.user.id
      }})

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
