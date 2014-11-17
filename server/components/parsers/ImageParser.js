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
    this.isDuplicate = function(fileName){
        return this.fileNames.indexOf(fileName) !== -1;
    };
};

util.inherits(ImageParser, EventEmitter);

ImageParser.prototype.parseImages = function(){
    var self = this;

    async.eachSeries(this.res.body.response.posts, function(post, callback){

        if (Array.isArray(post.photos) && post.photos.length > 0 && post.timestamp > self.lastUpdated){
            async.eachSeries(post.photos, function(photo, callback){

                async.eachSeries(photo.alt_sizes, function(size, callback){
                    var fileName = '';

                    if(size.width == 500 && size.url.substring(size.url.length-3, size.url.length) !== self.filterExt){
                        var lastSlash = size.url.lastIndexOf('/');
                        fileName = size.url.substring(lastSlash+1, size.url.length);
                        if (!self.isDuplicate(fileName)){
                            self.fileNames.push(fileName);
                            self.emit('imagesParsed', {timestamp: post.timestamp, photo: size});
                        }

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
