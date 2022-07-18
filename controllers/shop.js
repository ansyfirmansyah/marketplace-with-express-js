/* eslint-disable max-len */
const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
      .then((products) => {
        res.render('shop/product-list', {
          prods: products,
          pageTitle: 'All Product',
          path: '/products',
          isAuth: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
      .then((product) => {
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products',
          isAuth: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
      .then((products) => {
        res.render('shop/index', {
          prods: products,
          pageTitle: 'Shop',
          path: '/',
          isAuth: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
      .then((user) => {
        res.render('shop/cart', {
          pageTitle: 'Your Cart',
          path: '/cart',
          products: user.cart.items,
          isAuth: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.error(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
      .then((product) => {
        return req.user.addToCart(product);
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch((err) => console.error(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
      .then(() => {
        res.redirect('/cart');
      })
      .catch((err) => console.error(err));
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    isAuth: req.session.isLoggedIn,
  });
};

exports.postOrder = (req, res, next) => {
  req.user
      .populate('cart.items.productId')
      .then((user) => {
        const products = user.cart.items.map((i) => {
          return {
            product: {...i.productId._doc},
            quantity: i.quantity,
          };
        });
        const order = new Order({
          products: products,
          user: {
            userId: req.user,
            name: req.user.name,
          },
        });
        return order.save();
      })
      .then(() => {
        req.user.cart.items = [];
        req.user.save();
      })
      .then(() => {
        res.redirect('/orders');
      })
      .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
      .then((orders) => {
        res.render('shop/orders', {
          pageTitle: 'Your Orders',
          path: '/orders',
          orders: orders,
          isAuth: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.error(err));
};
