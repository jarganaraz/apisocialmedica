'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
		name: String,
		surname: String,
		email: String,
		password: String,
		role: String,
		image: String,
		activo : Boolean,
		telefono: String,
		domicilio: String,
		pais: String,
		studytipe: String,
		perfil:String,
		curriculum: String,
		curriculumfile:String,
		contacto:String,
		tporespuesta: String,
		formadepago: String,
		contacto: String,
		primera:String,
		ayuda:Boolean,


});


module.exports = mongoose.model('User', UserSchema);