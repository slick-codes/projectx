const { DataTypes } = require('sequelize')
const { sequelize } = require('./../config/db')
const bcrypt = require('bcryptjs')
const CustomError = require('../helpers/error')

const { STRING, BOOLEAN, INTEGER } = DataTypes

const adminSchema = {
    fullName: {
        type: STRING,
        allowNull: false,
    },
    group: {
        type: INTEGER,
        allowNull: false,
    },
    createdBy: {
        type: INTEGER,
        allowNull: true,
    },
    password: {
        type: STRING,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
    },
    completed: {
        type: BOOLEAN,
        defaultValue: false,
    },
}

const User = sequelize.define('User', adminSchema, {
    timestamps: true,
    hooks: {},
})

User.sync({ alter: true })
    .then((_) => process.env.NODE_ENV === "production" && console.log("User synced successfully!"))
    .catch((_) => process.env.NODE_ENV === "production" && console.log("User synced failed"))

User.prototype.encrypt = async function (key) {
    this[key] = await bcrypt.hash(this[key], Number(process.env.PASSWORD_HASH))
}

User.verifyLoginCredentials = async function (credentials) {
    // check if user with  eamil already exists
    const user = await User.findOne({ where: { email: credentials.email } })
    if (!user) return CustomError.unauthorizedRequest('Invalid Credentials')

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
    if (!isPasswordCorrect) return CustomError.unauthorizedRequest('Invalid Credentials')

    return user
}

module.exports = User
