import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaConta } from './nova-conta';

describe('NovaConta', () => {
  let component: NovaConta;
  let fixture: ComponentFixture<NovaConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaConta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
