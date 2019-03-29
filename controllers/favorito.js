'use strict'
var User = require('../models/user');
var Favs = require('../models/favorito');
var moment = require('moment');


function adddelfav(req,res){


if(!req.body || req.body ==='' || req.body.receiver=='' || req.body.receiver =='')
return res.status(200).send({message:"Debe enviar todos los datos"});


let emitter= req.user.sub;
let receiver = req.body.receiver;

var favorito = new Favs();
favorito.emitter= emitter;
favorito.receiver=receiver;
favorito.created_at= moment().toDate();

Favs.findOne({emitter:emitter,receiver:receiver},(err,fav) =>{
if(err) return res.status(500).send({message:"Ocurrio un problema en el seridor"});

if(!fav){

favorito.save((err,favoritoStored) =>{


if(err) return res.status(500).send({message:"Ocurrio un problema al insertar el favorito"});

if(favoritoStored){ 
    return res.status(200).send({status:true,message:"Favorito agregado correctamente"});

}else{ 
    return res.status(400).send({message:"No se encontraron usuarios"});
}
})

}

if(fav){
    Favs.findByIdAndRemove(fav._id,(err,deleted) =>{

        if (err) return res.status(400).send({message:"Ocurrio un error al eliminar favorito"});

        if(!deleted) return res.status(400).send({message:"No se encontro un usuario con esos datos"});

        if(deleted) return res.status(200).send({status:false,message:"Eliminado de favoritos correctamente"});


    })
}

})


}


function getsinglefav(req,res){

if(!req.body || req.body ==='' || req.body.receiver=='' || req.body.receiver =='')
return res.status(200).send({message:"Debe enviar todos los datos"});

let emitter = req.user.sub;
let receiver = req.body.receiver;


Favs.findOne({emitter:emitter,receiver:receiver},(err,fav)=>{

if(err) return res.status(500).send({message:"Ocurrio un problema en el servidor"});

if(!fav) return res.status(200).send({status:false,message:"No se encontro el usuario en favoritos"});

if(fav) return res.status(200).send({status:true,message:"El usuario se encuentra en favoritos"});


})



}

function getallfavs(req,res){


//if(!req.body || req.body ==='' || req.body.receiver=='' || req.body.receiver =='')
//return res.status(200).send({message:"Debe enviar todos los datos"});

let emitter = req.user.sub;
//let receiver = req.body.receiver;

Favs.find({emitter:emitter}).populate("receiver").sort('-created_at').exec((err,favslist)=>{

if(err) return res.status(500).send({message:"Ocurrio un problema en el servidor"});

if(!favslist) return res.status(400).send({message:"No se encontraton favoritos"});

if(favslist) return res.status(200).send(favslist);


})



}


module.exports = {
    adddelfav,
    getsinglefav,
    getallfavs
}