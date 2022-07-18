/* eslint-disable new-cap */
const express = require('express');

const routes = express.Router();

const authorizationController = require('../controllers/auth');

routes.get('/login', authorizationController.getLogin);
routes.post('/login', authorizationController.postLogin);
routes.post('/logout', authorizationController.postLogout);

module.exports = routes;
