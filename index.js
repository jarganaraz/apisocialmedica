'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;


//conect db
//mongoose.connect('mongodb://user:pw@host1.com:27017,host2.com:27017,host3.com:27017/testdb');
mongoose.connect('mongodb://localhost:27017/socialmedica',{ useNewUrlParser: true })
        .then(()=> {
            console.log("la conexion se realizo bien!!");
            //crear servidor
            app.listen(port,()=>{
                console.log("servidor creado");
            });
        
        })
        .catch(err=>console.log(err));


        /*
        const webpush = require('web-push');
 
// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();
 
webpush.setGCMAPIKey('<Your GCM API Key Here>');
webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
 
// This is the same output of calling JSON.stringify on a PushSubscription
const pushSubscription = {
  endpoint: '.....',
  keys: {
    auth: '.....',
    p256dh: '.....'
  }
};
 
webpush.sendNotification(pushSubscription, 'Your Push Payload Text');*/