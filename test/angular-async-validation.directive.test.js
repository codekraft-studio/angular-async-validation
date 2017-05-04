describe('Angular Async Validation: Directive', function() {

  var $compile, $log, $rootScope;

  beforeEach(module('angular-async-validation'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$log_){
    $compile = _$compile_;
    $log = _$log_;
    $rootScope = _$rootScope_;
  }));

  it('should throw an error if used without ngModel', function() {

    expect( function() {
      $compile('<input async-validation />')($rootScope)
    } ).toThrow();

  });

  it('should log a warn message if nothing is passed', function() {

    // Spy on $log service
    spyOn($log, 'warn');
    $rootScope.myModel = '';
    var element = $compile('<input ng-model="myModel" async-validation />')($rootScope);
    $rootScope.$digest();
    expect($log.warn).toHaveBeenCalled();

  });

  it('should work with string value as validation', function() {

    // Spy on $log service
    spyOn($log, 'warn');
    $rootScope.myModel = '';
    $rootScope.validator = '/api/test/:value';
    var element = $compile('<input ng-model="myModel" async-validation="validator" />')($rootScope);
    $rootScope.$digest();
    expect($log.warn).not.toHaveBeenCalled();

  });

  it('should work with functions as validation if return promises', inject(function(_$q_) {

    var $q = _$q_;
    // Spy on $log service
    spyOn($log, 'warn');
    $rootScope.myModel = '';
    $rootScope.validator = function() {
      return $q.defer().promise;
    };
    var element = $compile('<input ng-model="myModel" async-validation="validator" />')($rootScope);
    $rootScope.$digest();
    expect($log.warn).not.toHaveBeenCalled();

  }));

  it('should add validation function to model $asyncValidators', function() {

    $rootScope.myModel = '';
    $rootScope.validator = 'myapi/:value';

    var element = $compile('<input ng-model="myModel" async-validation="validator" />')($rootScope);
    var modelCtrl = element.controller('ngModel');

    $rootScope.$digest();

    expect( angular.isFunction(modelCtrl.$asyncValidators.asyncValidation) ).toBeTruthy();

  });

});
