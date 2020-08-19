import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalcabangPage } from './modalcabang.page';

describe('ModalcabangPage', () => {
  let component: ModalcabangPage;
  let fixture: ComponentFixture<ModalcabangPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalcabangPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalcabangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
