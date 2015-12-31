var express = require('express');

var unauthorizedError = exports.unauthorizedError = function(res){
  res.status(401).json({
    message:'Error: Unauthorized to Perform Operation'
  });
  res.end();
}

var invalidRequest = exports.invalidRequest = function(res){
  res.status(400).json({
    message:'Error: Invalid Request. Please Check API Docs.'
  });
  res.end();
}

var internalServerError = exports.internalServerError = function(res){
  res.status(500).json({
    message:'Error: Internal Server Error.'
  });
  res.end();
}

var itemNotFound = exports.itemNotFound = function(res){
  res.status(404).json({
    message:'Error: Content Not Found.'
  });
  res.end();
}

var methodNotAllowed = exports.methodNotAllowed = function(res){
  res.status(405).json({
    message:'Error: Method Not Allowed'
  });
  res.end();
}
