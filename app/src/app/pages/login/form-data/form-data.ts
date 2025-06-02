import { Component, Input, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-data',
  imports: [MatTableModule, CommonModule],
  templateUrl: './form-data.html',
  styleUrl: './form-data.scss'
})
export class FormData {
  @Input() submittedData;
  @Input() formConfig;
}
