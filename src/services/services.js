
const Role = require('../models/Role')
const Permission = require('../models/Permission')

// This function generates the role and roles for userpadmin when server starts
module.exports.generateSuperAdminGroupAndRole = async function () {
    let role = await Role.findOne({ where: { name: 'superadmin' } })
    let permission = await Permission.findOne({ where: { name: 'all' } })

    if (!role) {
        role = await Role.create({
            name: 'superadmin',
            description: 'Super admin role',
        })
       if (!permission) {
          permission = await Permission.create({
             name: 'all',
             type: "read:write",
             description: 'This role allows users to have access to all the available features',
             identifier: 'get:post:patch:delete::all.endpoint',
          })

          await role.addPermission([permission])
       }
    }

}
