/*
 This is the test API Server
*/
var express = require('express');

var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

var routes = require('../api/routes.js');

var path = require('path');

var mongoose = require('mongoose');

//Connect to test DB
mongoose.connect("mongodb://localhost/node-api-test");

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api',routes);

var server;

var start = exports.start = function start(port, callback){
  server = app.listen(port, callback);
};

var stop = exports.stop = function stop(callback){
  mongoose.connection.db.dropDatabase();
  server.close(callback);
}
