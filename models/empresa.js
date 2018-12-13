'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
    nombre: String,
    equipamiento : String,
    formadepago: String,
    tporespuesta: String,
    domicilio : String,
    user: String,
    telefono: String,
    pais : String,
    contacto: String,
    imageperfil: String,

});

module.exports = mongoose.model('Empresa',EmpresaSchema);