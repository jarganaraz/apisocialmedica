'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicoXInstitucion = Schema({
	medico: { type: Schema.ObjectId, ref:'User' },
	institucion: { type: Schema.ObjectId, ref:'User' }
});

module.exports = mongoose.model('MedicoXInstitucion', MedicoXInstitucion);







