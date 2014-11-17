'use strict';

var should = require('should');
var app = require('../app');
var request = require('supertest');
var ImageAdder = require('./ImageAdder');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var User = require('../api/user/user.model');

var testPosts = [
  {photo: 'photo1', timestamp: 1},
  {photo: 'photo3', timestamp: 3},
  {photo: 'photo2', timestamp: 2}
];

describe('ImageAdder component', function() {

  var spy;
  var arg;
  var imageAdder;

  before(function(done){

    spy = sinon.spy();
    imageAdder = new ImageAdder(testPosts, User, 1);

    imageAdder.on('success', spy);
    imageAdder.on('success', function(user, result){
      arg = result;
    });

    imageAdder.addImages();
    done();
  });

  it('should fire event on addImages() call', function(done){
    console.log(arg);
    sinon.assert.called(spy);
    done();
  });

  it('should return posts sorted in descending order', function(done){
    arg.should.be.an.Array;
    arg.length.should.equal(3);
    arg.should.eql([
      {photo: 'photo3', timestamp: 3},
      {photo: 'photo2', timestamp: 2},
      {photo: 'photo1', timestamp: 1}
      ]);
    done();
  });

});
