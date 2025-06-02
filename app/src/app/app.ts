import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
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
    DragDropModule,
    MatTableModule
  ]
})
export class App {
  formConfig = [
    { type: 'text', label: 'Single-line Text', name: 'singleLine', multiline: false },
    { type: 'text', label: 'Multi-line Text', name: 'multiLine', multiline: true },
    { type: 'select', label: 'Dropdown', name: 'dropdown', options: ['Option 1', 'Option 2', 'Option 3'] },
    { type: 'checkbox', label: 'Checkbox Group', name: 'checkboxes', options: ['A', 'B', 'C'] },
    { type: 'radio', label: 'Radio Group', name: 'radioGroup', options: ['X', 'Y', 'Z'] },
    { type: 'date', label: 'Date Picker', name: 'date' }
  ];

  form: FormGroup;
  submittedData: any = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
    this.form = this.fb.group({
      singleLine: ['', Validators.required],
      multiLine: ['', Validators.required],
      dropdown: ['', Validators.required],
      radioGroup: ['', Validators.required],
      date: ['', Validators.required],
      checkboxes: this.fb.array(
        this.formConfig.find(f => f.name === 'checkboxes')?.options?.map(() => new FormControl<boolean>(false)) || [],
        [this.requireAtLeastOneCheckboxChecked()]
      )
    });
  }

  getCheckboxControl(name: string, index: number): FormControl {
    return (this.form.get(name) as FormArray).at(index) as FormControl;
  }

  isCheckboxGroupInvalid(name: string): boolean {
    const array = this.form.get(name) as FormArray;
    return array && array.invalid && array.touched;
  }

  requireAtLeastOneCheckboxChecked(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      const totalChecked = (formArray as FormArray).controls.filter(control => control.value).length;
      return totalChecked > 0 ? null : { required: true };
    };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const checkboxOptions = this.formConfig.find(f => f.name === 'checkboxes')?.options;
    const selectedCheckboxes = checkboxOptions?.filter((_, i) => raw.checkboxes[i]);

    const result = { ...raw, checkboxes: selectedCheckboxes };
    this.submittedData = result;
    console.log('Form Data:', result);

    this.http.post('https://jsonplaceholder.typicode.com/posts', result).subscribe({
      next: res => this.snackBar.open('Form submitted successfully!', 'Close', { duration: 3000 }),
      error: err => this.snackBar.open('Submission failed. Please try again.', 'Close', { duration: 3000 })
    });
  }

  onReset(): void {
    this.form.reset();
    const checkboxArray = this.form.get('checkboxes') as FormArray;
    checkboxArray.controls.forEach(control => control.setValue(false));
    this.submittedData = null;
    this.snackBar.open('Form reset.', 'Close', { duration: 2000 });
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.formConfig, event.previousIndex, event.currentIndex);
  }
}