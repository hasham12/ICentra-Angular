import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcentraComponent } from './icentra.component';

describe('IcentraComponent', () => {
  let component: IcentraComponent;
  let fixture: ComponentFixture<IcentraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcentraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcentraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
