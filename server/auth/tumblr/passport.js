exports.setup = function (User, config) {
  var passport = require('passport');
  var Tumblr = require('tumblr');
  var TumblrStrategy = require('passport-tumblr').Strategy;
  var blogs = require('../../api/blogs/blogs.controller.js');

  passport.use(new TumblrStrategy({
    consumerKey: config.tumblr.clientID,
    consumerSecret: config.tumblr.clientSecret,
    callbackURL: config.tumblr.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    //console.log(passport.OAuthStrategy.get('http://api.tumblr.com/v2/user/following', token, tokenSecret));
    //console.log(passport._oauth.get('http://api.tumblr.com/v2/user/following', token, tokenSecret));

    var oauth = {
      consumer_key: 'YXS6WCbqgKfsTptsb1MjToFeRUub53Ff7Ke7PHYszl1c08dhJp',
      consumer_secret: 'd9DL4jSzGa8R4ZysAW1LBg25EhUryPCuIbVDASMkTqZR6AszFL',
      token: token,
      token_secret: tokenSecret
    };

    var tumblr_user = new Tumblr.User(oauth);

    //blogs.add(user, tumblr_user);
    //var blogs_following = tumblr_user.following(function(error, response){
    //  if (error) {
    //    throw new Error(error);
    //  }
    //
    //  console.log(response['total_blogs']);
    //  return response['total_blogs'];
    //});

    User.findOne({
      'tumblr.id': profile.username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        //console.log(profile);
        user = new User({
          //name: profile.displayName,
          username: profile.username,
          role: 'user',
          provider: 'tumblr',
          tumblr: profile._json
          //token: token,
          //tokenSecret: tokenSecret
        });
        blogs.add(user, tumblr_user, oauth, User);
        user.save(function(err) {
          if (err) return done(err);
          return done(err, user);
        });
      } else {
        blogs.add(user, tumblr_user);
        return done(err, user);
      }
    });
    }
  ));
};