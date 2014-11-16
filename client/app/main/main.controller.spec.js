'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('nufeedsApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/things')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  //it('should attach current user to the scope', function () {
  //  //$httpBackend.flush();
  //  expect(scope.getCurrentUser().role).toBe('user');
  //});

  it('should set "all" to false on init', function(){
    expect(scope.all).toBe(true);
  });

  it('should set "all" to false when showBlog called', function() {
    scope.showBlog();

    expect(scope.all).toBe(false);
  });

  it('should set "all" to true when allBlogs called', function() {
    scope.allBlogs();

    expect(scope.all).toBe(true);
  });

  it('should set currentBlog to parameter value when showBlog called', function() {
    scope.showBlog('test');

    expect(scope.currentBlog).toBe('test');
  });
});
