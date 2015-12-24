var express = require('express');

var utils = require('./utils');
var error = require('./errors');

//DB Connection
var model = require("../model/User");

var router = express.Router();

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
          res.status(200).json({message: 'sucess'});
        }else{
          error.unauthorizedError(res);
        }
      }
    });

  }
});

module.exports = router;
