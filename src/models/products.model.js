const { Schema } = require("mongoose");
const { BaseSchema } = require("../../configs/app.config");
const { users} = require("./user.model")
const productSchema = {

    pname:{ type: String, required:true},
    price: { type: Number, required:true},
    description:{ type: String, required:true},
    quantity: { type: Number, required:true},
  
    category: { type: String, enum: ['laptops', 'phones', 'headphones', 'smartwatches', 'consoles', 'accessories', ''], required: true },
    brand: { type: String, required: true },
    images: [{ type: String, required:true}],
    ratings: [{
        type:Schema.Types.ObjectId, ref: 'rating', required: false
    }]
}

const ratingSchema = {
    product: { type: Schema.Types.ObjectId, ref: "products", required:true},
    user: { type: Schema.Types.ObjectId, ref: "users", required:true},
    rating: { type: Number, required:true},
    comment: { type: String, required:true}
}
const Product = BaseSchema('products', productSchema)
const Rating = BaseSchema('rating', ratingSchema)
module.exports = Product