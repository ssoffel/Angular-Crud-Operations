import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormControl, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { Customer } from './customer';
import { RatingValidator } from './rating.validator';
 
//values are hardcoded in, below function is a wrapper so we can pass in parameters
// function ratingRange(c: AbstractControl): { [key: string]: boolean } | null {
//   if (c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5 )) {
//     return { 'range': true };
//   } else {
//     return null;
//   }
// }

// function ratingRange(min: number, max: number): ValidatorFn {
//   return (c: AbstractControl): { [key: string]: boolean } | null => {
//     if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max )) {
//           return { 'range': true };
//         } else {
//           return null;
//         }
//   }
// }

function compareEmails(c: AbstractControl): { [key: string]: boolean} | null {
  const origEmail = c.get('email');
  const conEmail = c.get('confirmEmail');

 

  if (origEmail.pristine || conEmail.pristine) {
     return null;
  }

  if (origEmail.value === conEmail.value) {
     return null;
  }
  console.log('returning true');
  return  { 'match': true };

}




@Component({
  selector: 'app-customer ',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerSignUpForm: FormGroup;
  emailMessage: string; //for displaying to user
  emailConfirmMessage: string;
  firstMessage: string;
  lastMessage: string;
  emailGroupMessage: string;

  get addressGroup(): FormGroup {
    return <FormArray>this.customerSignUpForm.get('addressGroup')
  }

  //Would come from service or back-end
  private validationMessages = {
    required: 'This is a required field.',
    email: 'Please enter a valid email address.',
    match: 'Emails need to match',
    minlength: 'Must be greater than 1 characters',
    maxlength: 'can not exceed 30 characters'
  };

  constructor(private fb: FormBuilder) {

  }
  
  ngOnInit() {
       this.customerSignUpForm = this.fb.group({
         firstName: ['', [Validators.required, Validators.minLength(2) ]],
         lastName: ['', [Validators.required, Validators.maxLength(30) ]],
         emailGroup: this.fb.group({
          email: ['', [Validators.required, Validators.email ]],
          confirmEmail: ['', Validators.required]
         }, {validator: compareEmails }),
         sendCatelog: true,
         phone: '',
         notifaction: 'email',
         rating: [null, RatingValidator.ratingRange(1, 5)],
         addressGroup: this.fb.array([this.buildAddress()])
    });

    this.customerSignUpForm.controls.notifaction.valueChanges.subscribe( value => {
      this.setNotification(value);
    });

    const firstControl = this.customerSignUpForm.get('firstName');
    firstControl.valueChanges.subscribe(value => {
      this.setMessage(firstControl, 'first');
    })

    const lastControl = this.customerSignUpForm.get('lastName');
    lastControl.valueChanges.subscribe(value => {
      this.setMessage(lastControl, 'last');
    })

    const emailControl = this.customerSignUpForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(
      debounceTime(1000))
      .subscribe(value => {
      this.setMessage(emailControl, 'email');
    })

    const emailConfirmControl = this.customerSignUpForm.get('emailGroup.confirmEmail');
    emailConfirmControl.valueChanges.subscribe(value => {
      this.setMessage(emailConfirmControl, 'emailConfirm');
    })

    const emailGroupControl = this.customerSignUpForm.get('emailGroup');
    emailGroupControl.valueChanges.pipe(
      debounceTime(2000))
      .subscribe(value => {
      this.setMessage(emailGroupControl, 'emailGroupConfirm');
    })
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  addAddress(): void {
    this.addressGroup.push(this.buildAddress());
  }

  save() {
    console.log(this.customerSignUpForm);
    console.log('Saved: ' +  JSON.stringify(this.customerSignUpForm.value));
    
  }

  populateTestData() {
    this.customerSignUpForm.patchValue({
      firstName: 'Auston',
      lastName: 'Soffel',
      email: 'mateo@email.com'
      
    })
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerSignUpForm.controls.phone; //get ref to formControl
  
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();
    console.log('phoneControl', phoneControl)

  }

  validationCheck(form: AbstractControl){
    
    let displayId = '';
    if ((form.touched || form.dirty) && !form.valid) {
        const errors = Object.keys(form.errors);
        displayId = this.validationMessages[errors[0]];

      })
      return displayId;
  }

  emailGroupValidation(form: AbstractControl){
    if(form.errors === null){
      return '';
    }
    const errors = Object.keys(form.errors);
    return this.validationMessages[errors[0]];
     
  }

  setMessage(form: AbstractControl, identifer: string): void {
 console.log('form', identifer,  form)
    switch (identifer) {
      case 'email':
        this.emailMessage = this.validationCheck(form);
        break;
      case 'emailConfirm':
       this.emailConfirmMessage = this.validationCheck(form);
       break;
      case 'first':
        this.firstMessage = this.validationCheck(form);
        break;
      case 'last':
       this.lastMessage = this.validationCheck(form);
       break;
       case 'emailGroupConfirm':
       this.emailGroupMessage = this.emailGroupValidation(form);
       break;
  }
};
   
    
   
     
     
   
    
    
  }
}
