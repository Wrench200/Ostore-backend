const { BaseSchema } = require("../../configs/app.config");
const { Schema, model} = require("mongoose")
const  Product =require("./products.model")
const itemSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity can not be less then 1."],
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = model("item", itemSchema);

const cartSchema = 
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    items: [itemSchema],

    subTotal: {
      default: 0,
      type: Number,
    },
  }
;


const Cart = BaseSchema("cart", cartSchema);

module.exports = Cart;
