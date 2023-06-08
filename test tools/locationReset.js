const mongoose = require('mongoose')
const Location = require('../models/location')

mongoose.connect('mongodb://127.0.0.1:27017/vbook')

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const seedDB = async () => {
    await Location.deleteMany({})
}

seedDB().then(() => {
    mongoose.connection.close()
    console.log("Locations successfully cleared")
})