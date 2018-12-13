'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
		text: String,
		viewed: String,
		created_at: Date,
		emitter: { type: Schema.ObjectId, ref:'User' },
		receiver: { type: Schema.ObjectId, ref:'User' }
});

module.exports = mongoose.model('Message', MessageSchema);