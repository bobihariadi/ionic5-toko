import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalbarangPage } from './modalbarang.page';

describe('ModalbarangPage', () => {
  let component: ModalbarangPage;
  let fixture: ComponentFixture<ModalbarangPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalbarangPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalbarangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
