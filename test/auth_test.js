var expect = require('chai').expect;
var request = require('superagent');

var model = require("../model/User");

var baseUrl = 'http://localhost:8080/api/auth';

describe('Auth Tests', function(){

  describe('When No One in Database', function(){
    describe('it should not accept malformed requests.', function(){
      it("should not authenticate anyone w/ out a email and password", function(done){
        request.post(baseUrl + '/local').end(function assert(err, res){
          //Bad Request
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("should not authenicate anyone w/ only a email", function(done){
        request.post(baseUrl + '/local').type('form').send({ email:'test@test.com' }).end(function assert(err, res){
          //Bad Request
          expect(res.status).to.equal(400);
          done();
        });
      });
      it("should not authenicate anyone w/ only a password", function(done){
        request.post(baseUrl + '/local').type('form').send({ password:'mypassword' }).end(function assert(err, res){
          //Bad Request
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    it('should not authenticate w/ an email and password sent', function(done){
      request.post(baseUrl + '/local').type('form').send({ email:'test@test.com', password:'pass123' }).end(function assert(err, res){
        //Unauthorized
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
  describe('After Adding Someone to Database', function(){
    before(function(done){
      //malformedRequestTests();
      //Add a user to the DB
      var newUser = model({
        local: {
          email: 'test@test.com',
          password: 'password123'
        }
      });
      newUser.save(function(err){
        done();
      });
    });
    it('should not authenicate an unauthenicated user', function(done){
      request.post(baseUrl + '/local').type('form').send({ email:'test@test.com', password:'pass123' }).end(function assert(err, res){
        //Unauthorized
        expect(res.status).to.equal(401);
        done();
      });
    });
    it('should allow an authenticated user', function(done){
      request.post(baseUrl + '/local').type('form').send({ email:'test@test.com', password:'password123' }).end(function assert(err, res){
        //Unauthorized
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        done();
      });
    });

  });
  describe('When performing a GET or a PUT on /local', function(){
    it('should return method not allowed', function(done){
      request.put(baseUrl + '/local').end(function assert(err, res){
        //Unauthorized
        expect(res.status).to.equal(405);
        done();
      });
    });
    it('should return method not allowed', function(done){
      request.get(baseUrl + '/local').end(function assert(err, res){
        //Unauthorized
        expect(res.status).to.equal(405);
        done();
      });
    });
  });
});


/*
  Some of these tests are grouped into subtests because they are run when users are in the database and out of the database
*/
function malformedRequestTests(){

}
