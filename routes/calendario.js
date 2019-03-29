'use strict'

var express = require('express');
var CalendController = require('../controllers/calendario');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');



/*
api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);*/


api.post('/agregarcalendario', md_auth.ensureAuth, CalendController.addcalendario);
api.get('/getcalendario', md_auth.ensureAuth, CalendController.getCalendario);


module.exports = api;