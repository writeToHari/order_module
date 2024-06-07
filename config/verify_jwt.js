const jwt = require('jsonwebtoken');

const commonStatusCode = require("../middleware/statusCode")
const commonErrorMessages = require("../middleware/errorMessages")
const errorHandler = require('../middleware/errorHandler')
const successMessage = require('../middleware/successMessage')
const successHandler = require('../middleware/successHandler')

exports.verifyJwtToken = (req, res, next) => {
    try {
        if (req.headers['authorization']) {
            jwt.verify(req.headers['authorization'], process.env.secret_key, (err, decoded) => {
                if (err) {
                    errorHandler({
                        statusCode: commonStatusCode.clientCodes.Bad_Request,
                        message: commonErrorMessages.errorMessages.INVALID_CREDIENTIAL
                    }, req, res, next)
                } else {
                    req.user = decoded
                    next()
                }
            });
        } else {
            errorHandler({
                statusCode: commonStatusCode.successCodes.OK,
                message: commonErrorMessages.errorMessages.MISSING_TOKEN,
            }, req, res, next)
        }
    } catch (error) {
        console.log("error", error)
        errorHandler({
            statusCode: commonStatusCode.clientCodes.Bad_Request,
            message: commonErrorMessages.errorMessages.INVALID_CREDIENTIAL
        }, req, res, next)
    }
}