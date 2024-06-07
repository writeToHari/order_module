const express = require('express')

const orderRoutes = require('./orderRoute')
const verifyJwt = require("../config/verify_jwt")


const app = express()


app.use('/orders', verifyJwt.verifyJwtToken, orderRoutes)

module.exports = app