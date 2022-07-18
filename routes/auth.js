/* eslint-disable new-cap */
const express = require('express');

const routes = express.Router();

const authorizationController = require('../controllers/auth');

routes.get('/login', authorizationController.getLogin);

module.exports = routes;
