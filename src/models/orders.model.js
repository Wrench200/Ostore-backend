const { Schema, model } = require('mongoose')
const { BaseSchema, ROLES } = require("../../configs/app.config");
const { User } = require('./user.model')
const { Product } = require('./products.model')

const orders = {
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
        default: null
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "cart",
        required: true,
        default: null
    }],
    total: {
        type: Number,
        required: true,
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "complete"],
        required: true,
        default: null
    }
}


const Order = BaseSchema('orders', orders)
const Cart = BaseSchema('cart', cart)
module.exports = { Order, Cart }
