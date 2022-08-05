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
      .isLength({min: 8})
      .matches(/\d/);
};

const validateConfirmPassword = () => {
  return body(
      'confirmPassword',
      'Confirm Password must equal with Password.')
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
      .isEmail()
      .withMessage('Invalid Email.');
};

const validateExistingEmail = () => {
  return check(
      'email')
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
    validatePassword(),
    validateConfirmPassword(),
    validateExistingEmail(),
    authorizationController.postSignup);
routes.post('/logout', authorizationController.postLogout);
routes.get('/reset/:token', authorizationController.getNewPassword);
routes.get('/reset', authorizationController.getReset);
routes.post('/reset', authorizationController.postReset);
routes.post('/new-password', authorizationController.postNewPassword);

module.exports = routes;
