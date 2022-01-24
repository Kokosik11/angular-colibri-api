const express = require('express');
const Router = express.Router();
const Controller = require('../controllers/document.controller');
const multer  = require("multer");
const path = require('path');

const middleware = require('./middleware/auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "static/uploads/documents")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
  })
  
const upload = multer({ storage });
const multerFiles = upload.fields([{ name: 'document', maxCount: 1 }, { name: 'prev-screen', maxCount: 1 }, { name: 'document-icon', maxCount: 1 }]);

Router.post('/create', multerFiles, Controller.create);
Router.get('/', Controller.getAll);

module.exports = Router;