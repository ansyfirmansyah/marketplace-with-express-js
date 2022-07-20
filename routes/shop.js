const express = require('express');

// eslint-disable-next-line new-cap
const routes = express.Router();
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

routes.get('/', shopController.getIndex);
routes.get('/products', shopController.getProducts);
routes.get('/products/:productId', shopController.getProduct);
routes.get('/cart', isAuth, shopController.getCart);
routes.post('/cart', isAuth, shopController.postCart);
routes.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
routes.post('/create-order', isAuth, shopController.postOrder);
routes.get('/orders', isAuth, shopController.getOrders);
// routes.get('/checkout', shopController.getCheckout);

module.exports = routes;
