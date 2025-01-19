const { Schema } = require("json-validace")
const CustomError = require("../helpers/error")
const User = require("../models/User")
const Group = require("../models/Group")
const { OK } = require("http-status-codes")



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

      user.encrypt("password")
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



module.exports.createAccount = async function(req,res,next){
   try{

   }catch(error){
      return next({error})
   }
}
