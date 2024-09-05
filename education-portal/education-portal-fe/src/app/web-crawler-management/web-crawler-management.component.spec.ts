import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCrawlerManagementComponent } from './web-crawler-management.component';

describe('WebCrawlerManagementComponent', () => {
  let component: WebCrawlerManagementComponent;
  let fixture: ComponentFixture<WebCrawlerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebCrawlerManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebCrawlerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
