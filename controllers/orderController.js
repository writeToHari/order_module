const Types = require('mongoose').Types

const commonStatusCode = require("../middleware/statusCode")
const errorHandler = require('../middleware/errorHandler')
const successMessage = require('../middleware/successMessage')
const successHandler = require('../middleware/successHandler')
const orderService = require("../services/orderService")

exports.createOrderController = async (req, res, next) => {
    try {
        var getOrderResults = orderService.createOrderService(req)
        if (getOrderResults) {
            successHandler({
                statusCode: commonStatusCode.successCodes.Created,
                message: successMessage.Messages.ORDER_CREATED,
                data: getOrderResults
            }, req, res, next)
        }
    } catch (error) {
        errorHandler({
            statusCode: commonStatusCode.serverCodes.Internal_Server_Error,
            message: error.message
        }, req, res, next)
    }
}

exports.listOrderController = async (req, res, next) => {
    try {
        var getOrderList = await orderService.getOrderDetails(req.user)
        if (getOrderList.length != 0) {
            successHandler({
                statusCode: commonStatusCode.successCodes.OK,
                message: successMessage.Messages.ORDER_LIST,
                data: getOrderList
            }, req, res, next)
        } else {
            successHandler({
                statusCode: commonStatusCode.successCodes.OK,
                message: successMessage.Messages.DATA_NOT_FOUND,
                data: getOrderList
            }, req, res, next)
        }

    } catch (error) {
        errorHandler({
            statusCode: commonStatusCode.serverCodes.Internal_Server_Error,
            message: error.message
        }, req, res, next)
    }
}

exports.removeOrderController = async (req, res, next) => {
    try {
        var getOrderResults = await orderService.removeOrders(req.body.product_id)
        if (getOrderResults != '') {
            successHandler({
                statusCode: commonStatusCode.successCodes.OK,
                message: successMessage.Messages.ORDER_REMOVED,
                data: getOrderResults
            }, req, res, next)
        } else {
            successHandler({
                statusCode: commonStatusCode.successCodes.OK,
                message: successMessage.Messages.DATA_NOT_FOUND,
                data: getOrderResults
            }, req, res, next)
        }
    } catch (error) {
        errorHandler({
            statusCode: commonStatusCode.serverCodes.Internal_Server_Error,
            message: error.message
        }, req, res, next)
    }
}