const User = require('../models/user');


exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuth: req.session.isLoggedIn,
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

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.error(err);
    res.redirect('/');
  });
};
