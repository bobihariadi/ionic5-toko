import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JualPage } from './jual.page';

describe('JualPage', () => {
  let component: JualPage;
  let fixture: ComponentFixture<JualPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JualPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
