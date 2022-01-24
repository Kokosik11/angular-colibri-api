const express = require('express');
const Router = express.Router();
const Controller = require('../controllers/project.controller');
const multer  = require("multer");
const path = require('path');

const middleware = require('./middleware/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "static/uploads/projects")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
  
const upload = multer({ storage });

Router.post('/create', middleware.auth, upload.single("project-img"), Controller.create);
Router.delete('/:id', middleware.auth, Controller.remove);
Router.patch('/:id', middleware.auth, upload.single("project-img"), Controller.getByIdAndUpdate);
Router.get('/:id', middleware.auth, Controller.getById);
Router.get('/', Controller.getAll);

module.exports = Router;