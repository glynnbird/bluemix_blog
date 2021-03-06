/*jshint node:true*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

var express = require('express'),
  blog = require('./lib/blog.js'),
  mqlight = require('./lib/mqlight.js');

// setup middleware
var app = express();
var server = require('http').Server(app);
//app.use(app.router);
//app.use(express.errorHandler());
app.use(express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'jade');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views


// socket.io
var io = require('socket.io')(server);

// render index page
app.get('/', function(req, res){
  res.render('index',{ });
});

app.get("/api/add", function(req,res) {
  blog.addBlogPost(req.query.title, req.query.body, function(err, data) {
    res.send(data);
    mqlight.send("broadcast", data);
  });
});

app.get("/api/recent", function(req,res) {
  blog.getRecentBlogPosts( function(err, data) {
    res.send(data);
  });
});

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.
// if we are running locally, use local CouchDB


// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
server.listen(port, host);
console.log('App started on port ' + port);

mqlight.on('message', function(msg) {
  io.emit('post',msg);
  console.log("received mqlight message",msg);
});
/*io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
});
*/

