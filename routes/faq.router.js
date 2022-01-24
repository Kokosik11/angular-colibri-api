const express = require('express');
const Router = express.Router();
const Controller = require('../controllers/faq.controller');

const middleware = require('./middleware/auth');

Router.post('/create', middleware.auth, Controller.create);
Router.get('/', Controller.getAll);

module.exports = Router;