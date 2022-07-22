const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY,
  },
}));

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: req.flash('error'),
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: req.flash('error'),
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    email: email,
  }).then((user) => {
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }
    return bcrypt.compare(password, user.password).then((valid) => {
      if (valid) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        return req.session.save((err) => {
          if (err) {
            console.error(err);
          }
          return res.redirect('/');
        });
      }
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }).catch((err) => {
      console.error(err);
      return null;
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
      req.flash('error', 'Email already in use.');
      res.redirect('/signup');
    } else {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: process.env.SENGRIP_SENDER_MAIL,
        subject: 'Signup succeeded',
        html: '<h1>You successfully signed up!</h1>',
      });
    }
  }).catch((err) => console.error(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
};
