'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoritoSchema = Schema({
		emitter: { type: Schema.ObjectId, ref:'User' },
		receiver: { type: Schema.ObjectId, ref:'User' },
		created_at: Date,

});

module.exports = mongoose.model('Favorito', FavoritoSchema);