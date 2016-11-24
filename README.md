# angular-async-validation
A multi purpose directive for input async validation

### How it works?
This directive is designed to be reused several times depending on the purpose.
The directive can be used with other validation directives
There are two main ways to use it, the first is to use a string that points to the API to which you want to make the asynchronous request, the other is using a user-specified function.
```javascript
<input ng-model="myInput" name="" async-validation="'/api/users/:value'" required />
<input ng-model="myInput" name="" async-validation="checkUsername()" required />
```
The ngModel directive is __required__ since the $asyncValidators are part of the __ngModel.NgModelController__ object.
