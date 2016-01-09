var expect = require('chai').expect;
var request = require('superagent');

var model = require("../model/Flight");

var baseUrl = 'http://localhost:8080/api/flights';

var jwt = require('jsonwebtoken');

describe('Flight Model Tests', function(){
  describe('When Requesting Flight List w/ No Parameters', function(){
    it('should return a list of flights and display no more than 10', function(done){
      request.get(baseUrl).end(function assert(err, res){
        expect(err).to.not.be.ok;
        expect(res.body).to.have.property('flights');
        expect(res.body.flights.length <= 10).to.be.ok;
        done();
      });
    });
    it('should return a list of flights and display no more than 10 when a length isn\'t specified', function(done){
      request.get(baseUrl+'?page=3').end(function assert(err, res){
        expect(err).to.not.be.ok;
        expect(res.body).to.have.property('flights');
        expect(res.body.flights.length <= 10).to.be.ok;
        done();
      });
    });
    it('should return a list of flights and display no more than 5 when a length of 5 is specified', function(done){
      request.get(baseUrl+'?amount=5').end(function assert(err, res){
        expect(err).to.not.be.ok;
        expect(res.body).to.have.property('flights');
        expect(res.body.flights.length <= 5).to.be.ok;
        done();
      });
    });
  });
  describe('After adding 6 flights', function(){
    before(function(done){
      var flights = [];
      for(var i = 0; i < 6; i++){
        var newFlight = model({
          duration: 15,
          weather: 'test',
          notes: 'test'
        });
        flights.push(newFlight);
      }
      model.create(flights, function(err, docs){
        done(err);
      });
    });
    it('should return 6 flights', function(done){
      request.get(baseUrl).end(function assert(err, res){
        expect(err).to.not.be.ok;
        expect(res.body).to.have.property('flights');
        expect(res.body.flights.length == 6).to.be.ok;
        done();
      });
    });
    it('should return 5 flights when 5 is the limit', function(done){
      request.get(baseUrl+'?amount=5').end(function assert(err, res){
        expect(err).to.not.be.ok;
        expect(res.body).to.have.property('flights');
        expect(res.body.flights.length == 5).to.be.ok;
        done();
      });
    });
  });
  describe('When Creating Flights', function(){
    var token = jwt.sign({
      user: 'test@gmail.com',
      scopes: ['admin']
    }, process.env.JWT_SECRET_KEY , {
          expiresIn: 1440 // expires in 24 hours
    });
    before(function(done){
      model.remove({}, function(err, removed){
        done(err);
      });
    });
    it('should allow a flight to be added', function(done){
      var date = Date.now();
      request.post(baseUrl).type('form').send({duration:10, date: date, access_token: token}).end(function assert(err, res){
        expect(err).to.not.be.ok;
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('date');
        expect(res.body).to.have.property('duration');
        expect(new Date(res.body.date)).to.eql(new Date(date));
        expect(res.body.duration).to.equal(10);
        done();
      });
    });
    it('should not allow a bad request', function(done){
      request.post(baseUrl).type('form').send({date: Date.now(), access_token: token}).end(function assert(err, res){
        expect(res.status).to.equal(400);
        done();
      });
    });
    it('should not allow a non-number duration', function(done){
      request.post(baseUrl).type('form').send({duration: 'my bad duration', access_token: token}).end(function assert(err, res){
        expect(res.status).to.equal(400);
        done();
      });
    });
    it('should not allow unauthorized users', function(done){
      request.post(baseUrl).type('form').send({duration: 'my bad duration'}).end(function assert(err, res){
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
});
