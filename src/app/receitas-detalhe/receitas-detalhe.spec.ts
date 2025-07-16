import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceitasDetalhe } from './receitas-detalhe';

describe('ReceitasDetalhe', () => {
  let component: ReceitasDetalhe;
  let fixture: ComponentFixture<ReceitasDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceitasDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceitasDetalhe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
