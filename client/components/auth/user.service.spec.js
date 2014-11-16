'use strict';

describe('service: user service', function () {

  // load the controller's module
  beforeEach(module('nufeedsApp'));

  var User,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, _User_) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    User = _User_;
  }));

  it('should send a request to change password', function() {
    User.changePassword();
    $httpBackend.expect('PUT', '/api/users/me/password').respond(200, 'success');
  });

  it('should send a request to get user', function() {
    User.get();
    $httpBackend.expect('GET', '/api/users/me/get').respond(200, 'success');
  });
});
