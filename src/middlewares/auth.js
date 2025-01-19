const CustomError = require('../helpers/error')
const Group = require('../models/Group')
const Role = require('../models/Role')
const Token = require('../models/Token')

module.exports.auth = async function (req, res, next) {
    try {
        // extract access token from header
        const authorization = req.headers.authorization
        if (!authorization) return next(CustomError.badRequest(`${req.method}:${req.originalUrl} Requires Authentication!`, null, false))

        const accessToken = authorization.split('Bearer ')[1]
        // verify access token
        const data = await Token.verify(accessToken)

        if (data instanceof CustomError) return next(data)
        else if (!data.user) return next(CustomError.unauthorizedRequest('User deleted by admin!', null, false))

        let group
        if (data.user.group) {
            group = await Group.findOne({
                where: { id: data.user.group },
                include: Role,
            })
        }

        req.group = group
        req.user = data.user
        req.token = data.token

        return next()
    } catch (error) {
        next({ error })
    }
}

