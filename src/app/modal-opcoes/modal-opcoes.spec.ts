import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOpcoes } from './modal-opcoes';

describe('ModalOpcoes', () => {
  let component: ModalOpcoes;
  let fixture: ComponentFixture<ModalOpcoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalOpcoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalOpcoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
