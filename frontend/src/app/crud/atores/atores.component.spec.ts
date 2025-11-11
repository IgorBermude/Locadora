import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtoresComponent } from './atores.component';

describe('AtoresComponent', () => {
  let component: AtoresComponent;
  let fixture: ComponentFixture<AtoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
