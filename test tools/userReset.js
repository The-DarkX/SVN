const mongoose = require('mongoose')
const User = require('../models/user')

mongoose.connect('mongodb://127.0.0.1:27017/vbook')

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const seedDB = async () => {
    await User.deleteMany({})
}

seedDB().then(() => {
    mongoose.connection.close()
    console.log("Users successfully cleared")
})