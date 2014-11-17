'use strict';

angular.module('nufeedsApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, $timeout) {
      $scope.blogs = [];
      $scope.photos = [];
      $scope.getCurrentUser = Auth.getCurrentUser;
      $scope.getToken = Auth.getToken;
        $scope.currentBlog = '';
        $scope.all = true;



      //console.log($scope.getCurrentUser());

        console.log($scope.getCurrentUser().role);

      $scope.showBlog = function(blog){
          $scope.all = false;
          console.log($scope.all);

        $scope.currentBlog = blog;
        //$scope.photos = getPhotos(blog);
      };

        $scope.allBlogs = function(){
            $scope.all = true;
            //console.log($scope.getCurrentUser().following);
        };

        $timeout(function(){
            $('.imagesAll').css('border: 2px solid green');
        });


      //$http.jsonp('http://api.tumblr.com/v2/user/following')
      //    .success(function(blogs) {
      //      $scope.blogs = blogs;
      //      socket.syncUpdates('thing', $scope.blogs);
      //});

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('thing');
      });

        //$scope.lineInView = function(index, inview, inviewpart, event){
        //  var inViewReport = inview ? '<strong>enters</strong>strong>' : '<strong>exit</strong>';
        //    if (typeof(inviewpart) != 'undefined'){
        //        inViewReport = '<strong>' + inviewpart + '</strong> part ' + inViewReport;
        //    }
        //    //event.inViewTarget.addClass('in-view');
        //    console.log(inview);
        //    return inview;
        //};

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
