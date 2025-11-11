import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiretoresComponent } from './diretores.component';

describe('DiretoresComponent', () => {
  let component: DiretoresComponent;
  let fixture: ComponentFixture<DiretoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiretoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiretoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
