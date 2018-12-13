var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Node node sv',
  description: 'node sv.',
  script: 'C:\Users\Julian-Vm\Desktop\socialmedik\api\app.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();