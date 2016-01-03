var errors = require('./errors');
var jwt = require('jsonwebtoken');

//This function will check that a users scopes 'authorized_scope' contains 'scopes'
//scopes is scopes that are allowed to access resource
//auth_scopes is the scopes user is authorized for

//See the unit tests for examples
var checkScopes = exports.checkScopes = function(scopes, authorized_scopes){
  //Scopes or Auth Scopes is Undefined
  if(!scopes || !authorized_scopes){
    return false;
  }
  for(var i = 0; i < scopes.length; i++){
    if(authorized_scopes.indexOf(scopes[i]) > -1){
      return true;
    }
  }
  return false;
}

//Middleware for checking authorization
var CheckScopesMiddleware = exports.CheckScopesMiddleware = function(authorized_scopes, req, res, next){
  return function(req, res, next){
    var token = req.body.access_token || req.query.access_token;
    if(token){
      jwt.verify(token, process.env.JWT_SECRET_KEY , function(err, decoded){
        if(err){
          errors.unauthorizedError(res);
        }else{
          var scopes = decoded.scopes;//TODO Add JWT in here
          if(!checkScopes(scopes, authorized_scopes)){
            errors.unauthorizedError(res);
          }else{
            req.scopes = scopes;
            return next();
          }
        }
      });
    }
    else{
      errors.unauthorizedError(res);
    }
  }

}
