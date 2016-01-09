var express = require('express');

var utils = require('./utils');
var error = require('./errors');

//DB Connection
var model = require("../model/Flight");

var router = express.Router();

router.get('/', function(req, res){
  var pageString = (req.query.page) || "0";
  var amountString = (req.query.amount) || "10";

  var page = (Number(pageString) != NaN) ? Number(pageString) : 0;
  if(page < 0) page = 0;

  var amount = (Number(amountString) != NaN) ? Number(amountString) : 10;
  if(amount < 1) amount = 1;
  model.find({}).limit(amount).skip(page * amount).sort({
    date: -1
  }).exec(function(err, flights){
    if(err){
      error.internalServerError(res);
    }else{
      res.json({
        flights: flights
      });
    }
  });
});

router.post('/', utils.CheckScopesMiddleware(['admin']),function(req,res){
  if(!req.body.duration){
    error.invalidRequest(res);
  }else if(isNaN(Number(req.body.duration))){
    error.invalidRequest(res);
  }else{
    var flight = model({
      date: req.body.date || Date.now(),
      duration: Number(req.body.duration),
      notes: req.body.notes || '',
      weather: req.body.weather || ''
    });
    flight.save(function(err){
      if(err){
        error.internalServerError(res);
        console.log(err);
      }else{
        res.status(201).json({
          date: flight.date,
          duration: flight.duration,
          notes: flight.notes,
          weather: flight.weather
        });
      }
    });
  }
});

module.exports = router;
