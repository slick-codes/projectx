
const server = require("./app")


const PORT = process.env.PORT || 5004
const listener = server.listen(PORT, _ => {
    console.error()
    console.error("-------------------------------------")
    console.error(`App is running on port ${PORT}`)
})

process.on("uncaughtException", error => {
    console.error("UNCAUGHT EXCEPTION! Shutting down...")
    console.error(error.name, error.message)
    console.log(error)
})

process.on("unhandledRejection", error => {
    console.error("UNHANDLED REJECTION! Shutting down...")
    console.error(error.name, error.message)
    console.log(error)

    listener.close(_ => process.exit(1))
})

