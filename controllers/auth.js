const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuth: req.session.isLoggedIn,
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuth: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: 'ansy',
            email: 'ansy@test.com',
            cart: {
              items: [],
            },
          });
          user.save()
              .then((user) => {
                req.session.user = user;
              });
        } else {
          req.session.user = user;
        }
        req.session.isLoggedIn = true;
        req.session.save((err) => {
          console.error(err);
          res.redirect('/');
        });
      });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  User.findOne({
    email: email,
  }).then((user) => {
    if (user) {
      return null;
    }
    return bcrypt.hash(password, 12).then((hashPassword) => {
      const newUser = new User({
        email: email,
        password: hashPassword,
        cart: {items: []},
      });
      return newUser.save();
    });
  }).then((data) => {
    if (!data) {
      res.redirect('/signup');
    } else {
      res.redirect('/login');
    }
  }).catch((err) => console.error(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.error(err);
    res.redirect('/');
  });
};
