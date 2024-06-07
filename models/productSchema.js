const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_categories",
        default: null
    },
    price: {
        type: Number,
        default: null
    },
    discount_percentage: {
        type: Number,
        default: null
    },
    rating: {
        type: Number,
        default: null
    },
    stock: {
        type: Number,
        default: null
    },
    warranty_information: {
        type: String,
        default: ""
    },
    shipping_information: {
        type: String,
        default: ""
    },
    availablity_status: {
        type: String,
        default: ""
    },
    is_active: {
        type: Number,
        default: 1
    },
    is_deleted: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true,
});


var productModel = mongoose.model('products', productSchema);
module.exports = productModel