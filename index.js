// External Imports
const cors = require('cors')
const dotenv = require('dotenv');
const express = require('express');

// Internal Imports
const commonStatusCode = require('./middleware/statusCode')
const dbConnection = require('./config/db_configuration')
const commonMessages = require('./middleware/errorMessages')
const errorHandler = require('./middleware/errorHandler')
const routes = require('./routes');



dotenv.config()
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors([{
    origin: [
        "http://localhost:5173",
        "http://localhost:7000",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
    ],
    method: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"]
}]))

app.use("/api/v1/", routes)

app.use(function (req, res, next) {
    return res.status(commonStatusCode.clientCodes.Method_Not_Allowed).send({
        error: commonMessages.errorMessages.Invalid_METHOD,
        statusCode: commonStatusCode.clientCodes.Method_Not_Allowed,
    });
});


app.listen(process.env.PORT, () => {
    console.log('Running on port :' + process.env.PORT)
})

dbConnection.setDBConnection()

app.use(errorHandler)