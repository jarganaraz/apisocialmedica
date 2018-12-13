'use strict'

var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/probando-md', md_auth.ensureAuth, MessageController.probando);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmmitMessages);
api.get('/unviewed-messages', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', md_auth.ensureAuth, MessageController.setViewedMessages);
api.post('/messagesperuser', md_auth.ensureAuth, MessageController.getMessagePerUser);
api.get('/getmessageshome', md_auth.ensureAuth, MessageController.getMessagesHome);
api.get('/medicmsg/:page?', md_auth.ensureAuth, MessageController.getmessagesmedic);
api.get('/solimsg/:page?', md_auth.ensureAuth, MessageController.getmessagessoli);


module.exports = api;