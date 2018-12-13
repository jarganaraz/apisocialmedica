'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonalSchema = Schema({
    perfil: String,
    telefono : String,
    pais: String,
    curriculum: String,
    doccurriculum : String,
    user: { type: Schema.ObjectId, ref: 'User' },
    name: String,
    surname : String,
    estudytipe: String,
    imageperfil: String,

});

module.exports = mongoose.model('Personal',PersonalSchema);















    












