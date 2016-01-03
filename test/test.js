var expect = require('chai').expect;

describe('API Test', function(){
  var app = require('./test_server');
  var port = 8080;

  before(function(done){
    app.start(port, done);
  });

  after(function(done){
    app.stop(done);
  });

  require('./auth_test');
});
