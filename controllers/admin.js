const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
      req.body.title,
      req.body.price,
      req.body.imageUrl,
      req.body.description,
      null,
      req.user._id,
  );
  product.save()
      .then(() => res.redirect('/'))
      .catch((err) => console.error(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.fetchById(prodId)
      .then((product) => {
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
        });
      }).catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const product = new Product(
      req.body.title,
      req.body.price,
      req.body.imageUrl,
      req.body.description,
      req.body.productId,
      req.user._id,
  );
  product.save()
      .then(() => {
        res.redirect('/admin/products');
      })
      .catch((err) => console.error(err));
};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteById(req.body.productId)
      .then(() => {
        res.redirect('/admin/products');
      })
      .catch((err) => console.error(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
      .then((products) => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Product',
          path: '/admin/products',
        });
      })
      .catch((err) => console.error(err));
};
