'use strict'

var express = require('express');
var PuntajeController = require('../controllers/puntaje');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');



api.post('/puntuar', md_auth.ensureAuth, PuntajeController.puntuar);
api.post('/getpuntaje', md_auth.ensureAuth, PuntajeController.getPuntaje);
api.post('/getpuntajes', PuntajeController.getPuntajes);


module.exports = api;