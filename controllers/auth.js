const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const User = require('../models/user');

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

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: req.flash('error'),
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.error(err);
      req.flash('error', err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email: req.body.email})
        .then((user) => {
          if (!user) {
            req.flash('error', 'Email is not found!');
            return res.redirect('/reset');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + (1 * 60 * 60 * 1000);
          return user.save();
        })
        .then((user) => {
          if (user) {
            res.redirect('/');
            return transporter.sendMail({
              to: req.body.email,
              from: process.env.SENGRIP_SENDER_MAIL,
              subject: 'Password reset',
              html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:${process.env.APP_PORT}/reset/${token}">link</a> to set a new password</p>
            `,
            });
          }
        })
        .catch((err) => console.error(err));
  });
};
