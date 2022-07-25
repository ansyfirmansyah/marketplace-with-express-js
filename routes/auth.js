/* eslint-disable new-cap */
const express = require('express');

const routes = express.Router();

const authorizationController = require('../controllers/auth');

routes.get('/login', authorizationController.getLogin);
routes.get('/signup', authorizationController.getSignup);
routes.post('/login', authorizationController.postLogin);
routes.post('/signup', authorizationController.postSignup);
routes.post('/logout', authorizationController.postLogout);
routes.get('/reset/:token', authorizationController.getNewPassword);
routes.get('/reset', authorizationController.getReset);
routes.post('/reset', authorizationController.postReset);
routes.post('/new-password', authorizationController.postNewPassword);

module.exports = routes;
