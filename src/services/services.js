
const Group = require('../models/Group')
const Role = require('../models/Role')

// This function generates the group and roles for userpadmin when server starts
module.exports.generateSuperAdminGroupAndRole = async function () {
    let group = await Group.findOne({ where: { name: 'superadmin' } })
    let role = await Role.findOne({ where: { name: 'all' } })

    if (!group) {
        group = await Group.create({
            name: 'superadmin',
            description: 'Super admin group',
        })

        if (!role) {
            role = await Role.create({
                name: 'all',
               type: "read:write",
                description: 'This role allows users to have access to all the available features',
                identifier: 'get:post:patch:delete::all.endpoint',
            })

            await group.addRoles([role])
        }
    }
}
