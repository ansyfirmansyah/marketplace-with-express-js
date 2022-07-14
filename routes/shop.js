const express = require('express');

// eslint-disable-next-line new-cap
const routes = express.Router();
const shopController = require('../controllers/shop');

routes.get('/', shopController.getIndex);
routes.get('/products', shopController.getProducts);
routes.get('/products/:productId', shopController.getProduct);
// routes.get('/cart', shopController.getCart);
// routes.post('/cart', shopController.postCart);
// routes.post('/cart-delete-item', shopController.postCartDeleteProduct);
// routes.post('/create-order', shopController.postOrder);
// routes.get('/orders', shopController.getOrders);
// routes.get('/checkout', shopController.getCheckout);

module.exports = routes;
