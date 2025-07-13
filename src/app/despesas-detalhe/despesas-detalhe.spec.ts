import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesasDetalhe } from './despesas-detalhe';

describe('DespesasDetalhe', () => {
  let component: DespesasDetalhe;
  let fixture: ComponentFixture<DespesasDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DespesasDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespesasDetalhe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
