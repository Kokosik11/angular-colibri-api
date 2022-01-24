const express = require('express');
const Router = express.Router();
const Controller = require('../controllers/bid.controller');
const csrf = require('csurf');

Router.post('/create', csrf({ cookie: true, ignoreMethods: ['POST'] }), Controller.create);
Router.get('/csrftoken', csrf(), Controller.csrfToken);
Router.get('/', Controller.getAll);

module.exports = Router;