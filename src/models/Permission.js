
const { DataTypes } = require('sequelize')
const { sequelize } = require('./../config/db')
const permissions = require("./../services/roles.json")

const { STRING } = DataTypes

const roleSchema = {
    name: {
        type: STRING,
        allowNull: false,
    },
   type: {
      type: STRING,
      allowNull: false,
   },
    description: {
        type: STRING,
        allowNull: false,
    },
    identifier: {
        type: STRING,
        allowNull: false,
        unique: true,
    },
}

const Permission = sequelize.define('Permission', roleSchema, {
    timestamps: true,
    hooks: {},
})

Permission.sync({ alter: true })
    .then((_) => process.env.NODE_ENV === "production" && console.log("Permission synced successfully!"))
    .catch((_) => process.env.NODE_ENV === "production" && console.log("Permission synced failed"))


// this ensure that the roles are created after the Role model is synced
Permission.addHook("afterSync", async function(){

   try{

   for(let permission of permissions){
      await Permission.findOrCreate({
         where: { identifier: permission.identifier },
         defaults: { ...permission },
      })
   }
      
   }catch(error){}
})


module.exports = Permission 
