'use strict';

var async = require('async');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var ImageAdder = function(postsAll, User, userId){
    this.postsAll = postsAll;
    this.User = User;
    this.userId = userId;
};

util.inherits(ImageAdder, EventEmitter);

ImageAdder.prototype.addImages = function(){
    var self = this;

    async.sortBy(this.postsAll, function(x, callback){
        var err = null;
        callback(err, x.timestamp*-1);
    }, function(err, results){

        self.User.update({'_id': self.userId}, {'$set': {'allPhotos.lastUpdated': results[0].timestamp}},
            function(err,result){});

        self.User.update({'_id': self.userId},
            {'$push': {'allPhotos.photos': {$each: results}}},
            function(err, result){
                self.User.find({'_id': self.userId}, function(err, response){
                    self.emit('success', response, results);
                });
            });
    });
};

module.exports = ImageAdder;