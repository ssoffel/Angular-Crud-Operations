
import { ValidatorFn, AbstractControl } from '@angular/forms';


export class RatingValidator {
//static so whoever uses this class does not have to make an instance of it

     static ratingRange(min: number, max: number): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
          if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max )) {
                return { 'range': true };
              } else {
                return null;
              }
        }
      }
}