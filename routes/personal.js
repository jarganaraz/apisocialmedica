'use strict'

var express = require('express');
var PersonalController = require('../controllers/personal');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_uploadcurriculum = multipart({ uploadDir: './uploads/curriculums' });
var md_uploadcurriculum = multipart({ uploadDir: './uploads/images' });

api.post('/uploadpersonal',md_auth.ensureAuth, PersonalController.saveInfo);
api.get('/getpersonal',md_auth.ensureAuth,PersonalController.getPersonal);
api.post('/updatepersonal1',md_auth.ensureAuth, PersonalController.updatePersonal);
api.post('/uploadcurriculum/:id', [md_auth.ensureAuth, md_uploadcurriculum], PersonalController.uploadCurriculum);
api.post('/uploadimage/:id', [md_auth.ensureAuth, md_uploadcurriculum], PersonalController.uploadImage);


module.exports = api;