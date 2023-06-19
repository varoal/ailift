import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenLayoutComponent } from './full-screen-layout.component';

describe('FullScreenLayoutComponent', () => {
  let component: FullScreenLayoutComponent;
  let fixture: ComponentFixture<FullScreenLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullScreenLayoutComponent]
    });
    fixture = TestBed.createComponent(FullScreenLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
