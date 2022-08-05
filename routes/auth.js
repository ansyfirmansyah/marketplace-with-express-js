/* eslint-disable new-cap */
const express = require('express');

const {check, body} = require('express-validator');

const routes = express.Router();

const authorizationController = require('../controllers/auth');
const User = require('../models/user');

const validatePassword = () => {
  return body(
      'password',
      'Password must be at least 8 chars and contain a number.')
      .trim()
      .isLength({min: 8})
      .matches(/\d/);
};

const validateConfirmPassword = () => {
  return body(
      'confirmPassword',
      'Confirm Password must equal with Password.')
      .trim()
      .custom((value, {req}) => {
        if (value !== req.body.password) {
          return false;
        }
        return true;
      });
};

const validateEmail = () => {
  return check(
      'email')
      .normalizeEmail()
      .isEmail()
      .withMessage('Invalid Email.');
};

const validateExistingEmail = () => {
  return check(
      'email')
      .normalizeEmail()
      .custom(async (value) => {
        const user = await User.findOne({
          email: value,
        });
        if (user) {
          return Promise.reject(
              new Error('Email already in use.'));
        }
      });
};

routes.get('/login', authorizationController.getLogin);
routes.get('/signup', authorizationController.getSignup);
routes.post('/login',
    validateEmail(),
    validatePassword(),
    authorizationController.postLogin);
routes.post('/signup',
    validateEmail(),
    validateExistingEmail(),
    validatePassword(),
    validateConfirmPassword(),
    authorizationController.postSignup);
routes.post('/logout', authorizationController.postLogout);
routes.get('/reset/:token', authorizationController.getNewPassword);
routes.get('/reset', authorizationController.getReset);
routes.post('/reset', authorizationController.postReset);
routes.post('/new-password', authorizationController.postNewPassword);

module.exports = routes;
