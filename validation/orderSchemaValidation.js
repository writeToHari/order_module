const joi = require('joi')

const errorHandler = require('../middleware/errorHandler')
const commonStatusCode = require('../middleware/statusCode')

const schema = {
    listOrderSchema: joi.object({
        search_text: joi.string().optional(),
        page: joi.number().optional(),
        limit: joi.number().optional(),
    }),

    createOrderSchema: joi.object({
        order_details: joi.array().items(
            joi.object({
                product_id: joi.string().hex().length(24).required(),
                quantity: joi.number().integer().min(1).required(),
            })).required(),
    }),

    removeOrderSchema: joi.object({
        product_id: joi.string().hex().length(24).required()
    }),
}

exports.listOrderValidation = (req, res, next) => {
    const { error } = schema.listOrderSchema.validate(req.query)
    if (error) {
        errorHandler({
            statusCode: commonStatusCode.clientCodes.Bad_Request,
            message: error.details[0].message
        }, req, res, next)
    } else {
        next();
    }
}

exports.createOrderValidation = (req, res, next) => {
    const { error } = schema.createOrderSchema.validate(req.body)
    if (error) {
        errorHandler({
            statusCode: commonStatusCode.clientCodes.Bad_Request,
            message: error.details[0].message
        }, req, res, next)
    } else {
        next();
    }
}

exports.removeOrderValidation = (req, res, next) => {
    const { error } = schema.removeOrderSchema.validate(req.body)
    if (error) {
        errorHandler({
            statusCode: commonStatusCode.clientCodes.Bad_Request,
            message: error.details[0].message
        }, req, res, next)
    } else {
        next();
    }
}