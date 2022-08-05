const express = require('express');

// eslint-disable-next-line new-cap
const routes = express.Router();
const {body} = require('express-validator');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const validateTitle = () => {
  return body('title')
      .trim()
      .isLength({min: 1}).withMessage('Title is required.')
      .isAlphanumeric('en-US', {ignore: ' '})
      .withMessage('Title is must be an alphanumeric.');
};

const validateImageUrl = () => {
  return body('imageUrl')
      .trim()
      .isLength({min: 1}).withMessage('Image URL is required.')
      .isURL().withMessage('Image URL is not valid.');
};

const validatePrice = () => {
  return body('price')
      .trim()
      .isLength({min: 1}).withMessage('Price is required.')
      .isFloat({gt: 0.0}).withMessage('Price must be > 0.0');
};

const validateDescription = () => {
  return body('description')
      .trim()
      .isLength({min: 1}).withMessage('Description is required.');
};

routes.get('/add-product', isAuth, adminController.getAddProduct);
routes.post('/add-product',
    isAuth,
    validateTitle(),
    validateImageUrl(),
    validatePrice(),
    validateDescription(),
    adminController.postAddProduct);
routes.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
routes.post('/edit-product',
    isAuth,
    validateTitle(),
    validateImageUrl(),
    validatePrice(),
    validateDescription(),
    adminController.postEditProduct);
routes.post('/delete-product', isAuth, adminController.postDeleteProduct);
routes.get('/products', isAuth, adminController.getProducts);

module.exports = routes;
