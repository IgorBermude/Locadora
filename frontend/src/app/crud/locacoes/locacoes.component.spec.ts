import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocacoesComponent } from './locacoes.component';

describe('LocacoesComponent', () => {
  let component: LocacoesComponent;
  let fixture: ComponentFixture<LocacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocacoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
