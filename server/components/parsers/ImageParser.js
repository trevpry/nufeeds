'use strict';

var async = require('async');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var ImageParser = function (res, lastUpdated){
    this.res = res;
    this.lastUpdated = lastUpdated;
    this.fileNames = [];
    this.posts = [];
    this.filterExt = 'gif';
};

util.inherits(ImageParser, EventEmitter);

ImageParser.prototype.parseImages = function(){
    var self = this;

    async.eachSeries(this.res.body.response.posts, function(post, callback){

        if (Array.isArray(post.photos) && post.photos.length > 0 && post.timestamp > self.lastUpdated){
            //self.emit('imagesParsed', self.posts);
            async.eachSeries(post.photos, function(photo, callback){

                async.eachSeries(photo.alt_sizes, function(size, callback){
                    var fileName = '';

                    if(size.width == 500 && size.url.substring(size.url.length-3, size.url.length) !== self.filterExt){
                        //self.emit('imagesParsed', self.posts);
                        var lastSlash = size.url.lastIndexOf('/');
                        fileName = size.url.substring(lastSlash+1, size.url.length);
                        if (self.fileNames.indexOf(fileName) === -1){
                            //self.posts.push({timestamp: post.timestamp, photo: size});

                            self.emit('imagesParsed', {timestamp: post.timestamp, photo: size});
                        }
                        self.fileNames.push(fileName);
                    }

                    callback();
                }, function(err){});
                callback();
            }, function(err){});
        }
        callback();
    }, function(err){
        if(err) self.emit('imageParseComplete', err);

        self.emit('imageParseComplete', self.fileNames);
    });
};

module.exports = ImageParser;
