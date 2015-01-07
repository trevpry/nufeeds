'use strict';

angular.module('nufeedsApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, $timeout) {
        $scope.blogs = [];
        $scope.photos = [];
        $scope.getCurrentUser = Auth.getCurrentUser;
        $scope.getToken = Auth.getToken;
        $scope.currentBlog = '';
        $scope.all = true;
        $scope.selected = '';

        $scope.showBlog = function(blog){
            $scope.all = false;

            $scope.selected = blog.name;
            $scope.currentBlog = blog;
      };

        $scope.allBlogs = function(){
            $scope.selected = 'all';
            $scope.all = true;
        };

        $scope.itemClass = function(item){
          return item === $scope.selected ? 'current' : undefined;
        };
  });
