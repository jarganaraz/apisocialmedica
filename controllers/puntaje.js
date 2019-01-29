'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var User = require('../models/user');
var Puntaje = require('../models/puntaje');
var jwt = require('../services/jwt');
var nodemailer = require('nodemailer');
var path1 = "https://socialmedica.visualmedica.com";
var util = require('util')



function puntuar(req,res){
    console.log("puntuado")
    console.log(req.body)
   // var puntualidad,calidad,contenido,comentario,emiter,receiver;
    var puntaje = new Puntaje();

    if(req.body.puntualidad)
    puntaje.puntualidad = req.body.puntualidad;
    if(req.body.calidad)
    puntaje.calidad = req.body.calidad;
    if(req.body.contenido)
    puntaje.contenido = req.body.contenido;
    if(req.body.comentario)
    puntaje.comentario = req.body.comentario;
    //if(req.user.sub)
    puntaje.emitter = req.user.sub
    if(req.body.receiver)
    puntaje.receiver = req.body.receiver;                                         

   Puntaje.find(
   { receiver : puntaje.receiver, 
     emitter : puntaje.emitter}
     )
    .exec((err,puntajessearch) =>{


    if(err) return res.status(500).send({message : "Ocurrio un problema al buscar puntuacion"})


    if(puntajessearch && puntajessearch <= 0){

    puntaje.save((err, puntajeStored) => {

        if(err) return res.status(500).send({message : "Ocurrio un error al guardar"});

        if(puntajeStored) return res.status(200).send({message : "Exito al puntuar"});

    })
    }

    if(puntajessearch && puntajessearch.length >= 1){

        let puntajeid =puntajessearch[0]._id;

        Puntaje.findByIdAndUpdate(puntajeid, {puntualidad : puntaje.puntualidad, calidad :puntaje.calidad,contenido:puntaje.contenido,comentario:puntaje.comentario }, (err, updatedmsg) =>{

            if (err) return res.status(500).send({ message : err})

            if(updatedmsg) return res.status(200).send({message : "Se actualizo la puntuacion"})

            if(!updatedmsg) return res.status(404).send({message : "No se pudo modificar"})
        })
    }


})
}

function getPuntaje (req,res){

   var  id = req.body.id;
   var i=0,total=0,prom=0;


    Puntaje.find({receiver : id}).exec((err,puntajes)=>{


if(err) return res.status(500).send({message : "Ocurrio un error"})

if(puntajes){

    puntajes.forEach(element => {
        total=parseFloat(element.contenido)+parseFloat(element.calidad)+parseFloat(element.puntualidad)+total;

      
      
        i=i+1;
    });
    prom = total/(puntajes.length*3);

    return res.status(200).send({prom})
}


    })


}



function getPuntajes (req,res){

    var  id = req.body.id;
    var i=0,total=0,prom=0;
 
     Puntaje.find({receiver : id}).populate('emitter').exec((err,puntajes)=>{
 
 
 if(err) return res.status(500).send({message : "Ocurrio un error",error: err})
 
 if(puntajes){
    var array = [];
    var i;

puntajes.forEach(element => {
    array.push({contenido:element.contenido,
                calidad:element.calidad,
                puntualidad: element.puntualidad,
                emitter: element.emitter.name})
    
});
  



     return res.status(200).send(

array
       
     )
 }
 
 
     })
 
 
 }


module.exports = {
    puntuar,
    getPuntaje,
    getPuntajes

}

