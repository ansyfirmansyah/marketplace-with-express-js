const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
    // null,
    // req.user._id,
  });
  product.save()
      .then(() => res.redirect('/admin/products'))
      .catch((err) => console.error(err));
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
        });
      }).catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
      .then((product) => {
        product.title = req.body.title;
        product.price = req.body.price;
        product.imageUrl = req.body.imageUrl;
        product.description = req.body.description;
        return product.save();
      })
      .then(() => {
        res.redirect('/admin/products');
      })
      .catch((err) => console.error(err)); ;
};

exports.postDeleteProduct = (req, res, next) => {
  Product.findByIdAndRemove(req.body.productId)
      .then(() => {
        res.redirect('/admin/products');
      })
      .catch((err) => console.error(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
      .then((products) => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Product',
          path: '/admin/products',
        });
      })
      .catch((err) => console.error(err));
};
