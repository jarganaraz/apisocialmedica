'use strict'

var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var request = require('request');

var User = require('../models/user');
var Follow = require('../models/follow');
var MedicoxInsti = require('../models/medicoxinstitucion');
var Publication = require('../models/publication');
var jwt = require('../services/jwt');

var nodemailer = require('nodemailer');

var path1 = "http://192.168.2.192/socialmedica2.0/views";
var pathrecupass= "http://192.168.2.192:3800/api/activate-user/";
var crearmedicodicom = "http://192.168.2.192:8300/medico/addmedico";
var crearinstidicom ="http://192.168.2.192:8300/institucion/addinsti";

var util = require('util')


//const webpush = require('web-push');

// Métodos de prueba
function home(req, res){



}

function pruebas(req, res){
	//console.log(req.body);
	res.status(200).send({
		message: 'Acción de pruebas en el servidor de NodeJS'
	});
}

// Registro
function saveUser(req, res){
	var params = req.body;
	var user = new User();


		
	if(params.name && params.email && params.password){

		if(params.name)
		user.name= params.name.toUpperCase();
		if(params.surname)
		user.surname= params.surname.toUpperCase();
		user.email= params.email;
		user.password= params.password;
		user.role= params.role;
		user.image= 'null';
		user.activo= params.activo;
		user.telefono= params.telefono;
		if(params.domicilio)
		user.domicilio= params.domicilio.toUpperCase();
		if(params.pais)
		user.pais= params.pais.toUpperCase();
		user.studytipe= params.studytipe;
		user.perfil= params.perfil;
		user.curriculum= params.curriculum;
		user.doccurriculu= 'null';
		if(params.contact)
		user.contact= params.contact.toUpperCase();
		if(params.tporespuesta)
		user.tporespuesta= params.tporespuesta.toUpperCase();
		if(params.formadepago)
		user.formadepago= params.formadepago.toUpperCase();
		if(params.contacto)
		user.contacto= params.contacto.toUpperCase();
		user.activo = 'false';
		user.primera = 1;

		// Controlar usuarios duplicados
		User.find({ $or: [
				 {email: user.email.toLowerCase()}
		 ]}).exec((err, users) => {
		 	if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

		 	if(users && users.length >= 1){
		 		return res.status(200).send({message: 'El usuario que intentas registrar ya existe!!'});
		 	}else{

		 		// Cifra la password y me guarda los datos 
				bcrypt.hash(params.password, null, null, (err, hash) => {
					user.password = hash;

					user.save((err, userStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

						if(userStored){



							if(params.role == "clinica"){
								var urldicomalta=crearinstidicom;
							}else{
								var urldicomalta=crearmedicodicom;
							}
							

							var options = {
								url: urldicomalta,
								method: 'PUT',
								form: {name: user.name, password: params.password ,email:params.email}
							}
	
							request(options, function (error, response, body) {

								console.log(response.statusCode)
								
								if (response && response.statusCode == "200") {
	



							var textomail = '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>  <title></title>  <!--[if !mso]><!-- -->  <meta http-equiv="X-UA-Compatible" content="IE=edge">  <!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style type="text/css">  #outlook a { padding: 0; }  .ReadMsgBody { width: 100%; }  .ExternalClass { width: 100%; }  .ExternalClass * { line-height:100%; }  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }  table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }  p { display: block; margin: 13px 0; }</style><!--[if !mso]><!--><style type="text/css">  @media only screen and (max-width:480px) {    @-ms-viewport { width:320px; }    @viewport { width:320px; }  }</style><!--<![endif]--><!--[if mso]><xml>  <o:OfficeDocumentSettings>    <o:AllowPNG/>    <o:PixelsPerInch>96</o:PixelsPerInch>  </o:OfficeDocumentSettings></xml><![endif]--><!--[if lte mso 11]><style type="text/css">  .outlook-group-fix {    width:100% !important;  }</style><![endif]--><!--[if !mso]><!-->    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">    <style type="text/css">        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);    </style>  <!--<![endif]--><style type="text/css">  @media only screen and (min-width:480px) {    .mj-column-per-100 { width:100%!important; }  }</style></head><body style="background: #FFFFFF;">    <div class="mj-container" style="background-color:#FFFFFF;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="width:600px;">        <tr>          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">      <![endif]--><div style="margin:0px auto;max-width:600px;background:#F9F9FF;"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#F9F9FF;" align="center" border="0"><tbody><tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:9px 0px 9px 0px;"><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0">        <tr>          <td style="vertical-align:top;width:600px;">      <![endif]--><div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" style="vertical-align:top;" width="100%" border="0"><tbody><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 0px 0px 0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:600px;"><a target="_blank"><img alt="" title="" height="auto" src="https://preview.ibb.co/hUmcSq/banner.jpg" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="600"></a></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:25px;"><p style="font-size:1px;margin:0px auto;border-top:1px solid #000;width:100%;"></p><!--[if mso | IE]><table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="font-size:1px;margin:0px auto;border-top:1px solid #000;width:100%;" width="600"><tr><td style="height:0;line-height:0;"> </td></tr></table><![endif]--></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:13px 13px 13px 13px;" align="left"><div style="cursor:auto;color:#4D4D4D;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;"><h1 style="font-family: &apos;Cabin&apos;, sans-serif; line-height: 100%;">Bienvenido a Social Medica</h1><p><span style="font-size:14px;"><span style="color:#3498db;">Para poder ingresar al sistema active su cuenta haciendo click en el boton</span></span></p></div></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 25px;padding-top:10px;padding-right:10px;"><p style="font-size:1px;margin:0px auto;border-top:1px solid #000;width:100%;"></p><!--[if mso | IE]><table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="font-size:1px;margin:0px auto;border-top:1px solid #000;width:100%;" width="600"><tr><td style="height:0;line-height:0;"> </td></tr></table><![endif]--></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:0px 0px 0px 0px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px;" align="center" border="0"><tbody><tr><td style="width:600px;"><a href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&amp;feature=youtu.be" target="_blank"><img alt="" title="" height="auto" src="https://i.vimeocdn.com/filter/overlay?src=http://img.youtube.com/vi/l6IJ5MKQYA8/0.jpg&amp;src=https://integrationstore-b0c3f53658fe7a75.microservice.createsend.com/files/9392B9D9-F380-42FC-9571-7E109B7A1C26/youtube-play-button-overlay.png" style="border:none;border-radius:0px;display:block;font-size:13px;outline:none;text-decoration:none;width:100%;height:auto;" width="600"></a></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:25px;"><p style="font-size:1px;margin:0px auto;border-top:1px solid #000;width:100%;"></p><!--[if mso | IE]><table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="font-size:1px;margin:0px auto;border-top:1px solid #000;width:100%;" width="600"><tr><td style="height:0;line-height:0;"> </td></tr></table><![endif]--></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:20px 20px 20px 20px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:0px solid #000;border-radius:24px;color:#fff;cursor:auto;padding:9px 26px;" align="center" valign="middle" bgcolor="#007bff"><a href="'+pathrecupass+userStored._id+'" style="text-decoration:none;background:#007bff;color:#fff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;text-transform:none;margin:0px;" target="_blank">Activar</a></td></tr></tbody></table></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 25px;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:25px;"><p style="font-size:1px;margin:0px auto;border-top:1px solid #000;width:100%;"></p><!--[if mso | IE]><table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" style="font-size:1px;margin:0px auto;border-top:1px solid #000;width:100%;" width="600"><tr><td style="height:0;line-height:0;"> </td></tr></table><![endif]--></td></tr><tr><td style="word-wrap:break-word;font-size:0px;padding:10px 10px 10px 10px;" align="center"><div><!--[if mso | IE]>      <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="undefined"><tr><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="center" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="vertical-align:middle;width:35px;height:35px;"><a href="https://www.facebook.com/PROFILE"><img alt="facebook" height="35" src="https://thumb.ibb.co/ngGxAA/facebook.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]>      </td><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="center" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="vertical-align:middle;width:35px;height:35px;"><a href="https://www.twitter.com/PROFILE"><img alt="twitter" height="35" src="https://image.ibb.co/hxP3YV/twitter.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]>      </td><td>      <![endif]--><table role="presentation" cellpadding="0" cellspacing="0" style="float:none;display:inline-table;" align="center" border="0"><tbody><tr><td style="padding:4px;vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" style="background:none;border-radius:3px;width:35px;" border="0"><tbody><tr><td style="vertical-align:middle;width:35px;height:35px;"><a href="https://plus.google.com/PROFILE"><img alt="google" height="35" src="https://image.ibb.co/mR4Rnq/google-plus.png" style="display:block;border-radius:3px;" width="35"></a></td></tr></tbody></table></td></tr></tbody></table><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></body></html>';
							var transporter = nodemailer.createTransport({
								host: 'smtpout.secureserver.net',
								pool : true,
								secure : true,
															
								auth: {
									type : 'AUTH LOGIN',
									user: 'jarganaraz@visualmedica.com',
									pass: 'ASDqwe123'
								}
							 });
							 
							 var mailOptions = {
								from: 'Jarganaraz@visualmedica.com',
								to: user.email,
								subject: 'Activación de cuenta de Social Medica',
								//text: 'Active su cuenta http://vmwebserver.visualmedica.com:3800/api/activate-user/'+userStored._id+' porfa'
								html: textomail
							 };
							 
															// verify connection configuration
								transporter.verify(function(error, success) {
									if (error) {
										console.log(error);
									} else {
										console.log('Server is ready to take our messages');
									}
								});
 

							 transporter.sendMail(mailOptions, function(error, info){
								if (error){
									console.log(error);
									//res.status(500).send(error);
								} else {
									console.log("Email sent");
									//res.status(200).send({body, user:userStored});
								}
							});


							if(user.role == "clinica"){
								var mailOpt = {
									from: 'Jarganaraz@visualmedica.com',
									//to: 'info@visualmedica.com , soporte@visualmedica.com',
									to:'jarganaraz@visualmedica.com',
									subject: 'Activación de cuenta de Social Medica',
									text: 'La institucion '+user.name+' se registro en Social Medica por favor ponerse en contacto con ella para coordinar la instalacion de un gateway al siguiente email : '+user.email+' o al siguiente telefono: '+user.telefono+'' 
									//html: textomail
								 };


								 transporter.sendMail(mailOpt, function(error, info){
									if (error){
										console.log(error);
										//res.status(500).send(error);
									} else {
										console.log("Email sent");
										//res.status(200).send({body, user:userStored});
									}
								});
							}

							
							res.status(200).send({user: userStored, message:'E-Mail de confirmacion enviado'});



								
								}else{
									console.log(error)
									//console.log(response)
									User.findByIdAndRemove(userStored._id,(err,ponse)=>{

										if (err) return res.status(500).send({mesage: "Ocurrio un error comuniquese con el soporte"});

										if(ponse) return res.status(400).send({message: "No se pudo crear la cuenta"});

										if(!ponse) return res.status(400).send({message: "No se creo el usuario"});
									})

	
								//return res.status(404).send({message:"Ocurrio un problema al agregar el medico comuniquese con el soporte"})
								
								}
							})	


		

						}else{
							res.status(404).send({message: 'No se ha registrado el usuario'});



						}

					});
				});

		 	}
		 });
		
	}else{
		res.status(200).send({
			message: 'Envia todos los campos necesarios!!'
		});
	}
}


// Login
function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	if(!params.email || params.email == "null" || !params.password || params.password == "null"){
		return res.status(400).send({message : "Ingrese todos los datos"});
	}

	User.findOne({email: email}, (err, user) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(user){
			bcrypt.compare(password, user.password, (err, check) => {
				if(check){
					if(user.activo){
						if(params.gettoken){
							//generar y devolver token
							return res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							//devolver datos de usuario
							user.password = undefined;
							return res.status(200).send({user});
						}
					}
					else{
						res.status(200).send({message:"el usuario no esta activo"});
					}
					
				}else{
					return res.status(404).send({message: 'El usuario no se ha podido identificar'});
					
				}
			});
		}else{
			console.log(err);
			return res.status(404).send({message: 'El usuario no se ha podido identificar!!'});
		}
	});
}

// Conseguir datos de un usuario
function getUser(req, res){
	var userId = req.params.id;

	User.findById(userId, (err, user) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!user) return res.status(404).send({message: 'El usuario no existe'});

		if(user) return res.status(200).send({user});

		/*MedicoxInsti.findOne({
			"medico": req.user.sub ,
			"institucion" : req.params.id
		}).exec((err,follow)=>{

			if (err) return res.status(200).send({user});

			if (follow) return res.status(200).send({user,following});

			if (!follow) return res.status(200).send({user});

		});*/

	});
}

function addDelMedico (req,res){

	var medicoId = req.body.id;
	var consulta = req.body.consulta;

	var instiId = req.user.sub;
	var instimail = req.user.email;



	var medicomail= req.body.email;


//console.log(medicoId);
//console.log(consulta);
//console.log(instiId);
//console.log(instimail);
//console.log(medicomail);
	

	
	var medicoxInsti = new MedicoxInsti();

	if(!medicoId || !instiId || medicoId == "null" || instiId == "null"){
		
		

		res.status(400).send({message : "faltan datos en la peticion"});

	}

	medicoxInsti.medico = medicoId;
	medicoxInsti.institucion = instiId;

	MedicoxInsti.findOne({"medico":medicoId, "institucion":instiId}).exec((err,relstored) =>{



		if (err) return res.status(500).send({message : "Ocurrio un problema"});

		if (relstored){

			if (consulta == 1) 
			{
				res.status(200).send({message : "eso fue una consulta", type:1});

			}
			else
			{			
				MedicoxInsti.findByIdAndRemove(relstored._id,(err,ponse)=>{

					console.log("borro");

					if (err) res.status(500).send({message : "Ocurrio un error"});

					if (ponse){
						console.log("entro para la dicom a borrar");
						


						var options = {
							url: 'http://localhost:8300/institucion/delmedicoinsti',
							method: 'POST',
							form: {'medicomail': medicomail, 'instimail': instimail}
						}

						// Start the request
						request(options, function (error, response, body) {
							if (!error && response.statusCode == 200) {

								console.log("bien a la dicom borrando");
								// Print out the response body
								//console.log(body)
							}else{

								console.log("error en la dicom borrando");
							//	console.log(error);
							//	console.log(response)

							return res.status(404).send({message:"Ocurrio un problema al agregar el medico comuniquese con el soporte"})
							
							}
						})	

						res.status(200).send({message : "El medico se borro correctamente", type: 1});
					}

					if (!ponse) res.status(404).send({message : "No se encontro una relacion"});

				});
			}

		}

		if (!relstored){

			//console.log("creo");

			if (consulta == 1){
				 res.status(200).send({message : "eso fue una consulta", type:0});
				}
			else{
				medicoxInsti.save((err,addmedicostored)=>{

					if (err) return res.status(500).send({message : "Error en la peticion"});

					if (!addDelMedico) res.status(404).send({message: "No se pudo añadir al medico"});

					if (addmedicostored) {
						//console.log(medicoxInsti)
						//console.log("entro para la dicom");



												// Configure the request
						var options = {
							url: 'http://localhost:8300/institucion/addmedicoinsti',
							method: 'POST',
							form: {'medicomail': medicomail, 'instimail': instimail}
						}

						// Start the request
						request(options, function (error, response, body) {
							if (!error && response.statusCode == 200) {

								//console.log("entro para la dicom");
								// Print out the response body
								//console.log(body)

								res.status(200).send({message : "Se agrego al medico", type : 0});
							}else{

								console.log("error en la dicom");

								//console.log(error);
								//console.log(response)

								return res.status(404).send({message:"Ocurrio un problema al agregar el medico comuniquese con el soporte"})
							
							}
						})					

						//return res.status(200).send({message : "El usuario se agrego correctamente", type: 0});
					}

				});
			}
		}

	});

}


async function followThisUser(identity_user_id, user_id){
	var following = await Follow.findOne({"user":identity_user_id, "followed":user_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	var followed = await Follow.findOne({"user":user_id, "followed":identity_user_id}).exec((err, follow) => {
			if(err) return handleError(err); 
			return follow;
		});

	return {
		following: following,
		followed: followed
	}
}

// Devolver un listado de usuarios paginado
function getUsers(req, res){
	var identity_user_id = req.user.sub;
	//console.log("hola");
	var array = [];
	

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	//console.log("hola")

	MedicoxInsti.find(
		{institucion : identity_user_id }
	,(err,resp)=>{
		


		if (resp){


			resp.forEach(resp => {
				array.push( resp.medico)
				//console.log(array)
			});	

			var itemsPerPage = 8;

			User.find(	
					
						{_id: {'$ne' :identity_user_id},
						_id: {'$nin' :array},
						role: 'usuario'}
				
				
			).sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
				if(err) return res.status(500).send({message: 'Error en la petición'});
		
				if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});
		
				followUserIds(identity_user_id).then((value) => {
					
		
				if(users) return res.status(200).send({
						users,
						users_following: value.following,
						users_follow_me: value.followed,
						total,
						pages: Math.ceil(total/itemsPerPage),
						actual : page
					});
				
				
				});
		
			});	

		}

		if(!resp) return res.status(400).send({message : "No se encontraron usuarios"});

		if(err) return res.status(500).send({message: "Ocurrio un error"});

	})
//console.log(array[0])

}

async function followUserIds(user_id){
	var following = await Follow.find({"user":user_id}).select({'_id':0, '__v':0, 'user':0}).exec((err, follows) => {
		return follows;
	});

	var followed = await Follow.find({"followed":user_id}).select({'_id':0, '__v':0, 'followed':0}).exec((err, follows) => {
		return follows;
	});

	// Procesar following ids
	var following_clean = [];

	following.forEach((follow) => {
		following_clean.push(follow.followed);
	});
	
	// Procesar followed ids
	var followed_clean = [];

	followed.forEach((follow) => {
		followed_clean.push(follow.user);
	});
	
	return {
		following: following_clean,
		followed: followed_clean
	}
}


function getCounters(req, res){
	var userId = req.user.sub;
	if(req.params.id){
		userId = req.params.id;
	}

	getCountFollow(userId).then((value) => {
		return res.status(200).send(value);
	});
}

async function getCountFollow(user_id){
	var following = await Follow.count({"user":user_id}).exec((err, count) => {
		if(err) return handleError(err);
		return count;
	});

	var followed = await Follow.count({"followed":user_id}).exec((err, count) => {
		if(err) return handleError(err);
		return count;
	});

	var publications = await Publication.count({"user":user_id}).exec((err, count) => {
		if(err) return handleError(err);
		return count;
	});

	return {
		following: following,
		followed: followed,
		publications: publications
	}
}

// Edición de datos de usuario
function updateUser(req, res){
	var userId = req.params.id;
	var userupdt = req.body;

	// borrar propiedad password
	delete userupdt.password;

	//console.log(update);

	if(userId != req.user.sub){
		return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
	}

	User.find({ $or: [
				 {_id: userId},
		 ]}).exec((err, users) => {
		 
		 	var user_isset = false;
		 	users.forEach((user) => {
		 		if(user && user._id != userId) user_isset = true;
		 	});

		 	if(user_isset) return res.status(404).send({message: 'Los datos ya están en uso'});
		 	
		 	User.findByIdAndUpdate(userId, userupdt, {new:true}, (err, userUpdated) => {
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({user: userUpdated,message : "La informacion se actualizo correctamente"});
			});

		 });

}

// Subir archivos de imagen/avatar de usuario
function uploadImage(req, res){
	var userId = req.params.id;

	//console.log(req);
	
		//console.log(req.files.image);

	if(req.files && req.files != "null" && req.files.image.path && req.files.image.path != "null"){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		if(ext_split[1] && ext_split[1] != "null")
		var file_ext = ext_split[1].toLowerCase();

		//console.log(req.files.image.originalFilename);


		if(userId != req.user.sub){
			return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
		}

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			 
			 // Actualizar documento de usuario logueado
			 User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) =>{
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				//return res.status(200).send({user: userUpdated});

				return res.status(200).send({message : "La imagen se modifico correctamente"});
			 });

		}else{
			return removeFilesOfUploads(res, file_path, 'Extensión no válida');
		}

	}else{
		return res.status(200).send({message: 'No se han subido imagenes'});
	}
}

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});
}

function borrarArchivo(file_path){
	fs.unlink(file_path, (err) => {
		return //res.status(200).send("ok");
	});
}

function getImageFile(req, res){
	var image_file = req.params.imageFile;
	var path_file = './uploads/users/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

function uploadCurriculum(req, res){
	var userId = req.params.id;
	


    if(userId != req.user.sub){
		if(req.files.curriculum.path)
		removeFilesOfUploads(res,req.files.curriculum.path,"no tienes permisos para modificar otro usuario");
		else
        res.status(500).send({message : 'no tienes permisos para modificar otro usuario'
    });

    }else{
	if(req.files && req.files.curriculum.path && req.files.curriculum.path != "null"){
		var file_path = req.files.curriculum.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
		if(file_ext == 'xls' || file_ext == 'pdf' || file_ext == 'docx' || file_ext == 'doc' || file_ext == 'txt'){

			User.findByIdAndUpdate(userId, {curriculumfile: file_name},{new : true}, (err, userUpdated) => {
				if(!userUpdated){
					borrarArchivo(file_path);
					res.status(404).send({message: 'No se ha podido actualizar el curriculum'});
					
				}else{
					res.status(200).send({curriculumfile: file_name, user: userUpdated});
				}
			});

		}else{
			borrarArchivo(file_path);
			res.status(200).send({message: 'Extensión del archivo no valida'});
		}
		
	}else{
		res.status(200).send({message: 'No has subido ningun archivo...'});
    }
}
}

function getCurriculumFile(req, res){
    var curriculumFile = req.params.curriculumFile;
	
	
	var path_file = './uploads/curriculums/'+curriculumFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe curriculum...'});
		}
	});
}


function activateAcc(req, res){
	var userId = req.params.id;
		 	
			 User.findByIdAndUpdate(userId, {activo: true},{new : true}, (err, userUpdated) => {
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el estado'});
				}else{
					//res.status(200).send({activo: true, user: userUpdated});
					res.redirect(path1);
				}

		 });

}

function changePrimera(req, res){
	var userId = req.params.id;
		 	
			 User.findByIdAndUpdate(userId, {primera: 0},{new : true}, (err, userUpdated) => {
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el estado'});
				}else{
					//res.status(200).send({activo: true, user: userUpdated});
					res.status(200).send({message: 'Se ha podido actualizar el estado'});
				}

		 });

}


function getUserData(req, res){

	User.findById(req.user.sub, (err, user) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!user) return res.status(404).send({message: 'El usuario no existe'});

		if(user) return  res.status(200).send(user);

	});
}



function getClinicas(req, res){
	var identity_user_id = req.user.sub;
	//console.log(identity_user_id);

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 3;

	User.find(			

				{_id: {'$ne' :identity_user_id},
				role: 'clinica'}

	).sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

		followUserIds(identity_user_id).then((value) => {
			

			return res.status(200).send({
				users,
				users_following: value.following,
				users_follow_me: value.followed,
				total,
				pages: Math.ceil(total/itemsPerPage),
				actual : page
			});
		
		});

	});	
}

function checkmail(req,res){

//console.log(req.body.email);

//console.log(req.body.type);

	if(req.body.email){
		var mail = req.body.email;
	}else{
		res.status(500).send({message: "Debe ingresar un email"});
	}

	User.find(
		{'email': mail}
	).exec((err, users) => {

	if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

	if(users && users.length >= 1){

		if(req.body.type && req.body.type == 1)
		return res.send('true')
		
		else
		return res.send('false');
		


	}else{

		if(req.body.type && req.body.type == 1)
		return res.send('false');
		else
		return res.send('true');
	}

})

}


function getMedicos(req, res){
	var identity_user_id = req.user.sub;


	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 8;

	MedicoxInsti.find(			

				{institucion: identity_user_id}

	).populate("medico").sort('_id').paginate(page, itemsPerPage, (err, users, total) => {

		//console.log(users);
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

		if (users) return res.status(200).send({
			users,
			total,
			pages: Math.ceil(total/itemsPerPage),
			actual : page});
		
		});


}

function getUsersFilter(req, res){
	var identity_user_id = req.user.sub;
	var filter;
	var rol;

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}
	if(req.body.filter && req.body.filter !="null"){
		filter = req.body.filter;
	}
	if(req.body.role && req.body.role != "null")
		rol = req.body.role;

	var itemsPerPage = 8;





	User.find(
	{
		$and:[
			{role : {"$ne" : rol}},	
	 {$or: [
			{name :  {$regex: ".*" + filter + ".*", $options : "i"}},
			{surname :  {$regex: ".*" + filter + ".*", $options : "i"}},
			{studytipe :  {$regex: ".*" + filter + ".*", $options : "i"}},
		]}
			
	]
},).sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

			return res.status(200).send({
				users,
				total,
				pages: Math.ceil(total/itemsPerPage),
				actual : page
		
		
		});

	});	
}


function getMedicosFilter(req, res){
	var identity_user_id = req.user.sub;
	var filter;

	
	//console.log(identity_user_id);

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	if(req.body.filter && req.body.filter !="null"){
		filter = req.body.filter;
	}

	var itemsPerPage = 8;

	//console.log(filter);


	MedicoxInsti.find(
		{
		$and:[
				{institucion : identity_user_id},	
		/*{$or: [
				{name :  {$regex: ".*" + filter + ".*", $options : "i"}},
				{surname :  {$regex: ".*" + filter + ".*", $options : "i"}},
				{studytipe :  {$regex: ".*" + filter + ".*", $options : "i"}},
		]}*/
				
		]
	},).populate("medico").sort('_id').paginate(page, itemsPerPage, (err, users, total) => {

		//console.log(users);
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

		if (users) return res.status(200).send({users,total,
			pages: Math.ceil(total/itemsPerPage),
			actual : page});
		
		});


}


function solicambiarcontrasenia(req,res){

	var hashlink;

	if(req.body.email && req.body.email != "null"){

	bcrypt.hash(req.body.email, null, null, (err, hash) => {
		hashlink = hash;
		
	
//invocar viewer para comabio de contraseña (dicom)
//generar link de cambio de contraseña


var transporter = nodemailer.createTransport({

	host: 'smtpout.secureserver.net',
	pool : true,
	secure : true,
								
	auth: {
		type : 'AUTH LOGIN',
		user: 'jarganaraz@visualmedica.com',
		pass: 'ASDqwe123'
	}
 });
 
 var mailOptions = {
	from: 'Jarganaraz@visualmedica.com',
	to: req.body.email,
	subject: 'Cambio de contraseña Social Medica',
	text: 'Cambie su contraseña desde <a href="'+path1+'/cambiocontraseña.html?token='+hashlink+'&email='+req.body.email+'">Aqui</a>',

							
	//html: textomail
 };
 
								// verify connection configuration
	transporter.verify(function(error, success) {
		if (error) {
			console.log(error);
			return res.status(500).send({message: "ocurrio un problema conectando al servicio de email"});
		} else {
			console.log('Server is ready to take our messages');
		}
	});


 transporter.sendMail(mailOptions, function(error, info){
	if (error){
		console.log(error);
		res.status(500).send(error);
	} else {
		console.log("Email sent");
		return res.status(200).send({message: "Email de recuperacion enviado"});
	}
});

if(err)  return res.status(500).send({messsage: "ocurrio un problema durante la generacion del id"});

});

}else{
	return res.status(500).send({message : "Por favor envie todos los datos"})
}

}


function cambiarcontrasenia(req, res){

	var email = req.body.email;
	var hash = req.body.hash;
	var hashedpassword;
	var password = req.body.password;

	console.log(email)
	console.log(hash)
	console.log(password)

	//find el user con este email
	//adentro hacerle un bcrypt al mail
	//si son iguales updateo la password

	if(email && email != "null" && hash && hash !="null" && password && password != "null"){

	User.findOne({email: email}, (err, user) => {

		if(err)  return res.status(404).send({message: "no se encontro el usuario"})

		if(user){
			bcrypt.compare(user.email,hash,(err,check)=>{
				if(check){
					bcrypt.hash(password, null, null, (err, hash) => {
						if(hash){
							hashedpassword = hash;

							User.findByIdAndUpdate(user._id, {password:hashedpassword}, {new:true}, (err, userUpdated) => {

							if(userUpdated){
								return res.status(200).send({message: "Exito"});
							}else{
								return res.status(500).send({message:"ocurrio un problema"});
							}

						});
					}
						if(err)
						return res.status(500).send({message:"ocurrio un problema"});
					});
				}else{
					return res.status(500).send({message:"ocurrio un problema"})
				}
			})
		}
		if (!user) return res.status(400).send({message: "no existe el usuario"});
	})
}

else{
	return res.status(500).send({message : "Por favor envie todos los datos"})
}

}


function enviarMailContacto(req,res){
/*
	console.log("entro");
	console.log(req.body.email);
	console.log(req.body.name );
	console.log(req.body.message);
*/
	if(req.user && req.user != "null"){
	var userId = req.user.sub;

	if(req.body.email && req.body.email != "null" && req.body.name && req.body.name != "null" && req.body.message && req.body.message != "null" && req.body.telefono && req.body.telefono != "null"){
		 	
	User.findByIdAndUpdate(userId, {primera: 0},{new : true}, (err, userUpdated) => {
	   if(!userUpdated){
		   console.log("error updateando usuario");
		   res.status(404).send({message: 'No se ha podido actualizar el estado',err});
	   }else{

		var textomail = 'El usuario con el email '+ req.body.email +' de nombre '+ req.body.name +' y telefono '+req.body.telefono+' quiere comunicarse para solicitar instalacion de gateway con el siguiente  mensaje : " '+ req.body.message +'"';
				var transporter = nodemailer.createTransport({
					host: 'smtpout.secureserver.net',
					pool : true,
					secure : true,
												
					auth: {
						type : 'AUTH LOGIN',
						user: 'jarganaraz@visualmedica.com',
						pass: 'ASDqwe123'
					}
				 });
				 
				 var mailOptions = {
					from: req.body.email,
					to: 'jarganaraz@visualmedica.com',
					subject: 'Contacto',
					//text: 'Active su cuenta http://vmwebserver.visualmedica.com:3800/api/activate-user/'+userStored._id+' porfa'
					html: textomail
				 };
				 
												// verify connection configuration
					transporter.verify(function(error, success) {
						if (error) {
							console.log(error);
						} else {
							console.log('Server is ready to take our messages');
						}
					});

				 transporter.sendMail(mailOptions, function(error, info){
					if (error){
						//console.log(error);
						return res.status(500).send(error);
					} else {
						//console.log("Email sent");
						//return res.status(200).send({message : "El email se envio correctamente"});

						var textomail1 = '<html><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css" id="media-query"> body{margin: 0; padding: 0;}table, tr, td{vertical-align: top; border-collapse: collapse;}.ie-browser table, .mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important; text-decoration: none !important;}[owa] .img-container div, [owa] .img-container button{display: block !important;}[owa] .fullwidth button{width: 100% !important;}[owa] .block-grid .col{display: table-cell; float: none !important; vertical-align: top;}.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid{width: 660px !important;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4{width: 220px !important;}.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8{width: 440px !important;}.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col{width: 330px !important;}.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col{width: 220px !important;}.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col{width: 165px !important;}.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col{width: 132px !important;}.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col{width: 110px !important;}.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col{width: 94px !important;}.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col{width: 82px !important;}.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col{width: 73px !important;}.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col{width: 66px !important;}.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col{width: 60px !important;}.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col{width: 55px !important;}@media only screen and (min-width: 680px){.block-grid{width: 660px !important;}.block-grid .col{vertical-align: top;}.block-grid .col.num12{width: 660px !important;}.block-grid.mixed-two-up .col.num4{width: 220px !important;}.block-grid.mixed-two-up .col.num8{width: 440px !important;}.block-grid.two-up .col{width: 330px !important;}.block-grid.three-up .col{width: 220px !important;}.block-grid.four-up .col{width: 165px !important;}.block-grid.five-up .col{width: 132px !important;}.block-grid.six-up .col{width: 110px !important;}.block-grid.seven-up .col{width: 94px !important;}.block-grid.eight-up .col{width: 82px !important;}.block-grid.nine-up .col{width: 73px !important;}.block-grid.ten-up .col{width: 66px !important;}.block-grid.eleven-up .col{width: 60px !important;}.block-grid.twelve-up .col{width: 55px !important;}}@media (max-width: 680px){.block-grid, .col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.block-grid{width: calc(100% - 40px) !important;}.col{width: 100% !important;}.col > div{margin: 0 auto;}img.fullwidth, img.fullwidthOnMobile{max-width: 100% !important;}.no-stack .col{min-width: 0 !important; display: table-cell !important;}.no-stack.two-up .col{width: 50% !important;}.no-stack.mixed-two-up .col.num4{width: 33% !important;}.no-stack.mixed-two-up .col.num8{width: 66% !important;}.no-stack.three-up .col.num4{width: 33% !important;}.no-stack.four-up .col.num3{width: 25% !important;}.mobile_hide{min-height: 0px; max-height: 0px; max-width: 0px; display: none; overflow: hidden; font-size: 0px;}}</style></head><body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9FF"> <style type="text/css" id="media-query-bodytag"> @media (max-width: 520px){.block-grid{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col > div{margin: 0 auto;}img.fullwidth{max-width: 100%!important;}img.fullwidthOnMobile{max-width: 100%!important;}.no-stack .col{min-width: 0!important;display: table-cell!important;}.no-stack.two-up .col{width: 50%!important;}.no-stack.mixed-two-up .col.num4{width: 33%!important;}.no-stack.mixed-two-up .col.num8{width: 66%!important;}.no-stack.three-up .col.num4{width: 33%!important;}.no-stack.four-up .col.num3{width: 25%!important;}.mobile_hide{min-height: 0px!important; max-height: 0px!important; max-width: 0px!important; display: none!important; overflow: hidden!important; font-size: 0px!important;}}</style> <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9FF;width: 100%" cellpadding="0" cellspacing="0"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 660px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num12" style="min-width: 320px;max-width: 660px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i64.tinypic.com/r1ey2x.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 660px" width="660"></div><table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span></span> </td></tr></tbody> </table> </td></tr></tbody></table> </div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 660px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid two-up "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="min-width: 320px;max-width: 330px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 15px; line-height: 18px;"><strong>Gracias por comunicarse con el soporte de Visual Medica</strong></span></p></div></div></div><div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px">En el caso de ser necesario para brindarle soporte remoto por favor descargue Vm-Support desde <a style="color:#0068A5;text-decoration: underline;" href="http://visualmedica.com/uploads/products/VM_REMOTE_SUPPORT.exe" target="_blank" rel="noopener">Aqui</a></p></div></div></div><div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;" class=""> <div style="line-height:10px;font-size:1px">&#160;</div><div style="display: table; max-width:188px;"> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.facebook.com/visual.medica" title="Facebook" target="_blank"> <img src="http://i64.tinypic.com/np1bth.jpg" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://twitter.com/VisualMedica" title="Twitter" target="_blank"> <img src="http://i66.tinypic.com/25843o0.jpg" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://instagrhttps://www.instagram.com/visualmedicaint/?hl=enam.com/" title="Instagram" target="_blank"> <img src="http://i67.tinypic.com/of9jcg.jpg" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.youtube.com/channel/UCA_zdFrYw4Jgg-N1IOT2vuQ" title="YouTube" target="_blank"> <img src="http://i64.tinypic.com/jb5v81.jpg" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> </div></div></div></div></div><div class="col num6" style="min-width: 320px;max-width: 330px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i63.tinypic.com/e17z3m.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 330px" width="330"></div></div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 660px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num12" style="min-width: 320px;max-width: 660px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span></span> </td></tr></tbody> </table> </td></tr></tbody></table> <div style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><div class="video-block" style="width:100%;max-width:100%;min-width:320px"><a target="_blank" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&amp;feature=youtu.be" class="video-preview" style="background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;"><span><table cellpadding="0" cellspacing="0" border="0" width="100%" background="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;background-image: url(https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg);background-size: cover;min-height: 180px;min-width: 320px"><tbody><tr style="vertical-align: top"><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><img src="https://beefree.io/img-host/video_ratio_16-9.gif" alt="" width="100%" border="0" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;opacity: 0;visibility: hidden"></td><td width="50%" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: middle"><div class="play-button_outer" style="display: inline-block;vertical-align: middle;background-color: #FFFFFF;border: 3px solid #FFFFFF;height: 59px;width: 59px;border-radius: 100%;"><div style="padding: 14.75px 22.6923076923077px;"><div class="play-button_inner" style="border-style: solid;border-width: 15px 0 15px 20px;display: block;font-size: 0;height: 0;width: 0;border-color: transparent transparent transparent #000000;">&#160;</div></div></div></td><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">&#160;</td></tr></tbody></table></span></a></div></div></div></div></div></div></div></div></td></tr></tbody> </table> </body></html>';
						var transporter = nodemailer.createTransport({
							host: 'smtpout.secureserver.net',
							pool : true,
							secure : true,
														
							auth: {
								type : 'AUTH LOGIN',
								user: 'jarganaraz@visualmedica.com',
								pass: 'ASDqwe123'
							}
						 });
						 
						 var mailOptions = {
							from: "jarganaraz@visualmedica.com",
							to: req.body.email,
							subject: 'Contacto',
							//text: 'Active su cuenta http://vmwebserver.visualmedica.com:3800/api/activate-user/'+userStored._id+' porfa'
							html: textomail1
						 };
														// verify connection configuration
							transporter.verify(function(error, success) {
								if (error) {
									console.log(error);
								} else {
									console.log('Server is ready to take our messages');
								}
							});
		
						 transporter.sendMail(mailOptions, function(error, info){
							if (error){
								//console.log(error);
								return res.status(500).send(error);
							} else {
								//console.log("Email sent");
								return res.status(200).send({message : "El email se envio correctamente"});
							}
						});
						request.post(
							'http://www.yoursite.com/formpage',
							{ json: { key: 'value' } },
							function (error, response, body) {
								if (!error && response.statusCode == 200) {
									//console.log(body)
								}
							}
						);
					}
				});
				request.post(
					'http://www.yoursite.com/formpage',
					{ json: { key: 'value' } },
					function (error, response, body) {
						if (!error && response.statusCode == 200) {
							//console.log(body)
						}
					}
				);
	   }

});

}else{

	return res.status(500).send({message : " Por favor envie todos los datos"})
}

	}else{

		var textomail = 'El usuario con el email '+ req.body.email +' de nombre '+ req.body.name +' y telefono '+req.body.telefono+' quiere comunicarse para solicitar instalacion de gateway con el siguiente  mensaje : " '+ req.body.message +'"';
		var transporter = nodemailer.createTransport({
			host: 'smtpout.secureserver.net',
			pool : true,
			secure : true,
										
			auth: {
				type : 'AUTH LOGIN',
				user: 'jarganaraz@visualmedica.com',
				pass: 'ASDqwe123'
			}
		 });
		 
		 var mailOptions = {
			from: req.body.email,
			to: 'jarganaraz@visualmedica.com',
			subject: 'Contacto',
			//text: 'Active su cuenta http://vmwebserver.visualmedica.com:3800/api/activate-user/'+userStored._id+' porfa'
			html: textomail
		 };
										// verify connection configuration
			transporter.verify(function(error, success) {
				if (error) {
					console.log(error);
				} else {
					console.log('Server is ready to take our messages');
				}
			});

		 transporter.sendMail(mailOptions, function(error, info){
			if (error){
				//console.log(error);
				return res.status(500).send(error);
			} else {
				//console.log("Email sent");
				//return res.status(200).send({message : "El email se envio correctamente"});

				var textomail1 = '<html><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css" id="media-query"> body{margin: 0; padding: 0;}table, tr, td{vertical-align: top; border-collapse: collapse;}.ie-browser table, .mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important; text-decoration: none !important;}[owa] .img-container div, [owa] .img-container button{display: block !important;}[owa] .fullwidth button{width: 100% !important;}[owa] .block-grid .col{display: table-cell; float: none !important; vertical-align: top;}.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid{width: 660px !important;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4{width: 220px !important;}.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8{width: 440px !important;}.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col{width: 330px !important;}.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col{width: 220px !important;}.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col{width: 165px !important;}.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col{width: 132px !important;}.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col{width: 110px !important;}.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col{width: 94px !important;}.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col{width: 82px !important;}.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col{width: 73px !important;}.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col{width: 66px !important;}.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col{width: 60px !important;}.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col{width: 55px !important;}@media only screen and (min-width: 680px){.block-grid{width: 660px !important;}.block-grid .col{vertical-align: top;}.block-grid .col.num12{width: 660px !important;}.block-grid.mixed-two-up .col.num4{width: 220px !important;}.block-grid.mixed-two-up .col.num8{width: 440px !important;}.block-grid.two-up .col{width: 330px !important;}.block-grid.three-up .col{width: 220px !important;}.block-grid.four-up .col{width: 165px !important;}.block-grid.five-up .col{width: 132px !important;}.block-grid.six-up .col{width: 110px !important;}.block-grid.seven-up .col{width: 94px !important;}.block-grid.eight-up .col{width: 82px !important;}.block-grid.nine-up .col{width: 73px !important;}.block-grid.ten-up .col{width: 66px !important;}.block-grid.eleven-up .col{width: 60px !important;}.block-grid.twelve-up .col{width: 55px !important;}}@media (max-width: 680px){.block-grid, .col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.block-grid{width: calc(100% - 40px) !important;}.col{width: 100% !important;}.col > div{margin: 0 auto;}img.fullwidth, img.fullwidthOnMobile{max-width: 100% !important;}.no-stack .col{min-width: 0 !important; display: table-cell !important;}.no-stack.two-up .col{width: 50% !important;}.no-stack.mixed-two-up .col.num4{width: 33% !important;}.no-stack.mixed-two-up .col.num8{width: 66% !important;}.no-stack.three-up .col.num4{width: 33% !important;}.no-stack.four-up .col.num3{width: 25% !important;}.mobile_hide{min-height: 0px; max-height: 0px; max-width: 0px; display: none; overflow: hidden; font-size: 0px;}}</style></head><body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9FF"> <style type="text/css" id="media-query-bodytag"> @media (max-width: 520px){.block-grid{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col > div{margin: 0 auto;}img.fullwidth{max-width: 100%!important;}img.fullwidthOnMobile{max-width: 100%!important;}.no-stack .col{min-width: 0!important;display: table-cell!important;}.no-stack.two-up .col{width: 50%!important;}.no-stack.mixed-two-up .col.num4{width: 33%!important;}.no-stack.mixed-two-up .col.num8{width: 66%!important;}.no-stack.three-up .col.num4{width: 33%!important;}.no-stack.four-up .col.num3{width: 25%!important;}.mobile_hide{min-height: 0px!important; max-height: 0px!important; max-width: 0px!important; display: none!important; overflow: hidden!important; font-size: 0px!important;}}</style> <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9FF;width: 100%" cellpadding="0" cellspacing="0"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 660px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num12" style="min-width: 320px;max-width: 660px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i64.tinypic.com/r1ey2x.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 660px" width="660"></div><table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span></span> </td></tr></tbody> </table> </td></tr></tbody></table> </div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 660px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid two-up "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num6" style="min-width: 320px;max-width: 330px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 15px; line-height: 18px;"><strong>Gracias por comunicarse con el soporte de Visual Medica</strong></span></p></div></div></div><div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px">En el caso de ser necesario para brindarle soporte remoto por favor descargue Vm-Support desde <a style="color:#0068A5;text-decoration: underline;" href="http://visualmedica.com/uploads/products/VM_REMOTE_SUPPORT.exe" target="_blank" rel="noopener">Aqui</a></p></div></div></div><div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;" class=""> <div style="line-height:10px;font-size:1px">&#160;</div><div style="display: table; max-width:188px;"> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.facebook.com/visual.medica" title="Facebook" target="_blank"> <img src="http://i64.tinypic.com/np1bth.jpg" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://twitter.com/VisualMedica" title="Twitter" target="_blank"> <img src="http://i66.tinypic.com/25843o0.jpg" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://instagrhttps://www.instagram.com/visualmedicaint/?hl=enam.com/" title="Instagram" target="_blank"> <img src="http://i67.tinypic.com/of9jcg.jpg" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.youtube.com/channel/UCA_zdFrYw4Jgg-N1IOT2vuQ" title="YouTube" target="_blank"> <img src="http://i64.tinypic.com/jb5v81.jpg" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> </div></div></div></div></div><div class="col num6" style="min-width: 320px;max-width: 330px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i63.tinypic.com/e17z3m.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 330px" width="330"></div></div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 660px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;"> <div class="col num12" style="min-width: 320px;max-width: 660px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span></span> </td></tr></tbody> </table> </td></tr></tbody></table> <div style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><div class="video-block" style="width:100%;max-width:100%;min-width:320px"><a target="_blank" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&amp;feature=youtu.be" class="video-preview" style="background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;"><span><table cellpadding="0" cellspacing="0" border="0" width="100%" background="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;background-image: url(https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg);background-size: cover;min-height: 180px;min-width: 320px"><tbody><tr style="vertical-align: top"><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><img src="https://beefree.io/img-host/video_ratio_16-9.gif" alt="" width="100%" border="0" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;opacity: 0;visibility: hidden"></td><td width="50%" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: middle"><div class="play-button_outer" style="display: inline-block;vertical-align: middle;background-color: #FFFFFF;border: 3px solid #FFFFFF;height: 59px;width: 59px;border-radius: 100%;"><div style="padding: 14.75px 22.6923076923077px;"><div class="play-button_inner" style="border-style: solid;border-width: 15px 0 15px 20px;display: block;font-size: 0;height: 0;width: 0;border-color: transparent transparent transparent #000000;">&#160;</div></div></div></td><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">&#160;</td></tr></tbody></table></span></a></div></div></div></div></div></div></div></div></td></tr></tbody> </table> </body></html>'
				var transporter = nodemailer.createTransport({
					host: 'smtpout.secureserver.net',
					pool : true,
					secure : true,
												
					auth: {
						type : 'AUTH LOGIN',
						user: 'jarganaraz@visualmedica.com',
						pass: 'ASDqwe123'
					}
				 });
				 
				 var mailOptions = {
					from: "jarganaraz@visualmedica.com",
					to: req.body.email,
					subject: 'Contacto',
					//text: 'Active su cuenta http://vmwebserver.visualmedica.com:3800/api/activate-user/'+userStored._id+' porfa'
					html: textomail1
				 }; 
												// verify connection configuration
					transporter.verify(function(error, success) {
						if (error) {
							console.log(error);
						} else {
							console.log('Server is ready to take our messages');
						}
					});
 
				 transporter.sendMail(mailOptions, function(error, info){
					if (error){
						//console.log(error);
						return res.status(500).send(error);
					} else {
						//console.log("Email sent");
						return res.status(200).send({message : "El email se envio correctamente"});
					}
				});

				request.post(
					'http://www.yoursite.com/formpage',
					{ json: { key: 'value' } },
					function (error, response, body) {
						if (!error && response.statusCode == 200) {
							//console.log(body)
						}
					}
				);
			}
		});

		request.post(
			'http://www.yoursite.com/formpage',
			{ json: { key: 'value' } },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					//console.log(body)
				}
			}
		);
}

}

/*

	function subscribe(req,res){


	const subscription = req.body;
	res.status(201).json({});
	const payload = JSON.stringify({ title: 'test' });
  
	console.log(subscription);
  
	webpush.sendNotification(subscription, payload).catch(error => {
	  console.error(error.stack);
	});

}*/

  


function consultamedicoxinsti (req,res){

	var medicoId = req.body.medicoid;
	var instiId = req.body.instiid;



	
	var medicoxInsti = new MedicoxInsti();

	if(!medicoId || !instiId || medicoId == "null" || instiId == "null"){
		
		

	return	res.status(400).send({message : "faltan datos en la peticion"});

	}

	medicoxInsti.medico = medicoId;
	medicoxInsti.institucion = instiId;

	//console.log("intento")

	MedicoxInsti.findOne({"medico":medicoId, "institucion":instiId}).exec((err,relstored) =>{

		console.log(relstored);
		console.log(relstored);

		
		if (err) return res.status(500).send({message : "Ocurrio un problema",opcion:"no"});

		if (relstored ) {
			console.log("intento medico");
			return res.status(200).send({message: "Relacion Encontrada",opcion:"si"});

		}

		if (!relstored ){
			console.log("intento malo")
		 return res.status(200).send({message : "No se encontro relacion",opcion:"no"});
		}


	});

}





module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	getCounters,
	updateUser,
	uploadImage,
	getImageFile,
	uploadCurriculum,
	getCurriculumFile,
	activateAcc,
	getUserData,
	addDelMedico,
	getClinicas,
	changePrimera,
	checkmail,
	getMedicos,
	getUsersFilter,
	getMedicosFilter,
	solicambiarcontrasenia,
	cambiarcontrasenia,
	enviarMailContacto,
	//subscribe
	consultamedicoxinsti
}