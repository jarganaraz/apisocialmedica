'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = Schema({
		emitter: { type: Schema.ObjectId, ref:'User' },
        receiver: { type: Schema.ObjectId, ref:'User' },
        lastmsg:String,
        lastmsgdate:Date,
        lastactive:{ type: Schema.ObjectId, ref:'User' },
        emitterview:Boolean,
        receiverview:Boolean
});

module.exports = mongoose.model('Chat', ChatSchema);