'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
		emitter: { type: Schema.ObjectId, ref:'User' },
		receiver: { type: Schema.ObjectId, ref:'User' },
		text: String,
		viewed: String,
		created_at: Date,
		chat: { type: Schema.ObjectId, ref:'Chat' },

});

module.exports = mongoose.model('Message', MessageSchema);