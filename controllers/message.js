'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');
var MedicoxInsti = require('../models/medicoxinstitucion');

function probando(req, res){
	res.status(200).send({message: 'Hola que tal desde los mensajes privados'});
}

function saveMessage(req, res){
	console.log('intentando guardar');
	var params = req.body;

	if(!params.text || !params.receiver) return res.status(200).send({message: 'Envia los datos necesarios'});

	var message = new Message();
	message.emitter = req.user.sub;
	message.receiver = params.receiver;
	message.text = params.text;
	message.created_at = moment().toDate();
	message.viewed = 'false';

	message.save((err, messageStored) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});
		if(!messageStored) return res.status(500).send({message: 'Error al enviar el mensaje'});

		return res.status(200).send({message: "El mensaje se envio correctamente"});
	});
}

function getReceivedMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 5;



	Message.find({receiver: userId}).populate('emitter', 'name surname image nick _id').sort({created_at:"desc"}).paginate(page, itemsPerPage, (err, messages, total)  => {
		if(err) return res.status(500).send({message: 'Error en la petición'});
		if(!messages) return res.status(404).send({message: 'No hay mensajes'});
	
		if(messages && messages != 'null'){


			setViewedMessages(userId);
//console.log(messages)

		return res.status(200).send({
			
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages
			
		});
	}
	});
}

function getEmmitMessages(req, res){
	var userId = req.user.sub;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	Message.find({emitter: userId}).populate('emitter receiver', 'name surname image nick _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});
		if(!messages) return res.status(404).send({message: 'No hay mensajes'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages
		});
	});
}

function getUnviewedMessages(req, res){
	var userId = req.user.sub;

	Message.count({receiver:userId, viewed:'false'}).exec((err, count) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});
		return res.status(200).send({
			'unviewed': count
		});
	});
}

function setViewedMessages(userId){
	//var userId = req.user.sub;

	Message.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {"multi":true}, (err, messagesUpdated) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});
		/*return res.status(200).send({
			messages: messagesUpdated
		});*/
	});
}


function getMessagesHome(req , res){

	var userId = req.user.sub;

	Message.find({receiver:userId, viewed:'false'}).exec((err, messages) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		return res.status(200).send(messages);
	});


}


function getMessagePerUser(req,res){
	//console.log('entro');
	//console.log(req.body);
	var userId = req.user.sub;
	var params = req.body;


	Message.find({
		$or:[
			{emitter:userId, receiver:params.receiver},
			{emitter:params.receiver, receiver:userId}	
		]
	}).
	populate('receiver emitter' , 'name surname').
	sort({created_at:'desc'}).
	exec(function (err, messages) {
		if (err) return res.status(500).send(err);
		
		if (messages){
//console.log(messages)
		 return res.status(200).send(messages);
	}
		if (!messages) return res.status(500).send({message:"No se encontraron mensajes"});
	  });

}

function getmessagesmedic(req,res){
	var userId = req.user.sub;


	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 7;

	MedicoxInsti.find({institucion: userId}).populate('medico', 'name surname image nick _id').exec((err, messages) => {
		if(err) return res.status(500).send({message: 'Error al devolver mensajes'});

		var messages_clean = [];

		messages.forEach((messages) => {
			messages_clean.push(messages.medico._id);
		});
		//messages_clean.push(req.user.sub);

		Message.find({emitter: {"$in": messages_clean}}).sort('-created_at').populate('emitter', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messagesrta, total) => {
			if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

			if(!messagesrta) return res.status(404).send({message: 'No hay publicaciones'});
			setViewedMessages(userId);
			return res.status(200).send({
				messages_clean,
				total_items: total,
				pages: Math.ceil(total/itemsPerPage),
				page: page,
				items_per_page: itemsPerPage,
				messagesrta
			});
		});





		/*Message.aggregate([
			{
				$lookup:{
					from: "users",
					localField : "emitter",
					foreignField : "_id",
					as : "users_docs"
				}
			},
			{
				$match:{
					emitter : {"$in": messages_clean}
				}
			},
			{
				$group:{
				 emiter : "$emitter"
				}
			},
			{
				$sort:{
					created_at:1
				}
			}
		], function (err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log(result)
			}
		});*/



	});
}

function getmessagessoli(req,res){
	var userId = req.user.sub;


	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 7;

	MedicoxInsti.find({institucion: userId}).populate('medico', 'name surname image nick _id').exec((err, messages) => {
		if(err) return res.status(500).send({message: 'Error al devolver mensajes'});

		var messages_clean = [];

		messages.forEach((messages) => {
			messages_clean.push(messages.medico._id);
		});
		//messages_clean.push(req.user.sub);

		Message.find({emitter: {"$nin": messages_clean}}).sort('-created_at').populate('emitter', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messagesrta, total) => {
			if(err) return res.status(500).send({message: 'Error devolver publicaciones',error : err});

			if(!messagesrta) return res.status(404).send({message: 'No hay publicaciones'});

			setViewedMessages(userId);
			return res.status(200).send({
				messages_clean,
				total_items: total,
				pages: Math.ceil(total/itemsPerPage),
				page: page,
				items_per_page: itemsPerPage,
				messagesrta
			});
		});

	});
}








module.exports = {
	probando,
	saveMessage,
	getReceivedMessages,
	getEmmitMessages,
	getUnviewedMessages,
	setViewedMessages,
	getMessagePerUser,
	getMessagesHome,
	getmessagesmedic,
	getmessagessoli
};