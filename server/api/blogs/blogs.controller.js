'use strict';

var Tumblr = require('tumblr');
var async = require('async');
var request = require('request');
var db = require('mongoose');
var eventsModule = require('events');
var events = new eventsModule.EventEmitter();
var ImageParser = require('../../components/parsers/ImageParser.js');
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
    var i = 0;
    var setter = {};
    var parsed;
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

                //parseImages(res, lastUpdated, events);

                imageParser.on('imagesParsed', function(parsed){
                    postsAll.push(parsed);
                    posts.push(parsed.photo);
                    //console.log(parsed);
                    //callback(null, parsed)
                });

                imageParser.on('imageParseComplete', function(fileNames){
                    fileNames.push(fileNames);
                    //console.log(fileNames);
                    //console.log(posts);
                    setter['following.$.photos'] = posts;
                    posts = [];
                    User.update({'following.name': blog.name},
                        {'$set': setter},
                        function(err, result){
                        });
                });

                imageParser.parseImages();

                //async.waterfall([
                //    function(callback){
                //        parseImages(res, lastUpdated);
                //
                //        events.on('imagesParsed', function(parsed){
                //            console.log(parsed);
                //            callback(null, parsed)
                //        });
                //
                //    },
                //    function(parsed, callback){
                //        console.log(parsed);
                //        postsAll.push(parsed.posts);
                //        fileNames.push(parsed.filenames);
                //        callback(null, parsed);
                //    },
                //    function(parsed, callback){
                //        setter['following.$.photos'] = parsed.posts;
                //        parsed = [];
                //        User.update({'following.name': blog.name},
                //            {'$set': setter},
                //            function(err, result){
                //                User.find({'_id': user.id}, function(err, response){
                //
                //                });
                //            });
                //        callback(null, 'done')
                //    }
                //], function (err, result){
                //    console.log(postsAll);
                //});

                //parseImages(res, lastUpdated, function(err, parsed){
                //    console.log('test');
                //    postsAll.push(parsed.posts);
                //    fileNames.push(parsed.filenames);
                //
                //
                //    setter['following.$.photos'] = parsed.posts;
                //    parsed = [];
                //    User.update({'following.name': blog.name},
                //        {'$set': setter},
                //        function(err, result){
                //            User.find({'_id': user.id}, function(err, response){
                //
                //            });
                //        });
                //});
            }

            callback();
        });


    }, function(err){
        if (err) {
            console.log('error');
        } else {
            console.log(postsAll);
            async.sortBy(postsAll, function(x, callback){
                callback(err, x.timestamp*-1);
            }, function(err, results){

                User.update({'_id': user.id}, {'$set': {'allPhotos.lastUpdated': results[0].timestamp}},
                    function(err,result){});

                User.update({'_id': user.id},
                    {'$push': {'allPhotos.photos': {$each: results}}},
                    function(err, result){
                        User.find({'_id': user.id}, function(err, response){
                            //console.log(response);
                        });
                    });
            });

            console.log('finished');
        }
    });

};

exports.getPosts = getPosts;

//setInterval(function(){
//
//    getPosts(currUser, currOauth, currUserModel);
//}, 30000);