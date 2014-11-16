'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var blogs = require('../../api/blogs/blogs.controller.js');
var ImageParser = require('./ImageParser');
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;

var lastUpdated = 0;

var testPost = {
  body: {
    response: {
      posts: [{
        photos: [
          {alt_sizes: [
            {
              width: 500,
              url: 'http://www.test.com/test/test.jpg'
            }
          ]},
          {alt_sizes: [
            {
              width: 500,
              url: 'http://www.test.com/test/test.jpg'
            }
          ]}
        ],
        timestamp: 1
      }]
    }
  }
};

describe('parseImages component', function() {

  var spy, spy2;
  var imageParser;
  var arg, arg2;

  before(function(done){
    spy = sinon.spy();
    spy2 = sinon.spy();
    imageParser = new ImageParser(testPost, lastUpdated);

    imageParser.on('imagesParsed', spy);
    imageParser.on('imagesParsed', function(value){
      arg = value;
    });

    imageParser.on('imageParseComplete', spy2);
    imageParser.on('imageParseComplete', function(value){
      arg2 = value;
    });
    imageParser.parseImages();
    done();
  });

  it('should fire event on parseImages() call', function(done){
      sinon.assert.called(spy);
      done();
  });

  it('should pass arguments in imagesParsed event', function(done){
      arg.should.be.an.Object;
      arg.should.have.properties('timestamp', 'photo');
      done();
  });

  it('should fire event after all images in all blogs parsed', function(done){
    sinon.assert.called(spy2);
    done();
  });

  it('should pass arguments in imageParseCoplete event', function(done){
    arg2.should.be.an.Array;
    arg2.length.should.equal(2);
    done();
  });
});
