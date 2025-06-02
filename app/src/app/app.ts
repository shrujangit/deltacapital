import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule
  ]
})
export class App {
  form: FormGroup;

  formConfig = [
    { type: 'text', label: 'Single-line Text', name: 'singleLine', multiline: false },
    { type: 'text', label: 'Multi-line Text', name: 'multiLine', multiline: true },
    { type: 'select', label: 'Dropdown', name: 'dropdown', options: ['Option 1', 'Option 2', 'Option 3'] },
    { type: 'checkbox', label: 'Checkbox Group', name: 'checkboxes', options: ['A', 'B', 'C'] },
    { type: 'radio', label: 'Radio Group', name: 'radioGroup', options: ['X', 'Y', 'Z'] },
    { type: 'date', label: 'Date Picker', name: 'date' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
    this.initializeForm();
  }

  initializeForm(): void {
    this.formConfig.forEach(field => {
      if (field.type === 'checkbox') {
        const checkboxArray = new FormArray([]);
        field.options?.forEach(() => checkboxArray.push(new FormControl<boolean>(false)));
        this.form.addControl(field.name, checkboxArray);
      } else {
        this.form.addControl(field.name, new FormControl('', Validators.required));
      }
    });
  }

  getCheckboxControl(name: string, index: number): FormControl {
    return (this.form.get(name) as FormArray).at(index) as FormControl;
  }

  isCheckboxInvalid(name: string): boolean {
    const array = this.form.get(name) as FormArray;
    return array && array.touched && !array.controls.some(c => c.value);
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
    console.log('Form submitted:', result);
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.formConfig, event.previousIndex, event.currentIndex);
  }
}