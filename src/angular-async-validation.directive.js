angular.module('angular-async-validation')

.directive('asyncValidation', ['$log', '$q', '$http', function ($log, $q, $http) {

	var directive = {
		restrict: 'A',
		require: 'ngModel',
		scope: { asyncValidation: '=' },
		link: _link
	};

	return directive;

	function _link(scope, elem, attrs, ngModel) {

		// The async validation function
		var validationFunction;

		// Check if the argument passed satisfy the requirements
		if( !scope.asyncValidation && !angular.isString(scope.asyncValidation) && !angular.isFunction(scope.asyncValidation) ) {
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

		// If is a string use it as path for http request
		if( angular.isString(scope.asyncValidation) ) {

			validationFunction = function (modelValue, viewValue) {

				// get the value
				var value = modelValue || viewValue;

				// Consider empty models to be valid
				// for this type of validation
				if (ngModel.$isEmpty(value)) {
          return $q.resolve();;
        }

				// Init the deferred object
				var deferred = $q.defer();

				// build the url
				var url = scope.asyncValidation.replace(':value', value);

				// run the request
				return $http.get(url, {
					notifyError: false
				}).then(function (response) {
					return $q.reject();
				}, function () {
					return $q.resolve();
				});

			};

		}

		// If is a function defined by users
		// assign it to asyncValidators
		if( angular.isFunction(scope.asyncValidation) ) {
			validationFunction = scope.asyncValidation;
		}

		// Add the async validator
		ngModel.$asyncValidators.asyncValidation = validationFunction;

	}

}]);
