import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModaluserPage } from './modaluser.page';

describe('ModaluserPage', () => {
  let component: ModaluserPage;
  let fixture: ComponentFixture<ModaluserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaluserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModaluserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
