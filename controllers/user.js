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

var path1 = "http://socialmedica.visualmedica.com/views/";
var pathrecupass= "http://127.0.0.1:3800/api/activate-user/";
var crearmedicodicom = "http://127.0.0.1:8300/medico/addmedico";
var crearinstidicom ="http://127.0.0.1:8300/institucion/addinsti";
var updatepass ="http://127.0.0.1:8300/institucion/updatepassword";

var util = require('util')

//const webpush = require('web-push');

// Métodos de prueba
function home(req, res){

}

function pruebas(req, res){
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
		user.email= params.email.toUpperCase();
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
				 {email: user.email}
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
								form: {name: user.name, password: params.password.toUpperCase() ,email:params.email.toUpperCase()}
							}
	
							request(options, function (error, response, body) {

								console.log(response.statusCode)
								
								if (response && response.statusCode == "200") {
	
							var textomail = '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css" id="media-query"> body{margin: 0;padding: 0;}table, tr, td{vertical-align: top;border-collapse: collapse;}.ie-browser table, .mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important;text-decoration: none !important;}[owa] .img-container div, [owa] .img-container button{display: block !important;}[owa] .fullwidth button{width: 100% !important;}[owa] .block-grid .col{display: table-cell;float: none !important;vertical-align: top;}.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid{width: 860px !important;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4{width: 284px !important;}.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8{width: 568px !important;}.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col{width: 430px !important;}.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col{width: 286px !important;}.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col{width: 215px !important;}.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col{width: 172px !important;}.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col{width: 143px !important;}.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col{width: 122px !important;}.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col{width: 107px !important;}.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col{width: 95px !important;}.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col{width: 86px !important;}.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col{width: 78px !important;}.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col{width: 71px !important;}@media only screen and (min-width: 880px){.block-grid{width: 860px !important;}.block-grid .col{vertical-align: top;}.block-grid .col.num12{width: 860px !important;}.block-grid.mixed-two-up .col.num4{width: 284px !important;}.block-grid.mixed-two-up .col.num8{width: 568px !important;}.block-grid.two-up .col{width: 430px !important;}.block-grid.three-up .col{width: 286px !important;}.block-grid.four-up .col{width: 215px !important;}.block-grid.five-up .col{width: 172px !important;}.block-grid.six-up .col{width: 143px !important;}.block-grid.seven-up .col{width: 122px !important;}.block-grid.eight-up .col{width: 107px !important;}.block-grid.nine-up .col{width: 95px !important;}.block-grid.ten-up .col{width: 86px !important;}.block-grid.eleven-up .col{width: 78px !important;}.block-grid.twelve-up .col{width: 71px !important;}}@media (max-width: 880px){.block-grid, .col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.block-grid{width: calc(100% - 40px) !important;}.col{width: 100% !important;}.col > div{margin: 0 auto;}img.fullwidth, img.fullwidthOnMobile{max-width: 100% !important;}.no-stack .col{min-width: 0 !important; display: table-cell !important;}.no-stack.two-up .col{width: 50% !important;}.no-stack.mixed-two-up .col.num4{width: 33% !important;}.no-stack.mixed-two-up .col.num8{width: 66% !important;}.no-stack.three-up .col.num4{width: 33% !important;}.no-stack.four-up .col.num3{width: 25% !important;}.mobile_hide{min-height: 0px; max-height: 0px; max-width: 0px; display: none; overflow: hidden; font-size: 0px;}}</style></head><body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9FF"><style type="text/css" id="media-query-bodytag"> @media (max-width: 520px){.block-grid{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col > div{margin: 0 auto;}img.fullwidth{max-width: 100%!important;}img.fullwidthOnMobile{max-width: 100%!important;}.no-stack .col{min-width: 0!important; display: table-cell!important;}.no-stack.two-up .col{width: 50%!important;}.no-stack.mixed-two-up .col.num4{width: 33%!important;}.no-stack.mixed-two-up .col.num8{width: 66%!important;}.no-stack.three-up .col.num4{width: 33%!important;}.no-stack.four-up .col.num3{width: 25%!important;}.mobile_hide{min-height: 0px!important; max-height: 0px!important; max-width: 0px!important; display: none!important; overflow: hidden!important; font-size: 0px!important;}}</style><table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9FF;width: 100%" cellpadding="0" cellspacing="0"><tbody><tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"><a href="https://socialmedica.visualmedica.com" target="_blank"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i64.tinypic.com/r1ey2x.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 860px" width="860"></a></div><table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&nbsp;</span> </td></tr></tbody> </table> </td></tr></tbody></table> </div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid two-up "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"> <div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 18px; line-height: 21px; color: rgb(255, 255, 255);"><strong>Bienvenido a Social Médica</strong></span></p></div></div></div><div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"> <div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="color: rgb(255, 255, 255); font-size: 14px; line-height: 16px;">Gracias por registrarse en Social Médica, para activar su cuenta y poder contactarse con los mejores profesionales e instituciones por favor clickee el siguiente botón y siga las instrucciones.</span></p></div></div></div><div align="center" class="button-container center " style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;"> <a href="'+pathrecupass+userStored._id+'" target="_blank" style="display: block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #3AAEE0; background-color: #FFFFFF; border-radius: 14px; -webkit-border-radius: 14px; -moz-border-radius: 14px; max-width: 176px; width: 136px;width: auto; border-top: 1px solid #000000; border-right: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; padding-top: 5px; padding-right: 20px; padding-bottom: 5px; padding-left: 20px; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;mso-border-alt: none"> <span style="font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;font-size:16px;line-height:32px;"><strong>Activar Cuenta</strong></span> </a> </div><div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;" class=""><div style="line-height:10px;font-size:1px">&nbsp;</div><div style="display: table; max-width:188px;"> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.facebook.com/visual.medica" title="Facebook" target="_blank"> <img src="http://i64.tinypic.com/np1bth.jpg" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&nbsp;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://twitter.com/VisualMedica" title="Twitter" target="_blank"> <img src="http://i66.tinypic.com/25843o0.jpg" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&nbsp;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.instagram.com/visualmedicaint/?hl=en" title="Instagram" target="_blank"> <img src="http://i67.tinypic.com/of9jcg.jpg" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&nbsp;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.youtube.com/channel/UCA_zdFrYw4Jgg-N1IOT2vuQ" title="YouTube" target="_blank"> <img src="http://i64.tinypic.com/jb5v81.jpg" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&nbsp;</div></td></tr></tbody></table> </div></div></div></div></div><div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><!--[if (mso)|(IE)]><table width="430px" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td><![endif]--><div class="video-block" style="width:100%;max-width:100%;min-width:320px"><a target="_blank" href="https://www.youtube.com/watch?v=WE8GVLiPrsI" class="video-preview" style="background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;"><span><table cellpadding="0" cellspacing="0" border="0" width="100%" background="https://img.youtube.com/vi/WE8GVLiPrsI/maxresdefault.jpg" role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;background-image: url(https://img.youtube.com/vi/WE8GVLiPrsI/maxresdefault.jpg);background-size: cover;min-height: 180px;min-width: 320px"><tbody><tr style="vertical-align: top"><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><img src="https://beefree.io/img-host/video_ratio_16-9.gif" alt="" width="100%" border="0" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;opacity: 0;visibility: hidden"></td><td width="50%" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: middle"><div class="play-button_outer" style="display: inline-block;vertical-align: middle;border: 3px solid #FFFFFF;height: 59px;width: 59px;border-radius: 100%;"><div style="padding: 14.75px 22.6923076923077px;"><div class="play-button_inner" style="border-style: solid;border-width: 15px 0 15px 20px;display: block;font-size: 0;height: 0;width: 0;border-color: transparent transparent transparent #FFFFFF;">&nbsp;</div></div></div></td><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">&nbsp;</td></tr></tbody></table></span></a><!--[if vml]><v:group xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" coordsize="430,242" coordorigin="0,0" href="https://www.youtube.com/watch?v=WE8GVLiPrsI" style="width:430px;height:242px;"><v:rect fill="t" stroked="f" style="position:absolute;width:430px;height:242px;"><v:fill src="https://img.youtube.com/vi/WE8GVLiPrsI/maxresdefault.jpg" type="frame"/></v:rect><v:oval fill="t" strokecolor="#FFFFFF" strokeweight="3px" style="position:absolute;left:186px;top:92px;width:59px;height:59px"><v:fill color="black" opacity="0%"/></v:oval><v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#FFFFFF" stroked="f" style="position:absolute;left:206px;top:106px;width:21px;height:30px;"/></v:group><![endif]--></div></div></div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&nbsp;</span> </td></tr></tbody> </table> </td></tr></tbody></table> <div style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><!--[if (mso)|(IE)]><table width="860px" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td><![endif]--><div class="video-block" style="width:100%;max-width:100%;min-width:320px"><a target="_blank" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&amp;t=" class="video-preview" style="background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;"><span><table cellpadding="0" cellspacing="0" border="0" width="100%" background="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;background-image: url(https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg);background-size: cover;min-height: 180px;min-width: 320px"><tbody><tr style="vertical-align: top"><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><img src="https://beefree.io/img-host/video_ratio_16-9.gif" alt="" width="100%" border="0" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;opacity: 0;visibility: hidden"></td><td width="50%" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: middle"><div class="play-button_outer" style="display: inline-block;vertical-align: middle;background-color: #FFFFFF;border: 3px solid #FFFFFF;height: 59px;width: 59px;border-radius: 100%;"><div style="padding: 14.75px 22.6923076923077px;"><div class="play-button_inner" style="border-style: solid;border-width: 15px 0 15px 20px;display: block;font-size: 0;height: 0;width: 0;border-color: transparent transparent transparent #000000;">&nbsp;</div></div></div></td><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">&nbsp;</td></tr></tbody></table></span></a><!--[if vml]><v:group xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" coordsize="860,484" coordorigin="0,0" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&t=" style="width:860px;height:484px;"><v:rect fill="t" stroked="f" style="position:absolute;width:860px;height:484px;"><v:fill src="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" type="frame"/></v:rect><v:oval fill="t" strokecolor="#FFFFFF" strokeweight="3px" style="position:absolute;left:400px;top:212px;width:59px;height:59px"><v:fill color="#FFFFFF" opacity="100%"/></v:oval><v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#000000" stroked="f" style="position:absolute;left:422px;top:227px;width:21px;height:30px;"/></v:group><![endif]--></div></div></div></div></div></div></div></div></td></tr></tbody></table></body></html>';
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
						
								} else {
									console.log("Email sent");

								}
							});


							if(user.role == "clinica"){
								var mailOpt = {
									from: 'Jarganaraz@visualmedica.com',
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

	console.log("entro aca")
	var params = req.body;
	var email = params.email.toUpperCase();
	var password = params.password;

	console.log(email,password)

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
						enviomailactivacion(user._id,user.email);
						res.status(200).send({message:"El usuario no esta activo, por favor revise su email"});
					}
					
				}else{
					return res.status(404).send({message: 'Contraseña incorrecta'});
					
				}
			});
		}else{
			
			return res.status(404).send({message: 'El usuario no existe'});
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

	});
}

// Agregar borrar medico
function addDelMedico (req,res){
//todo verificar primero la dicom luego la mongo la dicom tiene mas probabilidades de fallar al insertar
	var medicoId = req.body.id;
	var consulta = req.body.consulta;
	var instiId = req.user.sub;
	var instimail = req.user.email;
	var medicomail= req.body.email;
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
							url: 'http://127.0.0.1:8300/institucion/delmedicoinsti',
							method: 'POST',
							form: {'medicomail': medicomail, 'instimail': instimail}
						}

						// Start the request
						request(options, function (error, response, body) {
							if (!error && response.statusCode == 200) {

								console.log("bien a la dicom borrando");

							}else{
								//todo si ocurre problema en la dicom volver a agregar el user y hacer redirect, guardar logs
								//con datos donde fallo y dar aviso
						
								console.log("error en la dicom borrando");

							return res.status(404).send({message:"Ocurrio un problema al agregar el medico comuniquese con el soporte3"})
							
							}
						})	

						res.status(200).send({message : "El medico se borro correctamente", type: 1});
					}

					if (!ponse) res.status(404).send({message : "No se encontro una relacion"});

				});
			}

		}

		if (!relstored){

			if (consulta == 1){
				 res.status(200).send({message : "eso fue una consulta", type:0});
				}
			else{
				medicoxInsti.save((err,addmedicostored)=>{

					if (err) return res.status(500).send({message : "Error en la peticion"});

					if (!addDelMedico) res.status(404).send({message: "No se pudo añadir al medico"});

					if (addmedicostored) {
												// Configure the request
						var options = {
							url: 'http://127.0.0.1:8300/institucion/addmedicoinsti',
							method: 'POST',
							form: {'medicomail': medicomail, 'instimail': instimail}
						}

						// Start the request
						request(options, function (error, response, body) {
							if (!error && response.statusCode == 200) {

								res.status(200).send({message : "Se agrego al medico", type : 0});
							}else{

								//todo si ocurre problema en la dicom volver a agregar el user y hacer redirect, guardar logs
								//con datos donde fallo y dar aviso

								console.log("error en la dicom");

								return res.status(404).send({message:"Ocurrio un problema al agregar el medico comuniquese con el soporte1"})
							
							}
						})					
					}

				});
			}
		}

	});

}

// Agregar follow *deprecated*
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
	var array = [];
	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}

	MedicoxInsti.find(
		{institucion : identity_user_id }
	,(err,resp)=>{
		
		if (resp){

			resp.forEach(resp => {
				array.push( resp.medico)
			});	

			var itemsPerPage = 4;
//todo solo mostrar usuarios activos
			User.find(	
					
						{_id: {'$ne' :identity_user_id},
						_id: {'$nin' :array},
						role: 'usuario',
						activo:'true'
					}
				
				
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


}

// Get follows *deprecated*
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

// Get stats *deprecated*
function getCounters(req, res){
	var userId = req.user.sub;
	if(req.params.id){
		userId = req.params.id;
	}

	getCountFollow(userId).then((value) => {
		return res.status(200).send(value);
	});
}

// get stats *deprecated*
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
	delete userupdt.password;//borrar para no updatear la pass que se setea en blanco en el objeto user

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

	if(req.files && req.files != "null" && req.files.image.path && req.files.image.path != "null"){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		if(ext_split[1] && ext_split[1] != "null")
		var file_ext = ext_split[1].toLowerCase();

		if(userId != req.user.sub){
			return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
		}

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			 
			 // Actualizar documento de usuario logueado
			 User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) =>{
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({message : "La imagen se modifico correctamente"});
			 });

		}else{
			return removeFilesOfUploads(res, file_path, 'Extensión no válida');
		}

	}else{
		return res.status(200).send({message: 'No se han subido imagenes'});
	}
}

// Borrar archivo subido 
function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});
}

// Borrar curriculum 
function borrarArchivo(file_path){
	fs.unlink(file_path, (err) => {
		return //res.status(200).send("ok");
	});
}

// Mostrar imagen
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

// Subir curriculum
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

// Mostrar curriculum
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

// Activar Cuenta
function activateAcc(req, res){
	var userId = req.params.id;

	console.log(userId);
		 	
			 User.findByIdAndUpdate(userId, {activo: true},{new : true}, (err, userUpdated) => {
				if(!userUpdated){
					console.log(err)
					res.status(404).send({message: 'No se ha podido actualizar el estado'});
				}else{
					//res.status(200).send({activo: true, user: userUpdated});
					res.redirect(path1);
				}

		 });

}

// Verificar primer ingreso
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

// Obtener datos usuario
function getUserData(req, res){

	User.findById(req.user.sub, (err, user) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!user) return res.status(404).send({message: 'El usuario no existe'});

		if(user) return  res.status(200).send(user);

	});
}

// Obtener clinicas
function getClinicas(req, res){

	var identity_user_id = req.user.sub;
	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	User.find(			

				{_id: {'$ne' :identity_user_id},
				role: 'clinica',
				activo:'true'}

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

// Verificar mail disponible
function checkmail(req,res){

	if(req.body.email){
		var mail = req.body.email;
		mail = mail.toUpperCase();
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

// Obtener medicos
function getMedicos(req, res){
	var identity_user_id = req.user.sub;
	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

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

//Obtener usuarios filtrado
function getUsersFilter(req, res){
	var identity_user_id = req.user.sub;
	var array = [];
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

	var itemsPerPage = 4;

	MedicoxInsti.find(
		{institucion : identity_user_id }
	,(err,resp)=>{

	if(err) return res.status(500).send({message:"Ocurrio un error en el servidor"});

	if(resp){

		resp.forEach(resp => {
			array.push( resp.medico)
	
		});	

		User.find(
			{
				$and:[
					{
						role : {"$ne" : rol},
						_id: {'$nin' :array},
						activo:'true'
					},	
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
	})

}

//Obtener medicos filtrado
function getMedicosFilter(req, res){
/*	var identity_user_id = req.user.sub;
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
		{$or: [
				{name :  {$regex: ".*" + filter + ".*", $options : "i"}},
				{surname :  {$regex: ".*" + filter + ".*", $options : "i"}},
				{studytipe :  {$regex: ".*" + filter + ".*", $options : "i"}},
		]}
				
		]
	},).populate("medico").sort('_id').paginate(page, itemsPerPage, (err, users, total) => {

		//console.log(users);
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

		if (users) return res.status(200).send({users,total,
			pages: Math.ceil(total/itemsPerPage),
			actual : page});
		
		});*/






	var identity_user_id = req.user.sub;
	var array = [];
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

	var itemsPerPage = 4;



	MedicoxInsti.find(
		{institucion : identity_user_id }
	,(err,resp)=>{

	if(err) return res.status(500).send({message:"Ocurrio un error en el servidor"});

	if(resp){

		resp.forEach(resp => {
			array.push( resp.medico)
	
		});	
		

		User.find(
			{
				$and:[
					{
						role : {"$ne" : rol},
						_id: {'$in' :array},
						activo:'true'
					},	
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
	})
}

//Crear web para cambio pass
function solicambiarcontrasenia(req,res){

	var hashlink;

	if(req.body.email && req.body.email != "null"){

	bcrypt.hash(req.body.email.toUpperCase(), null, null, (err, hash) => {
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
 
var htmlmsg = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css" id="media-query"> body{margin: 0; padding: 0;}table, tr, td{vertical-align: top; border-collapse: collapse;}.ie-browser table, .mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important; text-decoration: none !important;}[owa] .img-container div, [owa] .img-container button{display: block !important;}[owa] .fullwidth button{width: 100% !important;}[owa] .block-grid .col{display: table-cell; float: none !important; vertical-align: top;}.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid{width: 860px !important;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4{width: 284px !important;}.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8{width: 568px !important;}.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col{width: 430px !important;}.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col{width: 286px !important;}.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col{width: 215px !important;}.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col{width: 172px !important;}.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col{width: 143px !important;}.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col{width: 122px !important;}.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col{width: 107px !important;}.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col{width: 95px !important;}.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col{width: 86px !important;}.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col{width: 78px !important;}.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col{width: 71px !important;}@media only screen and (min-width: 880px){.block-grid{width: 860px !important;}.block-grid .col{vertical-align: top;}.block-grid .col.num12{width: 860px !important;}.block-grid.mixed-two-up .col.num4{width: 284px !important;}.block-grid.mixed-two-up .col.num8{width: 568px !important;}.block-grid.two-up .col{width: 430px !important;}.block-grid.three-up .col{width: 286px !important;}.block-grid.four-up .col{width: 215px !important;}.block-grid.five-up .col{width: 172px !important;}.block-grid.six-up .col{width: 143px !important;}.block-grid.seven-up .col{width: 122px !important;}.block-grid.eight-up .col{width: 107px !important;}.block-grid.nine-up .col{width: 95px !important;}.block-grid.ten-up .col{width: 86px !important;}.block-grid.eleven-up .col{width: 78px !important;}.block-grid.twelve-up .col{width: 71px !important;}}@media (max-width: 880px){.block-grid, .col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.block-grid{width: calc(100% - 40px) !important;}.col{width: 100% !important;}.col > div{margin: 0 auto;}img.fullwidth, img.fullwidthOnMobile{max-width: 100% !important;}.no-stack .col{min-width: 0 !important; display: table-cell !important;}.no-stack.two-up .col{width: 50% !important;}.no-stack.mixed-two-up .col.num4{width: 33% !important;}.no-stack.mixed-two-up .col.num8{width: 66% !important;}.no-stack.three-up .col.num4{width: 33% !important;}.no-stack.four-up .col.num3{width: 25% !important;}.mobile_hide{min-height: 0px; max-height: 0px; max-width: 0px; display: none; overflow: hidden; font-size: 0px;}}</style></head><body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9FF"> <style type="text/css" id="media-query-bodytag"> @media (max-width: 520px){.block-grid{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col > div{margin: 0 auto;}img.fullwidth{max-width: 100%!important;}img.fullwidthOnMobile{max-width: 100%!important;}.no-stack .col{min-width: 0!important;display: table-cell!important;}.no-stack.two-up .col{width: 50%!important;}.no-stack.mixed-two-up .col.num4{width: 33%!important;}.no-stack.mixed-two-up .col.num8{width: 66%!important;}.no-stack.three-up .col.num4{width: 33%!important;}.no-stack.four-up .col.num3{width: 25%!important;}.mobile_hide{min-height: 0px!important; max-height: 0px!important; max-width: 0px!important; display: none!important; overflow: hidden!important; font-size: 0px!important;}}</style> <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9FF;width: 100%" cellpadding="0" cellspacing="0"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <a href="https://socialmedica.visualmedica.com" target="_blank"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i64.tinypic.com/r1ey2x.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 860px" width="860"> </a></div><table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td></tr></tbody> </table> </td></tr></tbody></table> </div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid two-up "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div class=""><div style="color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="color: rgb(255, 255, 255); font-size: 16px; line-height: 19px;">Recupere su Contraseña</span></p></div></div></div><div class=""><div style="color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><span style="color: rgb(255, 255, 255); font-size:14px; line-height:17px;">Este es un e-mail de recuperación de contraseña, si usted no solicito el cambio de contraseña ignore este mensaje, o póngase en contacto con el soporte.-</span></div></div></div><div align="center" class="button-container center " style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;"> <a href='+path1+'cambiocontraseña.html?token='+hashlink+'&email='+req.body.email+' target="_blank" style="display: block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #0068A5; background-color: #F9F9FF; border-radius: 15px; -webkit-border-radius: 15px; -moz-border-radius: 15px; max-width: 194px; width: 154px;width: auto; border-top: 0px solid transparent; border-right: 0px solid transparent; border-bottom: 0px solid transparent; border-left: 0px solid transparent; padding-top: 5px; padding-right: 20px; padding-bottom: 5px; padding-left: 20px; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;mso-border-alt: none"> <span style="font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;font-size:16px;line-height:32px;">Cambiar Contraseña</span> </a> </div><div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;" class=""> <div style="line-height:10px;font-size:1px">&#160;</div><div style="display: table; max-width:188px;"> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.facebook.com/visual.medica" title="Facebook" target="_blank"> <img src="http://i64.tinypic.com/np1bth.jpg" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://twitter.com/VisualMedica" title="Twitter" target="_blank"> <img src="http://i66.tinypic.com/25843o0.jpg" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.instagram.com/visualmedicaint/?hl=en" title="Instagram" target="_blank"> <img src="http://i67.tinypic.com/of9jcg.jpg" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.youtube.com/channel/UCA_zdFrYw4Jgg-N1IOT2vuQ" title="YouTube" target="_blank"> <img src="http://i64.tinypic.com/jb5v81.jpg" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> </div></div></div></div></div><div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i63.tinypic.com/e17z3m.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 430px" width="430"></div></div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 5px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td></tr></tbody> </table> </td></tr></tbody></table> <div style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><!--[if (mso)|(IE)]><table width="860px" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td><![endif]--><div class="video-block" style="width:100%;max-width:100%;min-width:320px"><a target="_blank" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&amp;t=" class="video-preview" style="background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;"><span><table cellpadding="0" cellspacing="0" border="0" width="100%" background="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;background-image: url(https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg);background-size: cover;min-height: 180px;min-width: 320px"><tbody><tr style="vertical-align: top"><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><img src="https://beefree.io/img-host/video_ratio_16-9.gif" alt="" width="100%" border="0" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;opacity: 0;visibility: hidden"></td><td width="50%" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: middle"><div class="play-button_outer" style="display: inline-block;vertical-align: middle;background-color: #FFFFFF;border: 3px solid #FFFFFF;height: 59px;width: 59px;border-radius: 100%;"><div style="padding: 14.75px 22.6923076923077px;"><div class="play-button_inner" style="border-style: solid;border-width: 15px 0 15px 20px;display: block;font-size: 0;height: 0;width: 0;border-color: transparent transparent transparent #000000;">&#160;</div></div></div></td><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">&#160;</td></tr></tbody></table></span></a><!--[if vml]><v:group xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" coordsize="860,484" coordorigin="0,0" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&t=" style="width:860px;height:484px;"><v:rect fill="t" stroked="f" style="position:absolute;width:860px;height:484px;"><v:fill src="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" type="frame"/></v:rect><v:oval fill="t" strokecolor="#FFFFFF" strokeweight="3px" style="position:absolute;left:400px;top:212px;width:59px;height:59px"><v:fill color="#FFFFFF" opacity="100%"/></v:oval><v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#000000" stroked="f" style="position:absolute;left:422px;top:227px;width:21px;height:30px;"/></v:group><![endif]--></div></div></div></div></div></div></div></div></td></tr></tbody> </table> </body></html>';

 var mailOptions = {
	from: 'Jarganaraz@visualmedica.com',
	to: req.body.email,
	subject: 'Cambio de contraseña Social Medica',
	html: htmlmsg

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

//Cambiar pass
function cambiarcontrasenia(req, res){

	var email = req.body.email;
	var hash = req.body.hash;
	var hashedpassword;
	var password = req.body.password;

	//find el user con este email
	//adentro hacerle un bcrypt al mail
	//si son iguales updateo la password

	if(email && email != "null" && hash && hash !="null" && password && password != "null"){
		email = email.toUpperCase();

	User.findOne({email: email.toUpperCase()}, (err, user) => {

		if(err)  return res.status(404).send({message: "no se encontro el usuario"})

		if(user){
			bcrypt.compare(user.email,hash,(err,check)=>{
				if(check){
					bcrypt.hash(password, null, null, (err, hash) => {
						if(hash){
							hashedpassword = hash;

							User.findByIdAndUpdate(user._id, {password:hashedpassword}, {new:true}, (err, userUpdated) => {

							if(userUpdated){
								
								request.post(
									{
										url:updatepass,
										form: {email:email,password:password}
								}, function(err,response,body){

									if (response && response.statusCode == "200") {

										return res.status(200).send({message: "Exito"});
										
									}else{

										User.findByIdAndUpdate(user._id, {password:user.password}, {new:true}, (err, userUpdated) => {

											console.log("problema cambiando password")

										})

										return res.status(500).send({messasge:"No se pudo lograr la conexion"})
									}

								})
							
							}else{
								return res.status(500).send({message:"el usuario no se pudo actualizar"});
							}

						});
					}
						if(err)
						return res.status(500).send({message:"no se pudo crear el hash"});
					});
				}else{
					return res.status(500).send({message:"token invalido"})
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

// Envio de mail de contacto
function enviarMailContacto(req,res){

	if(req.body.id && req.body.id != "null" && req.body.id != 0){

	var userId = req.body.id;

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
					html: textomail
				 };
				 
												// verify connection configuration
					transporter.verify(function(error, success) {
						if (error) {
							console.log(error);
						} else {

							transporter.sendMail(mailOptions, function(error, info){
								if (error){
									return res.status(500).send(error);
								} else {
			
									var textomail1 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css" id="media-query"> body{margin: 0; padding: 0;}table, tr, td{vertical-align: top; border-collapse: collapse;}.ie-browser table, .mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important; text-decoration: none !important;}[owa] .img-container div, [owa] .img-container button{display: block !important;}[owa] .fullwidth button{width: 100% !important;}[owa] .block-grid .col{display: table-cell; float: none !important; vertical-align: top;}.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid{width: 860px !important;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4{width: 284px !important;}.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8{width: 568px !important;}.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col{width: 430px !important;}.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col{width: 286px !important;}.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col{width: 215px !important;}.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col{width: 172px !important;}.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col{width: 143px !important;}.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col{width: 122px !important;}.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col{width: 107px !important;}.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col{width: 95px !important;}.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col{width: 86px !important;}.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col{width: 78px !important;}.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col{width: 71px !important;}@media only screen and (min-width: 880px){.block-grid{width: 860px !important;}.block-grid .col{vertical-align: top;}.block-grid .col.num12{width: 860px !important;}.block-grid.mixed-two-up .col.num4{width: 284px !important;}.block-grid.mixed-two-up .col.num8{width: 568px !important;}.block-grid.two-up .col{width: 430px !important;}.block-grid.three-up .col{width: 286px !important;}.block-grid.four-up .col{width: 215px !important;}.block-grid.five-up .col{width: 172px !important;}.block-grid.six-up .col{width: 143px !important;}.block-grid.seven-up .col{width: 122px !important;}.block-grid.eight-up .col{width: 107px !important;}.block-grid.nine-up .col{width: 95px !important;}.block-grid.ten-up .col{width: 86px !important;}.block-grid.eleven-up .col{width: 78px !important;}.block-grid.twelve-up .col{width: 71px !important;}}@media (max-width: 880px){.block-grid, .col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.block-grid{width: calc(100% - 40px) !important;}.col{width: 100% !important;}.col > div{margin: 0 auto;}img.fullwidth, img.fullwidthOnMobile{max-width: 100% !important;}.no-stack .col{min-width: 0 !important; display: table-cell !important;}.no-stack.two-up .col{width: 50% !important;}.no-stack.mixed-two-up .col.num4{width: 33% !important;}.no-stack.mixed-two-up .col.num8{width: 66% !important;}.no-stack.three-up .col.num4{width: 33% !important;}.no-stack.four-up .col.num3{width: 25% !important;}.mobile_hide{min-height: 0px; max-height: 0px; max-width: 0px; display: none; overflow: hidden; font-size: 0px;}}</style></head><body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9FF"> <style type="text/css" id="media-query-bodytag"> @media (max-width: 520px){.block-grid{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col > div{margin: 0 auto;}img.fullwidth{max-width: 100%!important;}img.fullwidthOnMobile{max-width: 100%!important;}.no-stack .col{min-width: 0!important;display: table-cell!important;}.no-stack.two-up .col{width: 50%!important;}.no-stack.mixed-two-up .col.num4{width: 33%!important;}.no-stack.mixed-two-up .col.num8{width: 66%!important;}.no-stack.three-up .col.num4{width: 33%!important;}.no-stack.four-up .col.num3{width: 25%!important;}.mobile_hide{min-height: 0px!important; max-height: 0px!important; max-width: 0px!important; display: none!important; overflow: hidden!important; font-size: 0px!important;}}</style> <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9FF;width: 100%" cellpadding="0" cellspacing="0"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <a href="https://socialmedica.visualmedica.com" target="_blank"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i64.tinypic.com/r1ey2x.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 860px" width="860"> </a></div><table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td></tr></tbody> </table> </td></tr></tbody></table> </div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid two-up "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div class=""><div style="color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="color: rgb(255, 255, 255); font-size: 16px; line-height: 19px;">Gracias por comunicarse con el soporte de Visual Medica</span></p></div></div></div><div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="color: rgb(255, 255, 255); font-size: 14px; line-height: 16px;">En el caso de ser necesario para brindarle soporte remoto por favor descargue VM-REMOTE-SUPPORT desde<span style="font-size: 14px; line-height: 16px;"> <a style="color:#BBBBBB" href="http://visualmedica.com/uploads/products/VM_REMOTE_SUPPORT.exe" target="_blank" rel="noopener"><span style="font-size: 14px; line-height: 16px;">" Aquí "</span></a></span></span></p></div></div></div><div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;" class=""> <div style="line-height:10px;font-size:1px">&#160;</div><div style="display: table; max-width:188px;"> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.facebook.com/visual.medica" title="Facebook" target="_blank"> <img src="http://i64.tinypic.com/np1bth.jpg" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://twitter.com/VisualMedica" title="Twitter" target="_blank"> <img src="http://i66.tinypic.com/25843o0.jpg" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.instagram.com/visualmedicaint/?hl=en" title="Instagram" target="_blank"> <img src="http://i67.tinypic.com/of9jcg.jpg" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.youtube.com/channel/UCA_zdFrYw4Jgg-N1IOT2vuQ" title="YouTube" target="_blank"> <img src="http://i64.tinypic.com/jb5v81.jpg" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> </div></div></div></div></div><div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i63.tinypic.com/e17z3m.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 430px" width="430"></div></div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 5px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td></tr></tbody> </table> </td></tr></tbody></table> <div style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><!--[if (mso)|(IE)]><table width="860px" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td><![endif]--><div class="video-block" style="width:100%;max-width:100%;min-width:320px"><a target="_blank" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&amp;t=" class="video-preview" style="background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;"><span><table cellpadding="0" cellspacing="0" border="0" width="100%" background="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;background-image: url(https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg);background-size: cover;min-height: 180px;min-width: 320px"><tbody><tr style="vertical-align: top"><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><img src="https://beefree.io/img-host/video_ratio_16-9.gif" alt="" width="100%" border="0" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;opacity: 0;visibility: hidden"></td><td width="50%" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: middle"><div class="play-button_outer" style="display: inline-block;vertical-align: middle;background-color: #FFFFFF;border: 3px solid #FFFFFF;height: 59px;width: 59px;border-radius: 100%;"><div style="padding: 14.75px 22.6923076923077px;"><div class="play-button_inner" style="border-style: solid;border-width: 15px 0 15px 20px;display: block;font-size: 0;height: 0;width: 0;border-color: transparent transparent transparent #000000;">&#160;</div></div></div></td><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">&#160;</td></tr></tbody></table></span></a><!--[if vml]><v:group xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" coordsize="860,484" coordorigin="0,0" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&t=" style="width:860px;height:484px;"><v:rect fill="t" stroked="f" style="position:absolute;width:860px;height:484px;"><v:fill src="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" type="frame"/></v:rect><v:oval fill="t" strokecolor="#FFFFFF" strokeweight="3px" style="position:absolute;left:400px;top:212px;width:59px;height:59px"><v:fill color="#FFFFFF" opacity="100%"/></v:oval><v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#000000" stroked="f" style="position:absolute;left:422px;top:227px;width:21px;height:30px;"/></v:group><![endif]--></div></div></div></div></div></div></div></div></td></tr></tbody> </table> </body></html>';
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
										subject: 'Contacto Social-Medica',
										html: textomail1
									 };
																	// verify connection configuration
										transporter.verify(function(error, success) {
											if (error) {
												console.log(error);
											} else {
												transporter.sendMail(mailOptions, function(error, info){
													if (error){
													
														return res.status(500).send(error);
													} else {
													
														return res.status(200).send({message : "El email se envio correctamente"});
													}
												});
											}
										});														
								}
							});
						}
					});
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

				return res.status(500).send(error);

			} else {

				var textomail1 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css" id="media-query"> body{margin: 0; padding: 0;}table, tr, td{vertical-align: top; border-collapse: collapse;}.ie-browser table, .mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important; text-decoration: none !important;}[owa] .img-container div, [owa] .img-container button{display: block !important;}[owa] .fullwidth button{width: 100% !important;}[owa] .block-grid .col{display: table-cell; float: none !important; vertical-align: top;}.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid{width: 860px !important;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4{width: 284px !important;}.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8{width: 568px !important;}.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col{width: 430px !important;}.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col{width: 286px !important;}.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col{width: 215px !important;}.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col{width: 172px !important;}.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col{width: 143px !important;}.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col{width: 122px !important;}.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col{width: 107px !important;}.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col{width: 95px !important;}.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col{width: 86px !important;}.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col{width: 78px !important;}.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col{width: 71px !important;}@media only screen and (min-width: 880px){.block-grid{width: 860px !important;}.block-grid .col{vertical-align: top;}.block-grid .col.num12{width: 860px !important;}.block-grid.mixed-two-up .col.num4{width: 284px !important;}.block-grid.mixed-two-up .col.num8{width: 568px !important;}.block-grid.two-up .col{width: 430px !important;}.block-grid.three-up .col{width: 286px !important;}.block-grid.four-up .col{width: 215px !important;}.block-grid.five-up .col{width: 172px !important;}.block-grid.six-up .col{width: 143px !important;}.block-grid.seven-up .col{width: 122px !important;}.block-grid.eight-up .col{width: 107px !important;}.block-grid.nine-up .col{width: 95px !important;}.block-grid.ten-up .col{width: 86px !important;}.block-grid.eleven-up .col{width: 78px !important;}.block-grid.twelve-up .col{width: 71px !important;}}@media (max-width: 880px){.block-grid, .col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.block-grid{width: calc(100% - 40px) !important;}.col{width: 100% !important;}.col > div{margin: 0 auto;}img.fullwidth, img.fullwidthOnMobile{max-width: 100% !important;}.no-stack .col{min-width: 0 !important; display: table-cell !important;}.no-stack.two-up .col{width: 50% !important;}.no-stack.mixed-two-up .col.num4{width: 33% !important;}.no-stack.mixed-two-up .col.num8{width: 66% !important;}.no-stack.three-up .col.num4{width: 33% !important;}.no-stack.four-up .col.num3{width: 25% !important;}.mobile_hide{min-height: 0px; max-height: 0px; max-width: 0px; display: none; overflow: hidden; font-size: 0px;}}</style></head><body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9FF"> <style type="text/css" id="media-query-bodytag"> @media (max-width: 520px){.block-grid{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col > div{margin: 0 auto;}img.fullwidth{max-width: 100%!important;}img.fullwidthOnMobile{max-width: 100%!important;}.no-stack .col{min-width: 0!important;display: table-cell!important;}.no-stack.two-up .col{width: 50%!important;}.no-stack.mixed-two-up .col.num4{width: 33%!important;}.no-stack.mixed-two-up .col.num8{width: 66%!important;}.no-stack.three-up .col.num4{width: 33%!important;}.no-stack.four-up .col.num3{width: 25%!important;}.mobile_hide{min-height: 0px!important; max-height: 0px!important; max-width: 0px!important; display: none!important; overflow: hidden!important; font-size: 0px!important;}}</style> <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9FF;width: 100%" cellpadding="0" cellspacing="0"><tbody><tr style="vertical-align: top"><td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <a href="https://socialmedica.visualmedica.com" target="_blank"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i64.tinypic.com/r1ey2x.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 860px" width="860"> </a></div><table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td></tr></tbody> </table> </td></tr></tbody></table> </div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid two-up "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div class=""><div style="color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="color: rgb(255, 255, 255); font-size: 16px; line-height: 19px;">Gracias por comunicarse con el soporte de Visual Medica</span></p></div></div></div><div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="color: rgb(255, 255, 255); font-size: 14px; line-height: 16px;">En el caso de ser necesario para brindarle soporte remoto por favor descargue VM-REMOTE-SUPPORT desde<span style="font-size: 14px; line-height: 16px;"> <a style="color:#BBBBBB" href="http://visualmedica.com/uploads/products/VM_REMOTE_SUPPORT.exe" target="_blank" rel="noopener"><span style="font-size: 14px; line-height: 16px;">" Aquí "</span></a></span></span></p></div></div></div><div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;" class=""> <div style="line-height:10px;font-size:1px">&#160;</div><div style="display: table; max-width:188px;"> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.facebook.com/visual.medica" title="Facebook" target="_blank"> <img src="http://i64.tinypic.com/np1bth.jpg" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://twitter.com/VisualMedica" title="Twitter" target="_blank"> <img src="http://i66.tinypic.com/25843o0.jpg" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.instagram.com/visualmedicaint/?hl=en" title="Instagram" target="_blank"> <img src="http://i67.tinypic.com/of9jcg.jpg" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.youtube.com/channel/UCA_zdFrYw4Jgg-N1IOT2vuQ" title="YouTube" target="_blank"> <img src="http://i64.tinypic.com/jb5v81.jpg" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&#160;</div></td></tr></tbody></table> </div></div></div></div></div><div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i63.tinypic.com/e17z3m.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 430px" width="430"></div></div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 5px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&#160;</span> </td></tr></tbody> </table> </td></tr></tbody></table> <div style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><!--[if (mso)|(IE)]><table width="860px" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td><![endif]--><div class="video-block" style="width:100%;max-width:100%;min-width:320px"><a target="_blank" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&amp;t=" class="video-preview" style="background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;"><span><table cellpadding="0" cellspacing="0" border="0" width="100%" background="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;background-image: url(https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg);background-size: cover;min-height: 180px;min-width: 320px"><tbody><tr style="vertical-align: top"><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><img src="https://beefree.io/img-host/video_ratio_16-9.gif" alt="" width="100%" border="0" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;opacity: 0;visibility: hidden"></td><td width="50%" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: middle"><div class="play-button_outer" style="display: inline-block;vertical-align: middle;background-color: #FFFFFF;border: 3px solid #FFFFFF;height: 59px;width: 59px;border-radius: 100%;"><div style="padding: 14.75px 22.6923076923077px;"><div class="play-button_inner" style="border-style: solid;border-width: 15px 0 15px 20px;display: block;font-size: 0;height: 0;width: 0;border-color: transparent transparent transparent #000000;">&#160;</div></div></div></td><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">&#160;</td></tr></tbody></table></span></a><!--[if vml]><v:group xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" coordsize="860,484" coordorigin="0,0" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&t=" style="width:860px;height:484px;"><v:rect fill="t" stroked="f" style="position:absolute;width:860px;height:484px;"><v:fill src="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" type="frame"/></v:rect><v:oval fill="t" strokecolor="#FFFFFF" strokeweight="3px" style="position:absolute;left:400px;top:212px;width:59px;height:59px"><v:fill color="#FFFFFF" opacity="100%"/></v:oval><v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#000000" stroked="f" style="position:absolute;left:422px;top:227px;width:21px;height:30px;"/></v:group><![endif]--></div></div></div></div></div></div></div></div></td></tr></tbody> </table> </body></html>'
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
					subject: 'Contacto Social-Medica',
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
						return res.status(500).send(error);
					} else {
						return res.status(200).send({message : "El email se envio correctamente"});
					}
				});

				request.post(
					'http://www.yoursite.com/formpage',
					{ json: { key: 'value' } },
					function (error, response, body) {
						if (!error && response.statusCode == 200) {
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
				}
			}
		);
}

}

// Verificar relacion medico institucion
function consultamedicoxinsti (req,res){

	var medicoId = req.body.medicoid;
	var instiId = req.body.instiid;
	var medicoxInsti = new MedicoxInsti();

	if(!medicoId || !instiId || medicoId == "null" || instiId == "null"){
		
		return	res.status(400).send({message : "faltan datos en la peticion"});

	}

	medicoxInsti.medico = medicoId;
	medicoxInsti.institucion = instiId;

	MedicoxInsti.findOne({"medico":medicoId, "institucion":instiId}).exec((err,relstored) =>{

		
		if (err) return res.status(500).send({message : "Ocurrio un problema",opcion:"no"});

		if (relstored ) {
			//console.log("intento medico");
			return res.status(200).send({message: "Relacion Encontrada",opcion:"si"});

		}

		if (!relstored ){
			//console.log("intento malo")
		 return res.status(200).send({message : "No se encontro relacion",opcion:"no"});
		}


	});

}

// Desactivar Cuenta
function deactivateAcc(req, res){
	var userId = req.params.id;
	//console.log(userId)
		 	
			 User.findByIdAndUpdate(userId, {activo: false},{new : true}, (err, userUpdated) => {
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el estado',error:err});
				}else{
					res.status(200).send({activo: true, user: userUpdated});
					//res.redirect();
				}

		 });

}

// envio de email activacion
function enviomailactivacion(id,email){

	var textomail = '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title></title> <style type="text/css" id="media-query"> body{margin: 0;padding: 0;}table, tr, td{vertical-align: top;border-collapse: collapse;}.ie-browser table, .mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important;text-decoration: none !important;}[owa] .img-container div, [owa] .img-container button{display: block !important;}[owa] .fullwidth button{width: 100% !important;}[owa] .block-grid .col{display: table-cell;float: none !important;vertical-align: top;}.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid{width: 860px !important;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4{width: 284px !important;}.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8{width: 568px !important;}.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col{width: 430px !important;}.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col{width: 286px !important;}.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col{width: 215px !important;}.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col{width: 172px !important;}.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col{width: 143px !important;}.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col{width: 122px !important;}.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col{width: 107px !important;}.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col{width: 95px !important;}.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col{width: 86px !important;}.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col{width: 78px !important;}.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col{width: 71px !important;}@media only screen and (min-width: 880px){.block-grid{width: 860px !important;}.block-grid .col{vertical-align: top;}.block-grid .col.num12{width: 860px !important;}.block-grid.mixed-two-up .col.num4{width: 284px !important;}.block-grid.mixed-two-up .col.num8{width: 568px !important;}.block-grid.two-up .col{width: 430px !important;}.block-grid.three-up .col{width: 286px !important;}.block-grid.four-up .col{width: 215px !important;}.block-grid.five-up .col{width: 172px !important;}.block-grid.six-up .col{width: 143px !important;}.block-grid.seven-up .col{width: 122px !important;}.block-grid.eight-up .col{width: 107px !important;}.block-grid.nine-up .col{width: 95px !important;}.block-grid.ten-up .col{width: 86px !important;}.block-grid.eleven-up .col{width: 78px !important;}.block-grid.twelve-up .col{width: 71px !important;}}@media (max-width: 880px){.block-grid, .col{min-width: 320px !important; max-width: 100% !important; display: block !important;}.block-grid{width: calc(100% - 40px) !important;}.col{width: 100% !important;}.col > div{margin: 0 auto;}img.fullwidth, img.fullwidthOnMobile{max-width: 100% !important;}.no-stack .col{min-width: 0 !important; display: table-cell !important;}.no-stack.two-up .col{width: 50% !important;}.no-stack.mixed-two-up .col.num4{width: 33% !important;}.no-stack.mixed-two-up .col.num8{width: 66% !important;}.no-stack.three-up .col.num4{width: 33% !important;}.no-stack.four-up .col.num3{width: 25% !important;}.mobile_hide{min-height: 0px; max-height: 0px; max-width: 0px; display: none; overflow: hidden; font-size: 0px;}}</style></head><body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #F9F9FF"><style type="text/css" id="media-query-bodytag"> @media (max-width: 520px){.block-grid{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col > div{margin: 0 auto;}img.fullwidth{max-width: 100%!important;}img.fullwidthOnMobile{max-width: 100%!important;}.no-stack .col{min-width: 0!important; display: table-cell!important;}.no-stack.two-up .col{width: 50%!important;}.no-stack.mixed-two-up .col.num4{width: 33%!important;}.no-stack.mixed-two-up .col.num8{width: 66%!important;}.no-stack.three-up .col.num4{width: 33%!important;}.no-stack.four-up .col.num3{width: 25%!important;}.mobile_hide{min-height: 0px!important; max-height: 0px!important; max-width: 0px!important; display: none!important; overflow: hidden!important; font-size: 0px!important;}}</style><table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #F9F9FF;width: 100%" cellpadding="0" cellspacing="0"><tbody><tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center autowidth fullwidth " style="padding-right: 0px; padding-left: 0px;"><a href="https://socialmedica.visualmedica.com" target="_blank"> <img class="center autowidth fullwidth" align="center" border="0" src="http://i64.tinypic.com/r1ey2x.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 860px" width="860"></a></div><table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&nbsp;</span> </td></tr></tbody> </table> </td></tr></tbody></table> </div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid two-up "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"> <div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 18px; line-height: 21px; color: rgb(255, 255, 255);"><strong>Bienvenido a Social Médica</strong></span></p></div></div></div><div class=""><div style="color:#555555;line-height:120%;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"> <div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="color: rgb(255, 255, 255); font-size: 14px; line-height: 16px;">Gracias por registrarse en Social Médica, para activar su cuenta y poder contactarse con los mejores profesionales e instituciones por favor clickee el siguiente botón y siga las instrucciones.</span></p></div></div></div><div align="center" class="button-container center " style="padding-right: 10px; padding-left: 10px; padding-top:10px; padding-bottom:10px;"> <a href="'+pathrecupass+id+'" target="_blank" style="display: block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #3AAEE0; background-color: #FFFFFF; border-radius: 14px; -webkit-border-radius: 14px; -moz-border-radius: 14px; max-width: 176px; width: 136px;width: auto; border-top: 1px solid #000000; border-right: 1px solid #000000; border-bottom: 1px solid #000000; border-left: 1px solid #000000; padding-top: 5px; padding-right: 20px; padding-bottom: 5px; padding-left: 20px; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;mso-border-alt: none"> <span style="font-family:Arial, "Helvetica Neue", Helvetica, sans-serif;font-size:16px;line-height:32px;"><strong>Activar Cuenta</strong></span> </a> </div><div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;" class=""><div style="line-height:10px;font-size:1px">&nbsp;</div><div style="display: table; max-width:188px;"> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.facebook.com/visual.medica" title="Facebook" target="_blank"> <img src="http://i64.tinypic.com/np1bth.jpg" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&nbsp;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://twitter.com/VisualMedica" title="Twitter" target="_blank"> <img src="http://i66.tinypic.com/25843o0.jpg" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&nbsp;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 5px"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.instagram.com/visualmedicaint/?hl=en" title="Instagram" target="_blank"> <img src="http://i67.tinypic.com/of9jcg.jpg" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&nbsp;</div></td></tr></tbody></table> <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0"> <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"> <a href="https://www.youtube.com/channel/UCA_zdFrYw4Jgg-N1IOT2vuQ" title="YouTube" target="_blank"> <img src="http://i64.tinypic.com/jb5v81.jpg" alt="YouTube" title="YouTube" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important"> </a> <div style="line-height:5px;font-size:1px">&nbsp;</div></td></tr></tbody></table> </div></div></div></div></div><div class="col num6" style="min-width: 320px;max-width: 430px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><!--[if (mso)|(IE)]><table width="430px" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td><![endif]--><div class="video-block" style="width:100%;max-width:100%;min-width:320px"><a target="_blank" href="https://www.youtube.com/watch?v=WE8GVLiPrsI" class="video-preview" style="background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;"><span><table cellpadding="0" cellspacing="0" border="0" width="100%" background="https://img.youtube.com/vi/WE8GVLiPrsI/maxresdefault.jpg" role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;background-image: url(https://img.youtube.com/vi/WE8GVLiPrsI/maxresdefault.jpg);background-size: cover;min-height: 180px;min-width: 320px"><tbody><tr style="vertical-align: top"><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><img src="https://beefree.io/img-host/video_ratio_16-9.gif" alt="" width="100%" border="0" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;opacity: 0;visibility: hidden"></td><td width="50%" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: middle"><div class="play-button_outer" style="display: inline-block;vertical-align: middle;border: 3px solid #FFFFFF;height: 59px;width: 59px;border-radius: 100%;"><div style="padding: 14.75px 22.6923076923077px;"><div class="play-button_inner" style="border-style: solid;border-width: 15px 0 15px 20px;display: block;font-size: 0;height: 0;width: 0;border-color: transparent transparent transparent #FFFFFF;">&nbsp;</div></div></div></td><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">&nbsp;</td></tr></tbody></table></span></a><!--[if vml]><v:group xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" coordsize="430,242" coordorigin="0,0" href="https://www.youtube.com/watch?v=WE8GVLiPrsI" style="width:430px;height:242px;"><v:rect fill="t" stroked="f" style="position:absolute;width:430px;height:242px;"><v:fill src="https://img.youtube.com/vi/WE8GVLiPrsI/maxresdefault.jpg" type="frame"/></v:rect><v:oval fill="t" strokecolor="#FFFFFF" strokeweight="3px" style="position:absolute;left:186px;top:92px;width:59px;height:59px"><v:fill color="black" opacity="0%"/></v:oval><v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#FFFFFF" stroked="f" style="position:absolute;left:206px;top:106px;width:21px;height:30px;"/></v:group><![endif]--></div></div></div></div></div></div></div></div><div style="background-color:transparent;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 860px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0068A5;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;background-color:#0068A5;"> <div class="col num12" style="min-width: 320px;max-width: 860px;display: table-cell;vertical-align: top;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #FFFFFF;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <tbody> <tr style="vertical-align: top"> <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%"> <span>&nbsp;</span> </td></tr></tbody> </table> </td></tr></tbody></table> <div style="padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><!--[if (mso)|(IE)]><table width="860px" align="center" cellpadding="0" cellspacing="0" role="presentation"><tr><td><![endif]--><div class="video-block" style="width:100%;max-width:100%;min-width:320px"><a target="_blank" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&amp;t=" class="video-preview" style="background-color: #5b5f66; background-image: radial-gradient(circle at center, #5b5f66, #1d1f21); display: block; text-decoration: none;"><span><table cellpadding="0" cellspacing="0" border="0" width="100%" background="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" role="presentation" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;background-image: url(https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg);background-size: cover;min-height: 180px;min-width: 320px"><tbody><tr style="vertical-align: top"><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top"><img src="https://beefree.io/img-host/video_ratio_16-9.gif" alt="" width="100%" border="0" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;opacity: 0;visibility: hidden"></td><td width="50%" align="center" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: middle"><div class="play-button_outer" style="display: inline-block;vertical-align: middle;background-color: #FFFFFF;border: 3px solid #FFFFFF;height: 59px;width: 59px;border-radius: 100%;"><div style="padding: 14.75px 22.6923076923077px;"><div class="play-button_inner" style="border-style: solid;border-width: 15px 0 15px 20px;display: block;font-size: 0;height: 0;width: 0;border-color: transparent transparent transparent #000000;">&nbsp;</div></div></div></td><td width="25%" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">&nbsp;</td></tr></tbody></table></span></a><!--[if vml]><v:group xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" coordsize="860,484" coordorigin="0,0" href="https://www.youtube.com/watch?v=l6IJ5MKQYA8&t=" style="width:860px;height:484px;"><v:rect fill="t" stroked="f" style="position:absolute;width:860px;height:484px;"><v:fill src="https://img.youtube.com/vi/l6IJ5MKQYA8/maxresdefault.jpg" type="frame"/></v:rect><v:oval fill="t" strokecolor="#FFFFFF" strokeweight="3px" style="position:absolute;left:400px;top:212px;width:59px;height:59px"><v:fill color="#FFFFFF" opacity="100%"/></v:oval><v:shape coordsize="24,32" path="m,l,32,24,16,xe" fillcolor="#000000" stroked="f" style="position:absolute;left:422px;top:227px;width:21px;height:30px;"/></v:group><![endif]--></div></div></div></div></div></div></div></div></td></tr></tbody></table></body></html>';
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

	 //console.log(email);
	 
	 var mailOptions = {
		from: 'Jarganaraz@visualmedica.com',
		to: email,
		subject: 'Activación de cuenta de Social Medica',
		html: textomail
	 };

	 							// verify connection configuration
	 transporter.verify(function(error, success) {
			if (error) {
					console.log(error);
			} else {
					//console.log('Server is ready to take our messages');

					transporter.sendMail(mailOptions, function(error, info){
						if (error){
								console.log(error);				
						} else {
						//	console.log(info)
							///	console.log("Email sent");
						}
					});
			}
	});
	

}

//obtengo la lista de instituciones que agrego al medico
function getInstisxMedico(req, res){
	var identity_user_id = req.user.sub;
	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 4;

	MedicoxInsti.find(			

				{medico: identity_user_id}

	).populate("institucion").sort('_id').paginate(page, itemsPerPage, (err, users, total) => {

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



function addDelInsti (req,res){
	//todo verificar primero la dicom luego la mongo la dicom tiene mas probabilidades de fallar al insertar
		var medicoId = req.user.sub;
		var consulta = req.body.consulta;//
		var instiId = req.body.id;//
		var medicomail = req.user.email;// arreglado mails
		var instimail = req.body.email;// 
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
								url: 'http://127.0.0.1:8300/institucion/delmedicoinsti',
								method: 'POST',
								form: {'medicomail': medicomail, 'instimail': instimail}
							}
	
							// Start the request
							request(options, function (error, response, body) {
								if (!error && response.statusCode == 200) {
	
									console.log("bien a la dicom borrando");
	
								}else{
									//todo si ocurre problema en la dicom volver a agregar el user y hacer redirect, guardar logs
									//con datos donde fallo y dar aviso
							
									console.log("error en la dicom borrando");
	
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
	
				if (consulta == 1){
					 res.status(200).send({message : "eso fue una consulta", type:0});
					}
				else{
					medicoxInsti.save((err,addmedicostored)=>{
	
						if (err) return res.status(500).send({message : "Error en la peticion"});
	
						if (!addDelMedico) res.status(404).send({message: "No se pudo añadir al medico"});
	
						if (addmedicostored) {
													// Configure the request
							var options = {
								url: 'http://127.0.0.1:8300/institucion/addmedicoinsti',
								method: 'POST',
								form: {'medicomail': medicomail, 'instimail': instimail}
							}
	
							// Start the request
							request(options, function (error, response, body) {
								if (!error && response.statusCode == 200) {
	
									res.status(200).send({message : "Se agrego al medico", type : 0});
								}else{
	
									//todo si ocurre problema en la dicom volver a agregar el user y hacer redirect, guardar logs
									//con datos donde fallo y dar aviso
	
									console.log("error en la dicom");
	
									return res.status(404).send({message:"Ocurrio un problema al agregar el medico comuniquese con el soporte4"})
								
								}
							})					
						}
	
					});
				}
			}
	
		});
	
	}


	//obtener instituciones filtradas


	function getinstisxmedfilter(req, res){
		
			var identity_user_id = req.user.sub;
			var array = [];
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
		
			var itemsPerPage = 4;
		
		
			MedicoxInsti.find(
				{medico : identity_user_id }
			,(err,resp)=>{
		
			if(err) return res.status(500).send({message:"Ocurrio un error en el servidor"});
		
			if(resp){
				
				resp.forEach(resp => {
					array.push( resp.institucion)
			
				});	
				//return res.status(200).send({resp:resp,array:array})
				User.find(
					{
						$and:[
							{
								role : {"$ne" : rol},
								_id: {'$in' :array},
								activo:'true'
							},	
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
			})
		}
		


//Export de funciones
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
	consultamedicoxinsti,
	deactivateAcc,
	getInstisxMedico,
	addDelInsti,
	getinstisxmedfilter
	
}