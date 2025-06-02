import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminForm } from './admin-form';

describe('AdminForm', () => {
  let component: AdminForm;
  let fixture: ComponentFixture<AdminForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
