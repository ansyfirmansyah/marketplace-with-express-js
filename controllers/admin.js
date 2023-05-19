const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage: [],
    oldInput: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
        editing: false,
        errorMessage: errors.array(),
        oldInput: req.body,
        validationErrors: errors.array(),
      });
  }
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    userId: req.user,
  });
  product.save()
    .then(() => res.redirect('/admin/products'))
    .catch((err) => {
      console.error(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: [],
        oldInput: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.error(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const errors = validationResult(req);
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      if (!errors.isEmpty()) {
        return res.status(422)
          .render('admin/edit-product', {
            path: '/admin/edit-product',
            pageTitle: 'Edit Product',
            product: product,
            editing: 'true',
            errorMessage: errors.array(),
            oldInput: req.body,
            validationErrors: errors.array(),
          });
      }
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = req.body.title;
      product.price = req.body.price;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      return product.save()
        .then(() => {
          res.redirect('/admin/products');
        });
    })
    .catch((err) => {
      console.error(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteOne({
    _id: req.body.productId,
    userId: req.user._id,
  })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.error(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({
    userId: req.user._id,
  })
    // .select('title') // jika ingin select field tertentu
    // .select('-title') // jika ingin select tanpa field tertentu
    // .populate('userId') // jika ingin relasi object terkait muncul
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Product',
        path: '/admin/products',
      });
    })
    .catch((err) => {
      console.error(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
