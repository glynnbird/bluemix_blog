var url = "http://127.0.0.1:5984/";
var services = process.env.VCAP_SERVICES
console.log("services",services);
if(typeof services != 'undefined') {
  services = JSON.parse(services);
  url = services.cloudantNoSQLDB[0].credentials.url
}
var nano = require('nano')(url);


module.exports = nano;
  

