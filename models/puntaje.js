'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PuntajeSchema = Schema({
    puntualidad: String,
    calidad: String,
    contenido: String,
    comentario:String,
	emitter: { type: Schema.ObjectId, ref:'User' },
	receiver: { type: Schema.ObjectId, ref:'User' }
});

module.exports = mongoose.model('Puntaje', PuntajeSchema);