var express = require('express');

var utils = require('./utils');
var error = require('./errors');

var jwt = require('jsonwebtoken');

//DB Connection
var model = require("../model/User");

var config = require('../config/auth');

var router = express.Router();

//Send a User
//Param is MongoDB User Model
function sendUser(res, user){
  var token = jwt.sign({
    user: user.local.email,
    scopes: user.scopes
  }, config.jwtToken, {
        expiresIn: 1440 // expires in 24 hours
  });
  res.status(200).json({
    token: token
  });
}

//Local Auth

router.post('/local', function(req,res){
  if(!req.body.email || !req.body.password){
    error.invalidRequest(res);
  }else{
    model.findOne( { 'local.email': req.body.email}, function(err, user){
      if(err || !user){
        error.unauthorizedError(res);
      }else{
        if(user.validPassword(req.body.password)){
          sendUser(res, user);
        }else{
          error.unauthorizedError(res);
        }
      }
    });

  }
});

//Not Allowed GET, PUT

router.get('/local',function(req, res){
  error.methodNotAllowed(res);
});

router.put('/local',function(req, res){
  error.methodNotAllowed(res);
});

module.exports = router;
