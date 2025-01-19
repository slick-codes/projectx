
const { DataTypes } = require('sequelize')
const { sequelize } = require('./../config/db')
const Role = require('./Role')

const { STRING } = DataTypes

const groupSchema = {
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

const Group = sequelize.define('Group', groupSchema, {
    timestamps: true,
    hooks: {},
})

Group.sync({ alter: true })
    .then((_) => console.log('Group synced successfully!'))
    .catch((_) => console.log('Group sync failed'))

// setup grouping
Group.belongsToMany(Role, { through: 'GroupRole' })
Role.belongsToMany(Group, { through: 'GroupRole' })

module.exports = Group
