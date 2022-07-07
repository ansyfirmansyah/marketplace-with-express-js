const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  Product.create(
      {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        price: req.body.price,
      },
  )
      .then(() => res.redirect('/'))
      .catch((err) => console.error(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId).then((product) => {
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
  const id = req.body.productId;
  Product.findByPk(id)
      .then((product) => {
        product.title = req.body.title;
        product.imageUrl = req.body.imageUrl;
        product.description = req.body.description;
        product.price = req.body.price;
        return product.save();
      })
      .then(() => {
        res.redirect('/admin/products');
      })
      .catch((err) => console.error(err));
};

exports.postDeleteProduct = (req, res, next) => {
  Product.findByPk(req.body.productId)
      .then((product) => {
        return product.destroy();
      })
      .then(() => {
        res.redirect('/admin/products');
      })
      .catch((err) => console.error(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
      .then((products) => {
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Product',
          path: '/admin/products',
        });
      })
      .catch((err) => console.error(err));
};
