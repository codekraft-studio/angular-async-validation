# angular-async-validation
A multi purpose directive for input async validation

### How it works?
This directive is designed to be reused several times depending on the purpose.
The directive can be used with other validation directives
There are two main ways to use it, the first is to use a string that points to the API to which you want to make the asynchronous request, the other is using a user-specified function.
```html
<input ng-model="myInput" name="" async-validation="'/api/users/:value'" required />
<input ng-model="myInput" name="" async-validation="myFunction" required />
```

When you use a string that point to a API service, like in the first example, remember that:

> If $http is used then it is important that the server returns a success HTTP response code in order to fulfill the validation and a status level of 4xx in order to reject the validation.

The ngModel directive is __required__ since the $asyncValidators are part of the __ngModel.NgModelController__ object.

For more info see the [NgModelController](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController) page.

### Examples
Using the directive with a custom validation function specified in the controller.
```html
<input ng-model="myInput" name="fullname" async-validation="myValidation" />
```
```javascript
// List of registered usernames
$scope.fullnames = ['Sandokan', 'Charlie Chaplin', 'Pippo Baudo', 'Sponge Bob'];

// The validation function
$scope.myValidation = function (modelValue, viewValue) {

    // Get the value
    var value = modelValue || viewValue;

    return $timeout(function () {

        // Check if is already taken
        if( $scope.fullnames.indexOf(value) > -1 ) {
            // Username exists, this means validation fails
            return $q.reject();
        } else {
            // Username does not exist, therefore this validation passes
            return $q.resolve();
        }

    }, 1250);

}
```

Using a string that point to a API service.
```html
<!-- for validate username -->
<input ng-model="user.username" name="username" async-validation="'/api/users/username/:value'" required />
```
If typed "__test__" will produce: `GET /api/users/username/test`.
```html
<!-- for validate user email -->
<input ng-model="user.email" name="email" async-validation="'/api/users/email/:value'" required />
```
If typed "__validate@mail.com__" will produce: `GET /api/users/email/validate@mail.com`.

Than probably you want to check for the existence of that particular username/email in case of new registration to avoid duplicates or conflicts.
