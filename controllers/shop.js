/* eslint-disable max-len */
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
      .then((products) => {
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Product',
          path: '/products',
        });
      })
      .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId).then((product) => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
    });
  })
      .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
      .then((products) => {
        res.render('shop/index', {
          prods: products,
          pageTitle: 'Shop',
          path: '/',
        });
      })
      .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
          const cartProducts = [];
          for (product of rows) {
            const cartProductData = cart.products.find((prod) => prod.id === product.id);
            if (cartProductData) {
              cartProducts.push({productData: product, qty: cartProductData.qty});
            }
          }
          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: cartProducts,
          });
        })
        .catch((err) => console.error(err));
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};
