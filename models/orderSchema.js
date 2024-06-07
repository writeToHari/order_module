const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },

    order_date: {
        type: Date, default: Date.now
    },

    total_amount: {
        type: Number,
        default: null
    },

    total_discount: {
        type: Number,
        default: null
    },

    over_all_amount: {
        type: Number,
        default: null
    },

    status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled", "placed"]
    },

    shipping_address: {
        type: String,
        default: null
    }

}, {
    timestamps: true,
});


var productModel = mongoose.model('orders', orderSchema);
module.exports = productModel