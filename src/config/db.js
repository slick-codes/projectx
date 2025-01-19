const { Sequelize, DataTypes } = require('sequelize')

const databasename = process.env.DATABASE_NAME
const username = process.env.DATABASE_USERNAME
const password = process.env.DATABASE_PASSWORD
const hostAddress = process.env.DATABASE_HOSTNAME

// Create the sequelize instance
const sequelize = new Sequelize(databasename, username, password, {
    host: hostAddress,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
})

module.exports.startDB = async function (services) {
    sequelize
        .sync(/* { alter: true } */)
        .then(async () => {
            // create the configuration table if it's not created
            services.forEach((service) => {
                const result = service()
                if (result instanceof Promise)
                    // check if value is a promise
                    result.then((_) => {}).catch((_) => console.log(_))
            })

            console.log('app connected to mySQL server 🚀')
        })
        .catch(async (error) => {
            console.log('Unable to connect to database', '\n -----------------------------')
        })
}

module.exports.sequelize = sequelize
