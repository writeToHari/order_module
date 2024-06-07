const mongoose = require('mongoose')

const orderItemSchema = mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        default: null
    },

    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        default: null
    },

    quantity: {
        type: Number,
        default: null
    },

    price: {
        type: Number,
        default: null
    },

    discount: {
        type: Number,
        default: null
    },

}, {
    timestamps: true,
});


var productModel = mongoose.model('orderItems', orderItemSchema);
module.exports = productModel