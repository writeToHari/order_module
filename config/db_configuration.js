const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config()

class DbConnection {
    async setDBConnection() {
        console.log("DB Connection Called")
        try {
            console.log("mongoose connection", process.env.DB_PROTOCOL + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + '/' + process.env.DB_NAME)
            await mongoose.connect(process.env.DB_PROTOCOL + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_HOST + '/' + process.env.DB_NAME)
                .then(() => {
                    console.log("DB Connected")
                })
                .catch((error) => {
                    console.log("Error message", error)
                })
        } catch (error) {
            console.log('error', error)
        }
    }
}

let connection = new DbConnection();

module.exports = connection

