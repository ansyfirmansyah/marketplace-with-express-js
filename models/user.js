/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function(product) {
  let updatedCartItems = [];
  let cartProductIndex = null;
  if (this.cart) {
    updatedCartItems = [...this.cart.items];
    cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
  }
  if (cartProductIndex != null && cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity = updatedCartItems[cartProductIndex].quantity + 1;
  } else {
    updatedCartItems.push({productId: product._id, quantity: 1});
  }
  this.cart = {items: updatedCartItems};
  return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter((i) => {
    return i._id.toString() != productId.toString();
  });
  this.cart = {items: updatedCartItems};
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
