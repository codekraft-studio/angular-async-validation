angular.module('angular-async-validation')

.directive('asyncValidation', ['$log', '$q', '$http', '$parse', function ($log, $q, $http, $parse) {
	
	var _pattern = new RegExp(':value');

	var directive = {
		restrict: 'A',
		require: 'ngModel',
		scope: { asyncValidation: '=', validatorName: '@?' },
		link: _link
	};

	return directive;
	
	function _link(scope, elem, attrs, ngModel) {
		
		// The async validation function
		var validationFunction, validatorName = scope.validatorName ? scope.validatorName : 'asyncValidator';

		// Check if the argument passed satisfy the requirements
		if( !scope.asyncValidation ) {
			$log.warn('angular-async-validation: missing or empty argument in async-validation attribute on:', elem);
			return;
		}
		
		// If no options are specified set to the defaults
		if( !ngModel.$options || !ngModel.$options.getOption('debounce')  ) {

			ngModel.$options = ngModel.$options.createChild({
				'*': '$inherit',
				updateOnDefault: true,
				debounce: 500
			});

		}

		// Example: async-validation="{ validator1: myFunc, validator2: myFunc2 }"
		// 
		// If is a object of validator fucntions
		if( angular.isObject(scope.asyncValidation) ) {
			
			angular.forEach(scope.asyncValidation, function(callback, validator) {
				
				// TODO: chck if is passed a func or string
				
				if( angular.isFunction(callback) ) {
					
					// Add the async validator using custom validator name
					ngModel.$asyncValidators[validator] = callback;
					
				}
			
			});
			
		}
		
		// Check scope variable type
		if( angular.isString(scope.asyncValidation) || angular.isFunction(scope.asyncValidation) ) {
			
			// Example: async-validation="myFunc"
			// 
			// If is a valid function assign it directly
			if( angular.isFunction(scope.asyncValidation) ) {
				validationFunction = scope.asyncValidation;
			}
	
			// Example: 
			// 	async-validation="'/api/test/:value'"
			// 	async-validation="'/api/test?q=:value'"
			// 
			// If is a valid formatted string use it in a custom function
			if( angular.isString(scope.asyncValidation) ) {
				
				// Inform user that bad string was used
				if( !_pattern.test(scope.asyncValidation) ) {
					$log.warn('angular-async-validation: You enter a bad callback string:', scope.asyncValidation, 'it must contain :value');
					return;
				}
				
				// Create a custom validation callback
				validationFunction = function (modelValue, viewValue) {
	
					// get the current value
					var value = modelValue || viewValue;
	
					// Consider empty models to be valid
					// for this type of validation
					if (ngModel.$isEmpty(value)) {
	          return $q.resolve();
	        }
	
					// Init the deferred object
					var deferred = $q.defer();
	
					// build the url
					var url = scope.asyncValidation.replace(':value', value);
	
					// run the request
					$http.get(url, {
						notifyError: false
					}).then(function (response) {
	
						if( !response.data ) {
							deferred.resolve();
						} else {
							deferred.reject();
						}
						
					}, function () {
						deferred.resolve();
					});
	
					return deferred.promise;
	
				};
	
			}
	
			// Add the async validator (optionally using custom name)
			ngModel.$asyncValidators[validatorName] = validationFunction;
			
		}
		
	}

}]);
