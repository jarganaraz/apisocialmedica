'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CalendarioSchema = Schema({
		user: { type: Schema.ObjectId, ref:'User' },
        start:Date,
        end:Date,
        title:String,
        url:String,
        backgroundColor:String,
        textColor:String
});

module.exports = mongoose.model('Calendario', CalendarioSchema);