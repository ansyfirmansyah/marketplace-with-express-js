/* eslint-disable max-len */
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  Product.fetchAll()
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
  Product.fetchById(prodId)
      .then((product) => {
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products',
        });
      })
      .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
  req.user.getCart()
      .then((products) => {
        res.render('shop/cart', {
          pageTitle: 'Your Cart',
          path: '/cart',
          products: products,
        });
      })
      .catch((err) => console.error(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.fetchById(productId)
      .then((product) => {
        req.user.addToCart(product);
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
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
      .then((cart) => {
        fetchedCart = cart;
        return cart.getProducts();
      })
      .then((products) => {
        return req.user.createOrder()
            .then((order) => {
              return order.addProducts(
                  products.map((product) => {
                    product.orderItem = {quantity: product.cartItem.quantity};
                    return product;
                  }),
              );
            })
            .catch((err) => console.error(err));
      })
      .then(() => {
        fetchedCart.setProducts(null);
      })
      .then(() => {
        res.redirect('/orders');
      })
      .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({
    include: ['products'],
  })
      .then((orders) => {
        res.render('shop/orders', {
          pageTitle: 'Your Orders',
          path: '/orders',
          orders: orders,
        });
      })
      .catch((err) => console.error(err));
};
