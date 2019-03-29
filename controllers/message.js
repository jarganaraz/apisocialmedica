'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');
var Chat = require('../models/chat');
var MedicoxInsti = require('../models/medicoxinstitucion');

function probando(req, res){
	//res.status(200).send({message: 'Hola que tal desde los mensajes privados'});
}

function saveMessage(req, res){

	var params = req.body;

	if(!params.text || !params.receiver) return res.status(200).send({message: 'Envia los datos necesarios'});
	//viejo
	//var message = new Message();
	//message.emitter = req.user.sub;
	//message.receiver = params.receiver;
	//message.text = params.text;
	//message.created_at = moment().toDate();
	//message.viewed = 'false';

	var message = new Message();
	message.text = params.text;
	message.viewed = 'false';
	message.created_at = moment().toDate();
	message.emitter=req.user.sub;
	message.receiver=params.receiver;
	//message.chat= este es el que me falta

	var chat = new Chat();
	chat.emitter = req.user.sub;
	chat.receiver = params.receiver;
	chat.lastmsg = params.text;
	chat.lastmsgdate = moment().toDate();


	Chat.findOneAndUpdate({$or: [
		{emitter : req.user.sub, receiver: params.receiver  },
		{receiver : req.user.sub, emitter: params.receiver },
	]},
		{emitter : req.user.sub, receiver: params.receiver,lastmsg:params.text,lastmsgdate:moment().toDate(),lastactive:req.user.sub},{upsert:true,new:true},(err,chat)=>{

		if(err) return res.status(500).send({message:"Error al buscar chat"});

		if(chat){
			message.chat=chat._id;
			

			message.save((err, messageStored) => {
				if(err) return res.status(500).send({message: 'Error en la petición'});
				if(!messageStored) return res.status(500).send({message: 'Error al enviar el mensaje'});
		
				return res.status(200).send({message: "El mensaje se envio correctamente"});
			})
		}

		

	})



	//viejo
	/*message.save((err, messageStored) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});
		if(!messageStored) return res.status(500).send({message: 'Error al enviar el mensaje'});

		return res.status(200).send({message: "El mensaje se envio correctamente"});
	});*/
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

	Message.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {"multi":true}, (err, messagesUpdated) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

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

	var userId = req.user.sub;
	var params = req.body;


	Message.find({
		$or:[
			{emitter:userId, receiver:params.receiver},
			{emitter:params.receiver, receiver:userId}	
		]
	}).
	populate('receiver emitter' , 'name surname').
	sort({created_at:'asc'}).
	exec(function (err, messages) {
		if (err) return res.status(500).send(err);
		
		if (messages){
			setViewedMessages(userId);
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

		Message.find({emitter: {"$in": messages_clean},receiver:userId}).sort('-created_at').populate('emitter', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messagesrta, total) => {
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
		messages_clean.push(req.user.sub);

		Message.find({emitter: {"$nin": messages_clean},receiver:userId}).sort('-created_at').populate('emitter', 'name surname image nick _id').paginate(page, itemsPerPage, (err, messagesrta, total) => {
			if(err) return res.status(500).send({message: 'Error devolver mensajes',error : err});

			if(!messagesrta) return res.status(404).send({message: 'No hay mensajes'});

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


function getchats(req,res){

	/*Chat.find({$or: [
		{emitter : req.user.sub},
		{receiver : req.user.sub},
	]},(err,chats)=>{

		if(err) return res.status(500).send({message:"Error al buscar chats"});

		if(chats){
			console.log(chats);
			return res.status(200).send(chats)
			
		}
	})*/

	Chat.find({$or: [
		{emitter : req.user.sub},
		{receiver : req.user.sub},
	]}).sort('lastmsgdate').populate('emitter').populate('receiver').exec((err,chats)=>{

		if(err) return res.status(500).send({message:"Error al buscar chats"});

		if(chats){

			return res.status(200).send(chats)
			
		}
	})

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
	getmessagessoli,
	getchats
};