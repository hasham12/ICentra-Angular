import { FormGroup, FormControl } from '@angular/forms';

export class FormHelper {

  /**
   * Validates all form controlles in a form group
   * @param formGroup - The form group to validate
   */
  validateAllFormFields(formGroup: FormGroup) {
    this.markFormGroupTouched(formGroup);
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
