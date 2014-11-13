'use strict';

angular.module('nufeedsApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
      $scope.blogs = [];
      $scope.photos = [];
      $scope.getCurrentUser = Auth.getCurrentUser;
      $scope.getToken = Auth.getToken;
        $scope.currentBlog = '';
        $scope.all = true;

      //console.log($scope.getCurrentUser());

        console.log($scope.getCurrentUser().following);

      $scope.showBlog = function(blog){
          $scope.all = false;
          console.log($scope.all);

        $scope.currentBlog = blog;
        //$scope.photos = getPhotos(blog);
      };

        $scope.allBlogs = function(){
            $scope.all = true;
            console.log($scope.getCurrentUser().following);
        };

      //$http.jsonp('http://api.tumblr.com/v2/user/following')
      //    .success(function(blogs) {
      //      $scope.blogs = blogs;
      //      socket.syncUpdates('thing', $scope.blogs);
      //});

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('thing');
      });

      //function getPhotos(blog){
      //  var posts = [];
      //
      //  for (var i = 0; i < blog.posts.length; i++){
      //
      //    for (var j = 0; j < blog.posts[i].photos.length; j++){
      //      posts.push(blog.posts[i].photos[j]);
      //    }
      //  }
      //
      //    return posts;
      //}
  });
