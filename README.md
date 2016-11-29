# angular-async-validation
A multi purpose directive for input async validation

### How it works?
This directive is designed to be reused several times depending on the purpose.
The directive can be used with other validation directives
There are two main ways to use it, the first is to use a string that points to the API to which you want to make the asynchronous request, the other is using a user-specified function.
```html
<input ng-model="myInput" name="" async-validation="'/api/users/:value'" required />
<input ng-model="myInput" name="" async-validation="checkUsername" required />
```
You probably have noticed in the text version the synthax `'/api/users/:value'`, basically __:value__ gets replaced with whatever value is in the input or ngModel element, so the url will become: `'/api/users/codekraft-studio`, in case the user typed codekraft-studio.

#### The ngModel directive is __required__ since the $asyncValidators are part of the __ngModel.NgModelController__ object.
