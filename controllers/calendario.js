'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Calendario = require('../models/calendario');


function addcalendario(req,res){

    var userId = req.user.sub;
    var params = req.body;


    var calendario = new Calendario();

    calendario.user=userId;
    calendario.start = params.start;
    calendario.end = params.end;
    calendario.title = params.title;
    calendario.backgroundColor = params.backgroundColor;
    calendario.textColor = params.textColor;


    calendario.save((err,calenstore)=>{

        if(err) return res.startus(500).send({message:"Error en el servidor"})

        if(calenstore) res.status(200).send({message:"Guardado correctamente"})


    })

}


function getCalendario(req,res){

    var userId = req.user.sub;
console.log("calendario");

    Calendario.find({user:userId},(err,calendarios) =>{


        if(err) return res.status(500).send({message:"Error en el sistema"});

        if(calendarios) return res.status(200).send(calendarios);


    })


}


module.exports = {
    addcalendario,
    getCalendario

}