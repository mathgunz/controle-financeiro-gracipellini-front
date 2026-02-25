import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Receitas } from './receitas';

describe('Receitas', () => {
  let component: Receitas;
  let fixture: ComponentFixture<Receitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Receitas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Receitas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
