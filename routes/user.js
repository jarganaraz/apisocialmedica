'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
var md_uploadcurriculum = multipart({ uploadDir: './uploads/curriculums' });



api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.get('/counters/:id?', md_auth.ensureAuth, UserController.getCounters);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
api.post('/upload-curriculum-user/:id', [md_auth.ensureAuth, md_uploadcurriculum], UserController.uploadCurriculum);
api.get('/get-curriculum-user/:curriculumFile', UserController.getCurriculumFile);
api.get('/activate-user/:id', UserController.activateAcc);
api.get('/userdata', md_auth.ensureAuth, UserController.getUserData);
api.post('/adddelmedico', md_auth.ensureAuth, UserController.addDelMedico);
api.get('/clinicas/:page?', md_auth.ensureAuth, UserController.getClinicas);
api.get('/activateclinica/:id', UserController.changePrimera);
api.post('/checkmail', UserController.checkmail);
api.get('/medicos/:page?', md_auth.ensureAuth, UserController.getMedicos);
api.post('/usersfilter/:page?', md_auth.ensureAuth, UserController.getUsersFilter);
api.post('/medicosfilter/:page?', md_auth.ensureAuth, UserController.getMedicosFilter);
api.post('/solicitarcambiocontrasenia/', UserController.solicambiarcontrasenia);
api.post('/cambiarcontrasenia/', UserController.cambiarcontrasenia);
api.post('/enviarmailcontacto/', UserController.enviarMailContacto);
api.post('/consultamedicoxinsti/', md_auth.ensureAuth, UserController.consultamedicoxinsti);
api.get('/desactivarcuenta/:id',md_auth.ensureAuth , UserController.deactivateAcc)
//api.post('/subscribe', UserController.subscribe);


module.exports = api;