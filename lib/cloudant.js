var url = "http://127.0.0.1:5984/";

// parse BlueMix  configuration from environment variables, if present
var services = process.env.VCAP_SERVICES
if(typeof services != 'undefined') {
  services = JSON.parse(services);
  url = services.cloudantNoSQLDB[0].credentials.url
}

// start nano with the url of Cloudant or local CouchDB
var nano = require('nano')(url);


module.exports = nano;
  

