'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var blogs = require('./blogs.controller.js');
var User = require('../user/user.model');

var user = {
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password',
  following: {}
};

var testBlogs = {
  blog1: 'blog1',
  blog2: 'blog2'
};

describe('Blogs controller', function() {

  it('user should have "following" object', function(done){
    user.should.have.property('following');
    done();
  });

  it('should begin with no blogs', function(done) {
    user.following.should.be.empty;
    done();
  });

  it('should set following to passed in data', function(done){
    user.following = testBlogs;
    user.following.should.have.property('blog1', 'blog1');
    done();
  });
});
