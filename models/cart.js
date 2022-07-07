/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json',
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = {};
      if (err || fileContent == '') {
        cart = {products: [], totalPrice: 0};
      } else {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = {...existingProduct};
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {id: id, qty: 1};
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.error(err);
        };
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const cart = JSON.parse(fileContent);
      const updatedCart = [...cart];
      const product = updatedCart.products.find((prod) => prod.id === id);
      const productQty = product.qty;
      updatedCart.product = updatedCart.product.filter((prod) => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.error(err);
        };
      });
    });
  }
};
