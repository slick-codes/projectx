
const { DataTypes } = require('sequelize')
const { sequelize } = require('./../config/db')

const { STRING } = DataTypes

const roleSchema = {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
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

const Role = sequelize.define('Role', roleSchema, {
    timestamps: true,
    hooks: {},
})

Role.sync({ alter: true })
    .then((_) => console.log('Role synced successfully!'))
    .catch((_) => console.log('Role sync failed'))

const roles = [
    {
        name: "view customer's information",
       type: "read",
        identifier: 'get::v1.customers',
        description: "Allows users to view customer's information",
    },
    {
        name: "view customer's transactions",
        type: "read",
        identifier: 'get::v1.customers.transactions',
        description: "Allow users to view customer's transactions",
    },
]

roles.forEach(async (role) => {
    await Role.findOrCreate({
        where: { identifier: role.identifier },
        defaults: { ...role },
    })
})

module.exports = Role
