# angular-async-validation
A multi purpose directive for input async validation

#### [DEMO](https://codekraft-studio.github.io/angular-async-validation/)

### Installation
You can install it with bower, npm or clone it from github:
```bash
bower install --save angular-async-validation
npm install --save angular-async-validation
```
Than you need to include the script in your app:
```html
<script type="text/javascript" src="dist/angular-async-validation.min.js"></script>
```
And add the module as dependency:
```javascript
angular.module('app', ['angular-async-validation']);
```
Now you are able to use the directive: __async-validation__ in your app.

---

### How it works?
This directive is designed to be reused several times depending on the purpose.
The directive can be used with other validation directives
There are many ways to use it, the first is to use a string that points to the API to which you want to make the asynchronous request, another is using a user-specified function, than you can pass an object of funtions where the key is the validator name and the value is the validation callback.
```html

<input ng-model="myInput" name="" async-validation="'/api/users/:value'" required />

<input ng-model="myInput" name="" async-validation="myFunction" required />

<input ng-model="myInput" name="" async-validation="{
  firstvalidation: firstFunction,
  secondvalidation: secondFunction
}" required />

```

When you use a string that point to a API service, like in the first example, remember that:

> If $http is used then it is important that the server returns a success HTTP response code in order to fulfill the validation and a status level of 4xx in order to reject the validation.

The ngModel directive is __required__ since the $asyncValidators are part of the __ngModel.NgModelController__ object.

For more info see the [NgModelController](https://docs.angularjs.org/api/ng/type/ngModel.NgModelController) page.

---

### Examples

#### Using a function:

You can use a function from the scope of your controller.

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

#### Using a string that point to a API service:

You can pass directly a string that is the endpoint for your validation API.

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

#### Creating multiple async validators:

If you want to run your input validation against multiple async functions you can pass an object like in this example.

```html
<!-- will validate against firstFunction and secondFunction -->
<input ng-model="myInput" name="" async-validation="{
  firstvalidation: firstFunction,
  secondvalidation: secondFunction
}" required />
```
