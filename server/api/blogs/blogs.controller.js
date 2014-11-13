'use strict';

var Tumblr = require('tumblr');
var async = require('async');
var request = require('request');
var db = require('mongoose');
var currUser;
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
            User.find({'following.name': 'twinktopia'}, {'following.$': 1}, {'_id': user.id}, function(err, user, following){
            });
            getPosts(user, oauth, User);

        });


    });
};

function getPosts(user, oauth, User){
    var blogs = user.following;
    var lastUpdated;
    User.find({'_id': user.id}, function(err, response){
        lastUpdated = (typeof response.allPhotos !== 'undefined') ? response.allPhotos.lastUpdated : 0;
    });
    var i = 0;
    var setter = {};
    var posts = [];
    var postsAll = [];
    var filterExt = 'gif';
    var fileNames = [];
    var lastSlash = 0;

    async.each(blogs, function(blog, callback){
        request({
            url: 'http://api.tumblr.com/v2/blog/' + blog.name + '.tumblr.com/posts?api_key=' + oauth.consumer_key,
            method: 'GET',
            json: true
        }, function(err, res, body) {
            if (typeof res !== 'undefined'){
                async.each(res.body.response.posts, function(post, callback){

                    if (Array.isArray(post.photos) && post.photos.length > 0 && post.timestamp > lastUpdated){

                        async.each(post.photos, function(photo, callback){

                            async.each(photo.alt_sizes, function(size, callback){
                                var fileName = '';

                                if(size.width == 500 && size.url.substring(size.url.length-3, size.url.length) !== filterExt){

                                    lastSlash = size.url.lastIndexOf('/');
                                    fileName = size.url.substring(lastSlash+1, size.url.length);
                                    if (fileNames.length > 0 && fileNames.indexOf(fileName) === -1){
                                        posts.push(size);
                                        postsAll.push({timestamp: post.timestamp, photo: size});
                                    }
                                    fileNames.push(fileName);
                                    //postsAll['data']
                                }
                                callback();
                            }, function(err){});
                            callback();
                        }, function(err){});
                    }
                    callback();
                }, function(err){

                });

                setter['following.$.photos'] = posts;
                posts = [];
                User.update({'following.name': blog.name},
                    {'$set': setter},
                    function(err, result){
                        User.find({'_id': user.id}, function(err, response){

                        });
                    });
            }





            callback();
        });


    }, function(err){
        if (err) {
            console.log('error');
        } else {
            //console.log(fileNames);
            async.sortBy(postsAll, function(x, callback){
                callback(err, x.timestamp*-1);
            }, function(err, results){

                User.update({'_id': user.id}, {'$set': {'allPhotos.lastUpdated': results[0].timestamp}},
                    function(err,result){});

                User.update({'_id': user.id},
                    {'$push': {'allPhotos.photos': {$each: results}}},
                    function(err, result){
                        User.find({'_id': user.id}, function(err, response){
                            console.log(response);
                        });
                    });
            });

            console.log('finished');
        }
    });

}

setInterval(function(){

    getPosts(currUser, currOauth, currUserModel);
}, 30000);