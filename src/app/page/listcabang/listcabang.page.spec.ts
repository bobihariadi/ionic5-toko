import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListcabangPage } from './listcabang.page';

describe('ListcabangPage', () => {
  let component: ListcabangPage;
  let fixture: ComponentFixture<ListcabangPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListcabangPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListcabangPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
