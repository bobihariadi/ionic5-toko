import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MasterPage } from './master.page';

describe('MasterPage', () => {
  let component: MasterPage;
  let fixture: ComponentFixture<MasterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MasterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
