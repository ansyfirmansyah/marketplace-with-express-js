/* eslint-disable new-cap */
const express = require('express');

const routes = express.Router();

const authorizationController = require('../controllers/auth');

routes.get('/login', authorizationController.getLogin);
routes.get('/signup', authorizationController.getSignup);
routes.post('/login', authorizationController.postLogin);
routes.post('/signup', authorizationController.postSignup);
routes.post('/logout', authorizationController.postLogout);

module.exports = routes;
