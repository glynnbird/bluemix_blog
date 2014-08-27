var mqlight = require('mqlight')
 
 

var generate = function() {
  var charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var len = charSet.length;
  var retval = "";
  for(var i = 0 ; i < 16;  i ++) {
    retval = retval + charSet[ Math.floor(Math.random()*len)];
  }
  return retval;
}


var services = process.env.VCAP_SERVICES;
var url = 'amqp://localhost';
var options = { service: url, id: generate() };
if(typeof services != 'undefined') {
  console.log(services);
  services = JSON.parse(services);
  console.log(services);
  options.user = services.mqlight[0].credentials.username;
  options.password = services.mqlight[0].credentials.password;
  options.service = services.mqlight[0].credentials.connectionLookupURI;
}
console.log(options);



var client = mqlight.createClient(options);
client.on('connected', function() {
  console.log("Connected to mqlight service");
    // Create an private destination with the topicPattern 'topic1'
    client.subscribe('broadcast');
});
client.on('error', function(err) {
  console.log("mqlight error",err)
})
client.connect(function(err, data) {
  console.log("client connect", err,data);
});


module.exports = client;

//module.exports = {}