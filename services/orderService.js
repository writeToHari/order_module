const Types = require('mongoose').Types

const orderSchema = require("../models/orderSchema")
const orderItemsSchema = require("../models/orderItemsSchema")
const productSchema = require("../models/productSchema")

exports.createOrderService = async (req) => {
    var getOrderResult = ''
    var checkOrderAlreadyExists = await orderSchema.findOne({ "user_id": new Types.ObjectId(req.user._id), status: "pending" })
    console.log("product_ids", req.body.order_details)
    var totalProductAmount = await productSchema.aggregate([{
        $match: {
            _id: { $in: req.body.order_details.map((ele) => new Types.ObjectId(ele.product_id)) }
        },
    }, {
        '$group': {
            '_id': null,
            'product_details': {
                '$push': '$$ROOT'
            }
        }
    }, {
        $project: {
            "product_details": 1
        }
    }])
    if (!checkOrderAlreadyExists) {
        var prepareOrderCreation = {
            user_id: new Types.ObjectId(req.user._id),
            total_amount: 0,
            total_discount: 0,
            over_all_amount: 0,
            order_date: new Date(),
            status: "pending",
            shipping_address: ""
        }
        getOrderResult = await orderSchema.create(prepareOrderCreation)
    } else {
        getOrderResult = checkOrderAlreadyExists
    }
    for (let j = 0; j < totalProductAmount[0]['product_details'].length; j++) {
        var prepareOrderItems = {}
        prepareOrderItems['order_id'] = getOrderResult['_id']
        prepareOrderItems['product_id'] = totalProductAmount[0]['product_details'][j]['_id']
        prepareOrderItems['quantity'] = req.body.order_details.filter((ele) => ele['product_id'] === totalProductAmount[0]['product_details'][j]['_id'].toString())[0]['quantity']
        prepareOrderItems['price'] = Number(prepareOrderItems['quantity']) * Number(totalProductAmount[0]['product_details'][j]['price'])
        prepareOrderItems['discount'] = totalProductAmount[0]['product_details'][j]['discount_percentage']
        await orderItemsSchema.create(prepareOrderItems)
    }

    var totalOrderItemsAmount = await orderItemsSchema.aggregate([{
        $match: {
            order_id: new Types.ObjectId(getOrderResult['_id'])
        },
    }, {
        '$group': {
            '_id': null,
            'total_sum': {
                '$sum': '$price'
            },
            'total_discount': {
                '$sum': '$discount'
            }
        }
    }, { "$project": { "total_sum": 1, "total_discount": 1, "over_all_amount": { $subtract: ["$total_sum", "$total_discount"] } } }])

    await orderSchema.updateOne({ _id: new Types.ObjectId(getOrderResult['_id']) },
        { $set: { total_amount: totalOrderItemsAmount[0]['total_sum'], total_discount: totalOrderItemsAmount[0]['total_discount'], over_all_amount: totalOrderItemsAmount[0]['over_all_amount'] } })

    return getOrderResult
}

exports.getOrderDetails = async (user_data) => {
    var getOrderDetails = await orderSchema.aggregate([
        {
            $match: { user_id: new Types.ObjectId(user_data['_id']) }
        },
        {
            '$lookup': {
                'from': 'orderitems',
                'localField': '_id',
                'foreignField': 'order_id',
                'as': 'order_items',
                'pipeline': [
                    {
                        '$lookup': {
                            'from': 'products',
                            'localField': 'product_id',
                            'foreignField': '_id',
                            'as': 'product_details',
                            'pipeline': [
                                {
                                    '$project': {
                                        'title': 1,
                                        'discount_percentage': 1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }, {
            '$project': {
                'total_amount': 1,
                'total_discount': 1,
                'over_all_amount': 1,
                'product_details': {
                    '$map': {
                        'input': '$order_items',
                        'as': 'order_items',
                        'in': {
                            '$mergeObjects': [
                                {
                                    'quantity': '$$order_items.quantity'
                                }, {
                                    'price': '$$order_items.price'
                                }, {
                                    '$arrayElemAt': [
                                        '$$order_items.product_details', 0
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    ])
    return getOrderDetails
}

exports.removeOrders = async (id) => {
    var getOrderItemResult = await orderItemsSchema.aggregate([{
        $match: { product_id: new Types.ObjectId(id) }
    }])
    if (getOrderItemResult.length != 0) {
        var getOrderDetails = await orderSchema.findOne({ _id: getOrderItemResult[0]['order_id'] })
        if (getOrderDetails) {
            await orderSchema.updateOne({ _id: new Types.ObjectId(getOrderDetails['_id']) },
                {
                    $set:
                    {
                        total_amount: getOrderDetails['total_amount'] - getOrderItemResult[0]['price'],
                        total_discount: getOrderDetails['total_discount'] - getOrderItemResult[0]['discount'],
                        over_all_amount: getOrderDetails['over_all_amount'] - (getOrderItemResult[0]['price'] - getOrderItemResult[0]['discount']),
                    }
                })
        }
        await orderItemsSchema.deleteOne({ product_id: new Types.ObjectId(id) })
        return getOrderItemResult
    } else {
        return ""
    }

}