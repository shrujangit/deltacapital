import { Component } from '@angular/core';
import {
  FormBuilder, FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule,
  ValidatorFn, AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormData } from "../form-data/form-data";

@Component({
  selector: 'app-admin-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule,
    MatTabsModule,
    FormData
],
  templateUrl: './admin-form.html',
  styleUrl: './admin-form.scss'
})
export class AdminForm {
  adminForm: FormGroup;
  formConfig: any[] = [
    { type: 'text', label: 'Single-line Text', name: 'singleLine', multiline: false },
    { type: 'text', label: 'Multi-line Text', name: 'multiLine', multiline: true },
    { type: 'select', label: 'Dropdown', name: 'dropdown', options: ['Option 1', 'Option 2', 'Option 3'] },
    { type: 'checkbox', label: 'Checkbox Group', name: 'checkboxes', options: ['A', 'B', 'C'] },
    { type: 'radio', label: 'Radio Group', name: 'radioGroup', options: ['X', 'Y', 'Z'] },
    { type: 'date', label: 'Date Picker', name: 'date' }
  ];
  fieldCounter = 0;
  submittedData: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.adminForm = this.fb.group({});
    this.initializeForm();
  }

  initializeForm(): void {
    this.formConfig.forEach(field => this.addFieldToForm(field));
  }

  addFieldToForm(field: any): void {
    if (field.type === 'checkbox') {
      const array = this.fb.array(
        field.options.map(() => new FormControl(false)),
        [this.requireAtLeastOneCheckboxChecked()]
      );
      this.adminForm.addControl(field.name, array);
    } else {
      this.adminForm.addControl(field.name, new FormControl('', Validators.required));
    }
  }

  addField(): void {
    const label = prompt('Enter field label:', 'New Field');
    const type = prompt('Enter field type (text, select, checkbox, radio, date):', 'text');
    if (!label || !type) return;

    const newField: any = {
      label,
      type,
      name: 'field' + (++this.fieldCounter)
    };

    if (type === 'checkbox' || type === 'radio' || type === 'select') {
      const options = prompt('Enter comma-separated options:', 'Option 1, Option 2');
      newField.options = options?.split(',').map((o: string) => o.trim()) || [];
    } else if (type === 'text') {
      const multiline = confirm('Should it be multi-line?');
      newField.multiline = multiline;
    }

    this.formConfig.push(newField);
    this.addFieldToForm(newField);
  }

  removeField(fieldName: string): void {
    const index = this.formConfig.findIndex(f => f.name === fieldName);
    if (index !== -1) {
      this.formConfig.splice(index, 1);
      this.adminForm.removeControl(fieldName);
    }
  }

  getCheckboxControl(name: string, index: number): FormControl {
    return (this.adminForm.get(name) as FormArray).at(index) as FormControl;
  }

  isCheckboxGroupInvalid(name: string): boolean {
    const array = this.adminForm.get(name) as FormArray;
    return array && array.invalid && array.touched;
  }

  requireAtLeastOneCheckboxChecked(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      const totalChecked = (formArray as FormArray).controls.filter(control => control.value).length;
      return totalChecked > 0 ? null : { required: true };
    };
  }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const raw = this.adminForm.getRawValue();
    const checkboxOptions = this.formConfig.find(f => f.name === 'checkboxes')?.options;
    const selectedCheckboxes = checkboxOptions?.filter((_, i) => raw.checkboxes[i]);
    const result = { ...raw, checkboxes: selectedCheckboxes };

    this.submittedData = result;
    console.log('Form Data:', result);

    this.http.post('https://jsonplaceholder.typicode.com/posts', result).subscribe({
      next: () => this.snackBar.open('Form submitted successfully!', 'Close', { duration: 3000 }),
      error: () => this.snackBar.open('Submission failed. Please try again.', 'Close', { duration: 3000 })
    });
  }

  onReset(): void {
    this.adminForm.reset();
    const checkboxArray = this.adminForm.get('checkboxes') as FormArray;
    checkboxArray?.controls.forEach(control => control.setValue(false));
    this.submittedData = null;
    this.snackBar.open('Form reset.', 'Close', { duration: 2000 });
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.formConfig, event.previousIndex, event.currentIndex);
  }
}
