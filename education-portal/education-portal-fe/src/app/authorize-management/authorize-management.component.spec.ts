import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeManagementComponent } from './authorize-management.component';

describe('AuthorizeManagementComponent', () => {
  let component: AuthorizeManagementComponent;
  let fixture: ComponentFixture<AuthorizeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorizeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorizeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
