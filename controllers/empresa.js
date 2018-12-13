'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var User = require('../models/user');
var Empresa = require('../models/empresa');
var jwt = require('../services/jwt');

function saveInfo(req, res){
	var params = req.body;
	var userId = req.params.id;


	var empresa = new Empresa();
	empresa.nombre = params.nombre;
	empresa.equipamiento = params.equipamiento;
	empresa.formadepago = params.formadepago;
	empresa.tporespuesta =params.tporespuesta;
	empresa.domicilio = req.user.domicilio;
	empresa.telefono = params.telefono;
	empresa.pais = params.pais;
    empresa.contacto = params.contacto;
    empresa.user = params.email;
	

	empresa.save((err, empresaStored) => {
		if(err) return res.status(500).send({message: 'Error en la Informacion'});

		if(!empresaStored) return res.status(404).send({message: 'La Informacion NO ha sido guardada'});

		return res.status(200).send({empresa: empresaStored});
	});

}

function getPersonal(req, res){
	var userId = req.user.sub;

	Personal.find({user: userId}, (err, personal) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!personal) return res.status(404).send({message: 'La informacion no existe'});

        if(personal) return res.status(200).send(personal)

	});
}

function updatePersonal(req,res){

	var userId = req.user.sub;
	var update = req.body;
	var idpersonal ;

		Personal.find({user:userId},(err,personalUpdated)=>{

			if(err) return res.status(500).send({message:'error en la peticion'});

			if(!personalUpdated) return res,status(404).send({message:'no existe usuario'});
			
			if(personalUpdated) {
				//console.log(personalUpdated);

				Personal.findByIdAndUpdate(personalUpdated, update, {new:true},(err,infoUpdated)=>{
					if(err) res.status(500).send({message:'ocurrio un error'});
		
					if(!infoUpdated) res.status(404).send({message : 'no se pudo modificar la informacion'});
		
					if(infoUpdated) res.status(200).send({ personal : infoUpdated});
				});

			};

		});	
}

function uploadCurriculum(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

    if(userId != req.user.sub){
        res.status(500).send({message : 'no tienes permisos para modificar otro usuario'
    });

    }else{
	if(req.files){
		//console.log(req.files);
		var file_path = req.files.curriculumfile.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		//console.log(file_name);

		var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
		if(file_ext == 'xls' || file_ext == 'pdf' || file_ext == 'docx' || file_ext == 'doc'){

			Personal.find({user:userId},(err,personalUpdated)=>{
				if(err) return res.status(500).send({message:'error en la peticion'});

				if(!personalUpdated) return res,status(404).send({message:'no existe usuario'});
				
				if(personalUpdated) {

					Personal.findByIdAndUpdate(personalUpdated, {doccurriculum: file_name} , {new:true},(err,infoUpdated)=>{
						if(err) res.status(500).send({message:'ocurrio un error'});
			
						if(!infoUpdated) res.status(404).send({message : 'no se pudo modificar la informacion'});
			
						if(infoUpdated) res.status(200).send({ doccurriculum: file_name});
					});


				}

			});	

		}else{
			return removeFilesOfUploads(res, file_path, 'Extensión no válida');
		}
		
	}else{
		res.status(200).send({message: 'No has subido ningun archivo...'});
    }
}
}

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) => {
		return res.status(200).send({message: message});
	});
}


function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

    if(userId != req.user.sub){
        res.status(500).send({message : 'no tienes permisos para modificar otro usuario'
    });

    }else{
	if(req.files){
		//console.log(req.files);
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		//console.log(file_name);

		var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
		if(file_ext == 'gif' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'bmp'){

			Personal.find({user:userId},(err,personalUpdated)=>{
				if(err) return res.status(500).send({message:'error en la peticion'});

				if(!personalUpdated) return res,status(404).send({message:'no existe usuario'});
				
				if(personalUpdated) {

					Personal.findByIdAndUpdate(personalUpdated, {imageperfil: file_name} , {new:true},(err,infoUpdated)=>{
						if(err) res.status(500).send({message:'ocurrio un error'});
			
						if(!infoUpdated) res.status(404).send({message : 'no se pudo modificar la informacion'});
			
						if(infoUpdated) res.status(200).send({ imageperfil: file_name});
					});


				}

			});	

		}else{
			return removeFilesOfUploads(res, file_path, 'Extensión no válida');
		}
		
	}else{
		res.status(200).send({message: 'No has subido ningun archivo...'});
    }
}
}



module.exports = {
    saveInfo,
	getPersonal,
	updatePersonal,
	uploadCurriculum,
	uploadImage
}