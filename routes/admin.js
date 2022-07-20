const express = require('express');

// eslint-disable-next-line new-cap
const routes = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

routes.get('/add-product', isAuth, adminController.getAddProduct);
routes.post('/add-product', isAuth, adminController.postAddProduct);
routes.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
routes.post('/edit-product', isAuth, adminController.postEditProduct);
routes.post('/delete-product', isAuth, adminController.postDeleteProduct);
routes.get('/products', isAuth, adminController.getProducts);

module.exports = routes;
