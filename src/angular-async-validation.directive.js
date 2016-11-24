angular.module('angular-async-validation')

.directive('asyncValidation', function ($log) {

	var directive = {
		restrict: 'A',
		require: 'ngModel',
		link: _link
	};

	return directive;

	function _link(scope, elem, attrs, ngModel) {

		// The async validation function
		var validationFunction;

		// The attribute value
		var asyncValidation = scope.$eval(attrs.asyncValidation);

		if( !asyncValidation || !asyncValidation.length || typeof asyncValidation === 'undefined' ) {
			$log.warn('angular-async-validation: missing or empty argument in async-validation attribute on:', elem);
			return;
		}

		// If no options are specified
		// set to the defaults
		if( !ngModel.$options ) {

			ngModel.$options = {
				updateOnDefault: true,
				debounce: 500
			};

		}

		// If is a string use it as
		// path for ajax request
		if( angular.isString(unique) ) {

			validationFunction = function (modelValue, viewValue) {

				// get the value
				var value = modelValue || viewValue;

				// build the url
				var url = unique.replace(':value', value);

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
		if( angular.isFunction(unique) ) {
			validationFunction = unique;
		}

		// Add the async validator
		ngModel.$asyncValidators.unique = validationFunction;

	}

});
