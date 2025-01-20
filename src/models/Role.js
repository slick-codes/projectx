const { DataTypes } = require('sequelize')
const { sequelize } = require('./../config/db')
const Permission = require('./Permission')

const { STRING } = DataTypes

const roleSchema = {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: STRING,
        allowNull: false,
    },
}

const Role = sequelize.define('Role', roleSchema, {
    timestamps: true,
    hooks: {},
})

Role.sync({ alter: true })
    .then((_) => process.env.NODE_ENV === "production" && console.log("Role synced successfully!"))
    .catch((_) => process.env.NODE_ENV === "production" && console.log("Role synced failed"))

// setup grouping
Role.belongsToMany(Permission, { through: 'RolePermission' })
Permission.belongsToMany(Role, { through: 'RolePermission' })

module.exports = Role
