import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListuserPage } from './listuser.page';

describe('ListuserPage', () => {
  let component: ListuserPage;
  let fixture: ComponentFixture<ListuserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListuserPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListuserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
