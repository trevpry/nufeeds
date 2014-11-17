'use strict';

var Tumblr = require('tumblr');
var async = require('async');
var request = require('request');
var db = require('mongoose');
var eventsModule = require('events');
var events = new eventsModule.EventEmitter();
var ImageParser = require('../../components/parsers/ImageParser.js');
var ImageAdder = require('../../components/ImageAdder.js');
var currUser = '';
var currOauth;
var currUserModel;

exports.add = function(user, tumblr_user, oauth, User){
    currUser = user;
    currOauth = oauth;
    currUserModel = User;
    var blogs_following = tumblr_user.following(function(error, response){
      if (error) {
        throw new Error(error);
      }
        user.following = response['blogs'];

        user.save(function(err) {
            if (err) return err;

            getPosts(user, oauth, User);
        });
    });
};



var getPosts = function (user, oauth, User){
    var blogs = user.following;
    var lastUpdated;
    User.find({'_id': user.id}, function(err, response){
        lastUpdated = (typeof response.allPhotos !== 'undefined') ? response.allPhotos.lastUpdated : 0;
    });
    var setter = {};
    var posts = [];
    var postsAll = [];
    var fileNames = [];

    async.each(blogs, function(blog, callback){
        request({
            url: 'http://api.tumblr.com/v2/blog/' + blog.name + '.tumblr.com/posts?api_key=' + oauth.consumer_key,
            method: 'GET',
            json: true
        }, function(err, res) {

            if (typeof res !== 'undefined'){
                var imageParser = new ImageParser(res, lastUpdated);

                imageParser.on('imagesParsed', function(parsed){
                    postsAll.push(parsed);
                    posts.push(parsed.photo);
                });

                imageParser.on('imageParseComplete', function(files){
                    fileNames.push(files);

                    setter['following.$.photos'] = posts;

                    User.update({'following.name': blog.name},
                        {'$set': setter},
                        function(err, result){
                            console.log(posts);
                            posts = [];
                        });

                });

                imageParser.parseImages();
            }

            callback();
        });


    }, function(err){
        if (err) {
            console.log('error');
        } else {
            var imageAdder = new ImageAdder(postsAll, User, user.id);

            imageAdder.on('success', function(){
                console.log('finished');
            });
            imageAdder.addImages();
        }
    });
};

exports.getPosts = getPosts;

//setInterval(function(){
//
//    getPosts(currUser, currOauth, currUserModel);
//}, 30000);