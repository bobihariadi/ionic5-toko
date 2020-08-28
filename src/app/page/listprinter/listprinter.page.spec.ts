import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListprinterPage } from './listprinter.page';

describe('ListprinterPage', () => {
  let component: ListprinterPage;
  let fixture: ComponentFixture<ListprinterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListprinterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListprinterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
